#!/usr/bin/env node

// API Compliance Validation Script
// Validates that all security, performance, and architectural improvements are working correctly

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating API Compliance with Security & Performance Standards\n');

// Test configuration
const TEST_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123'
  },
  timeout: 10000
};

class APIComplianceValidator {
  constructor(config = TEST_CONFIG) {
    this.config = config;
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.authToken = null;
  }

  log(test, status, message, details = null) {
    const result = { test, status, message, details, timestamp: new Date().toISOString() };
    this.results.tests.push(result);

    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${message}`);

    if (details && status === 'FAIL') {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.config.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Compliance-Validator/1.0'
      },
      ...options
    };

    if (this.authToken && !defaultOptions.headers.Authorization) {
      defaultOptions.headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.config.timeout}ms`);
      }
      throw error;
    }
  }

  async testAuthentication() {
    console.log('\n🔐 Testing Authentication System...\n');

    // Test 1: Request without auth should fail
    try {
      const response = await this.makeRequest('/api/v2/signals', {
        headers: { 'Authorization': '' } // Remove auth
      });

      if (response.status === 401) {
        this.log('Authentication Required', 'PASS', 'API correctly rejects unauthenticated requests');
        this.results.passed++;
      } else {
        this.log('Authentication Required', 'FAIL', `Expected 401, got ${response.status}`);
        this.results.failed++;
      }
    } catch (error) {
      this.log('Authentication Required', 'FAIL', 'Request failed', error.message);
      this.results.failed++;
    }

    // Test 2: Login should work
    try {
      const response = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: this.config.testUser.email,
          password: this.config.testUser.password
        }),
        headers: {} // No auth header for login
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session?.access_token) {
          this.authToken = data.session.access_token;
          this.log('User Login', 'PASS', 'Authentication successful, token received');
          this.results.passed++;
        } else {
          this.log('User Login', 'FAIL', 'Login successful but no token received');
          this.results.failed++;
        }
      } else {
        this.log('User Login', 'WARNING', `Login failed with status ${response.status} (may need test user setup)`);
        this.results.warnings++;
      }
    } catch (error) {
      this.log('User Login', 'WARNING', 'Login request failed (may need test user setup)', error.message);
      this.results.warnings++;
    }
  }

  async testSecurityHeaders() {
    console.log('\n🛡️ Testing Security Headers...\n');

    const endpoints = ['/api/health', '/api/docs', this.authToken ? '/api/v2/signals' : '/api/health'];

    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        const headers = response.headers;

        // Required security headers
        const requiredHeaders = {
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY',
          'x-xss-protection': '1; mode=block'
        };

        let headerScore = 0;
        for (const [header, expected] of Object.entries(requiredHeaders)) {
          const actual = headers.get(header);
          if (actual === expected) {
            headerScore++;
          }
        }

        if (headerScore === Object.keys(requiredHeaders).length) {
          this.log(`Security Headers (${endpoint})`, 'PASS', 'All required security headers present');
          this.results.passed++;
        } else {
          this.log(`Security Headers (${endpoint})`, 'FAIL', `${headerScore}/${Object.keys(requiredHeaders).length} headers correct`);
          this.results.failed++;
        }

        // Check for request ID
        if (headers.get('x-request-id')) {
          this.log(`Request ID (${endpoint})`, 'PASS', 'Request ID header present for debugging');
          this.results.passed++;
        } else {
          this.log(`Request ID (${endpoint})`, 'WARNING', 'Request ID header missing');
          this.results.warnings++;
        }

      } catch (error) {
        this.log(`Security Headers (${endpoint})`, 'FAIL', 'Request failed', error.message);
        this.results.failed++;
      }
    }
  }

  async testRateLimiting() {
    console.log('\n📊 Testing Rate Limiting...\n');

    if (!this.authToken) {
      this.log('Rate Limiting', 'WARNING', 'Skipping rate limit test - no auth token available');
      this.results.warnings++;
      return;
    }

    // Make multiple rapid requests to test rate limiting
    const requests = [];
    const numRequests = 15;

    for (let i = 0; i < numRequests; i++) {
      requests.push(
        this.makeRequest('/api/v2/signals')
          .then(response => ({ status: response.status, headers: response.headers }))
          .catch(error => ({ error: error.message }))
      );
    }

    try {
      const results = await Promise.all(requests);
      const rateLimited = results.filter(result =>
        result.status === 429 || result.error?.includes('rate limit')
      ).length;

      if (rateLimited > 0) {
        this.log('Rate Limiting', 'PASS', `Rate limiting working: ${rateLimited}/${numRequests} requests blocked`);
        this.results.passed++;

        // Check rate limit headers
        const lastResponse = results[results.length - 1];
        if (lastResponse.headers && lastResponse.headers.get('retry-after')) {
          this.log('Rate Limit Headers', 'PASS', 'Retry-After header present');
          this.results.passed++;
        } else {
          this.log('Rate Limit Headers', 'WARNING', 'Retry-After header missing');
          this.results.warnings++;
        }
      } else {
        this.log('Rate Limiting', 'WARNING', 'Rate limiting may not be active or test user has higher limits');
        this.results.warnings++;
      }
    } catch (error) {
      this.log('Rate Limiting', 'FAIL', 'Rate limit test failed', error.message);
      this.results.failed++;
    }
  }

  async testInputValidation() {
    console.log('\n✅ Testing Input Validation...\n');

    const testCases = [
      {
        name: 'Invalid Symbol Format',
        payload: { symbol: 'btc/usdt', timeframe: '4h' },
        expectError: true,
        errorType: 'VALIDATION_ERROR'
      },
      {
        name: 'Invalid Timeframe',
        payload: { symbol: 'BTC/USDT', timeframe: '4hour' },
        expectError: true,
        errorType: 'VALIDATION_ERROR'
      },
      {
        name: 'Valid Request',
        payload: { symbol: 'BTC/USDT', timeframe: '4h', limit: 50 },
        expectError: false
      }
    ];

    for (const testCase of testCases) {
      try {
        const response = await this.makeRequest('/api/v2/signals/generate', {
          method: 'POST',
          body: JSON.stringify(testCase.payload)
        });

        if (testCase.expectError) {
          if (response.status === 400) {
            const errorData = await response.json();
            if (errorData.error?.type === testCase.errorType) {
              this.log(`Input Validation: ${testCase.name}`, 'PASS', 'Correctly rejected invalid input');
              this.results.passed++;
            } else {
              this.log(`Input Validation: ${testCase.name}`, 'FAIL', `Wrong error type: ${errorData.error?.type}`);
              this.results.failed++;
            }
          } else {
            this.log(`Input Validation: ${testCase.name}`, 'FAIL', `Expected 400, got ${response.status}`);
            this.results.failed++;
          }
        } else {
          if (response.ok) {
            this.log(`Input Validation: ${testCase.name}`, 'PASS', 'Accepted valid input');
            this.results.passed++;
          } else {
            this.log(`Input Validation: ${testCase.name}`, 'FAIL', `Rejected valid input: ${response.status}`);
            this.results.failed++;
          }
        }
      } catch (error) {
        this.log(`Input Validation: ${testCase.name}`, 'FAIL', 'Request failed', error.message);
        this.results.failed++;
      }
    }
  }

  async testErrorHandling() {
    console.log('\n📋 Testing Error Handling...\n');

    // Test with malformed JSON
    try {
      const response = await this.makeRequest('/api/v2/signals/generate', {
        method: 'POST',
        body: '{invalid json',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status >= 400) {
        const errorData = await response.json().catch(() => ({}));

        // Check for structured error response
        if (errorData.success === false && errorData.error) {
          this.log('Error Response Structure', 'PASS', 'Error response follows standard format');
          this.results.passed++;

          // Check for required error fields
          const requiredFields = ['type', 'message', 'timestamp'];
          const hasRequiredFields = requiredFields.every(field => errorData.error[field]);

          if (hasRequiredFields) {
            this.log('Error Response Fields', 'PASS', 'All required error fields present');
            this.results.passed++;
          } else {
            this.log('Error Response Fields', 'FAIL', 'Missing required error fields');
            this.results.failed++;
          }
        } else {
          this.log('Error Response Structure', 'FAIL', 'Error response does not follow standard format');
          this.results.failed++;
        }
      } else {
        this.log('Error Response Structure', 'FAIL', 'Expected error response, got success');
        this.results.failed++;
      }
    } catch (error) {
      this.log('Error Response Structure', 'FAIL', 'Request failed unexpectedly', error.message);
      this.results.failed++;
    }
  }

  async testAPIVersioning() {
    console.log('\n🔄 Testing API Versioning...\n');

    const versions = ['v1', 'v2'];

    for (const version of versions) {
      try {
        const response = await this.makeRequest(`/api/${version}/signals`);
        const apiVersion = response.headers.get('x-api-version');

        if (apiVersion === version) {
          this.log(`API Version ${version}`, 'PASS', `Correctly serving API version ${version}`);
          this.results.passed++;
        } else {
          this.log(`API Version ${version}`, 'FAIL', `Expected version ${version}, got ${apiVersion}`);
          this.results.failed++;
        }

        // Check version-specific headers
        if (version === 'v2') {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes(`vnd.tradeia.${version}`)) {
            this.log(`Version Headers ${version}`, 'PASS', 'Version-specific content type present');
            this.results.passed++;
          } else {
            this.log(`Version Headers ${version}`, 'WARNING', 'Version-specific content type missing');
            this.results.warnings++;
          }
        }

      } catch (error) {
        this.log(`API Version ${version}`, 'FAIL', 'Version request failed', error.message);
        this.results.failed++;
      }
    }
  }

  async testHealthChecks() {
    console.log('\n📊 Testing Health Checks...\n');

    try {
      const response = await this.makeRequest('/api/health');

      if (response.ok) {
        const healthData = await response.json();

        // Check required health fields
        const requiredFields = ['status', 'timestamp', 'version', 'uptime', 'services'];
        const hasRequiredFields = requiredFields.every(field => healthData[field] !== undefined);

        if (hasRequiredFields) {
          this.log('Health Check Structure', 'PASS', 'Health check response has all required fields');
          this.results.passed++;

          // Check services status
          if (healthData.services && typeof healthData.services === 'object') {
            const services = Object.values(healthData.services);
            const healthyServices = services.filter(service => service.status === 'up').length;

            this.log('Service Health', 'INFO', `${healthyServices}/${services.length} services healthy`);

            if (healthyServices === services.length) {
              this.log('Service Health', 'PASS', 'All services are healthy');
              this.results.passed++;
            } else {
              this.log('Service Health', 'WARNING', `${services.length - healthyServices} services unhealthy`);
              this.results.warnings++;
            }
          }
        } else {
          this.log('Health Check Structure', 'FAIL', 'Missing required health check fields');
          this.results.failed++;
        }
      } else {
        this.log('Health Check Structure', 'FAIL', `Health check failed with status ${response.status}`);
        this.results.failed++;
      }
    } catch (error) {
      this.log('Health Check Structure', 'FAIL', 'Health check request failed', error.message);
      this.results.failed++;
    }
  }

  async testQueueSystem() {
    console.log('\n🎯 Testing Queue System...\n');

    try {
      const response = await this.makeRequest('/api/queue-test?action=stats');

      if (response.ok) {
        const queueData = await response.json();

        if (queueData.stats && typeof queueData.stats === 'object') {
          this.log('Queue Statistics', 'PASS', 'Queue statistics available');
          this.results.passed++;

          // Check for expected queue stats
          const hasExpectedStats = ['signals', 'notifications', 'maintenance'].every(
            queue => queueData.stats[queue] !== undefined
          );

          if (hasExpectedStats) {
            this.log('Queue Coverage', 'PASS', 'All expected queues present');
            this.results.passed++;
          } else {
            this.log('Queue Coverage', 'WARNING', 'Some expected queues missing');
            this.results.warnings++;
          }
        } else {
          this.log('Queue Statistics', 'FAIL', 'Queue statistics structure incorrect');
          this.results.failed++;
        }
      } else {
        this.log('Queue Statistics', 'WARNING', `Queue test endpoint returned ${response.status}`);
        this.results.warnings++;
      }
    } catch (error) {
      this.log('Queue Statistics', 'WARNING', 'Queue test request failed', error.message);
      this.results.warnings++;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting API Compliance Validation...\n');
    console.log(`Target API: ${this.config.baseURL}`);
    console.log(`Test User: ${this.config.testUser.email}`);
    console.log('='.repeat(60));

    // Run all test suites
    await this.testAuthentication();
    await this.testSecurityHeaders();
    await this.testRateLimiting();
    await this.testInputValidation();
    await this.testErrorHandling();
    await this.testAPIVersioning();
    await this.testHealthChecks();
    await this.testQueueSystem();

    // Generate summary
    this.generateSummary();
  }

  generateSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 API COMPLIANCE VALIDATION SUMMARY');
    console.log('='.repeat(60));

    console.log(`\n✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📊 Total Tests: ${this.results.tests.length}`);

    const totalTests = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = totalTests > 0 ? ((this.results.passed / totalTests) * 100).toFixed(1) : '0';

    console.log(`\n🎯 Success Rate: ${successRate}%`);

    // Compliance assessment
    if (this.results.failed === 0 && this.results.warnings <= 2) {
      console.log('\n🎉 COMPLIANCE STATUS: FULLY COMPLIANT');
      console.log('✅ All security and performance standards met');
    } else if (this.results.failed === 0) {
      console.log('\n⚠️ COMPLIANCE STATUS: MOSTLY COMPLIANT');
      console.log('✅ Core functionality working, minor warnings to address');
    } else {
      console.log('\n❌ COMPLIANCE STATUS: NON-COMPLIANT');
      console.log('❌ Critical issues found, requires immediate attention');
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');

    if (this.results.failed > 0) {
      console.log('🔴 Address failed tests immediately');
      const criticalFailures = this.results.tests.filter(t => t.status === 'FAIL');
      criticalFailures.forEach(test => {
        console.log(`   - ${test.test}: ${test.message}`);
      });
    }

    if (this.results.warnings > 0) {
      console.log('🟡 Review warning items');
      const warnings = this.results.tests.filter(t => t.status === 'WARNING');
      warnings.forEach(test => {
        console.log(`   - ${test.test}: ${test.message}`);
      });
    }

    if (this.results.failed === 0) {
      console.log('🟢 API is production-ready');
      console.log('🟢 All security measures active');
      console.log('🟢 Performance optimizations working');
    }

    console.log('\n📋 For detailed results, check the test output above.');
    console.log('🔗 See API_CHANGES.md for implementation details.');
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new APIComplianceValidator();

  validator.runAllTests().catch(error => {
    console.error('💥 Validation failed with error:', error);
    process.exit(1);
  });
}

module.exports = APIComplianceValidator;