#!/usr/bin/env node

// Vercel Post-Deployment Validation Script
// Validates that all TradeIA features work correctly after deployment

const https = require('https');
const http = require('http');

class VercelDeploymentValidator {
  constructor() {
    this.baseURL = process.env.VERCEL_URL || `https://${process.env.VERCEL_PROJECT_NAME}.vercel.app`;
    this.timeout = 30000; // 30 seconds
    this.maxRetries = 3;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Vercel-Deploy-Validator/1.0',
        'Accept': 'application/json',
        ...options.headers
      },
      timeout: this.timeout
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this._performRequest(url, requestOptions);
        return result;
      } catch (error) {
        if (attempt === this.maxRetries) {
          throw new Error(`Request failed after ${this.maxRetries} attempts: ${error.message}`);
        }
        console.log(`Attempt ${attempt} failed, retrying...`);
        await this.delay(2000 * attempt); // Exponential backoff
      }
    }
  }

  _performRequest(url, options) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      const req = protocol.request(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = data ? JSON.parse(data) : null;
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: jsonData
            });
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.setTimeout(this.timeout);
      req.end(options.body);
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  log(test, status, message, details = null) {
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${message}`);
    if (details && status === 'FAIL') {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }

  async validateDeployment() {
    console.log('🚀 Starting Vercel Deployment Validation...\n');
    console.log(`Target URL: ${this.baseURL}`);
    console.log('='.repeat(60));

    let passed = 0;
    let failed = 0;
    let warnings = 0;

    // Test 1: Basic connectivity
    try {
      const response = await this.makeRequest('/');
      if (response.status === 200) {
        this.log('Basic Connectivity', 'PASS', 'Application is responding');
        passed++;
      } else {
        this.log('Basic Connectivity', 'FAIL', `Unexpected status: ${response.status}`);
        failed++;
      }
    } catch (error) {
      this.log('Basic Connectivity', 'FAIL', 'Application not accessible', error.message);
      failed++;
    }

    // Test 2: Health check endpoint
    try {
      const response = await this.makeRequest('/api/health');
      if (response.status === 200 && response.data?.status) {
        this.log('Health Check', 'PASS', `Health status: ${response.data.status}`);
        passed++;

        // Validate health check structure
        const requiredFields = ['status', 'timestamp', 'version', 'uptime'];
        const hasRequiredFields = requiredFields.every(field => response.data[field] !== undefined);

        if (hasRequiredFields) {
          this.log('Health Check Structure', 'PASS', 'All required fields present');
          passed++;
        } else {
          this.log('Health Check Structure', 'FAIL', 'Missing required fields');
          failed++;
        }
      } else {
        this.log('Health Check', 'FAIL', `Health check failed: ${response.status}`);
        failed++;
      }
    } catch (error) {
      this.log('Health Check', 'FAIL', 'Health check request failed', error.message);
      failed++;
    }

    // Test 3: Security headers
    try {
      const response = await this.makeRequest('/api/health');
      const headers = response.headers;

      const requiredHeaders = {
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block',
        'strict-transport-security': (value) => value && value.includes('max-age')
      };

      let headerScore = 0;
      for (const [header, expected] of Object.entries(requiredHeaders)) {
        const actual = headers[header];
        if (typeof expected === 'function' ? expected(actual) : actual === expected) {
          headerScore++;
        }
      }

      if (headerScore === Object.keys(requiredHeaders).length) {
        this.log('Security Headers', 'PASS', 'All OWASP security headers present');
        passed++;
      } else {
        this.log('Security Headers', 'FAIL', `${headerScore}/${Object.keys(requiredHeaders).length} headers correct`);
        failed++;
      }
    } catch (error) {
      this.log('Security Headers', 'FAIL', 'Security headers check failed', error.message);
      failed++;
    }

    // Test 4: API versioning
    try {
      const response = await this.makeRequest('/api/health');
      const apiVersion = response.headers['x-api-version'];

      if (apiVersion) {
        this.log('API Versioning', 'PASS', `API version: ${apiVersion}`);
        passed++;
      } else {
        this.log('API Versioning', 'WARNING', 'API version header missing');
        warnings++;
      }
    } catch (error) {
      this.log('API Versioning', 'FAIL', 'API versioning check failed', error.message);
      failed++;
    }

    // Test 5: Authentication requirement
    try {
      const response = await this.makeRequest('/api/signals');
      if (response.status === 401) {
        this.log('Authentication Required', 'PASS', 'API correctly requires authentication');
        passed++;
      } else {
        this.log('Authentication Required', 'FAIL', `Expected 401, got ${response.status}`);
        failed++;
      }
    } catch (error) {
      this.log('Authentication Required', 'FAIL', 'Authentication check failed', error.message);
      failed++;
    }

    // Test 6: CORS configuration
    try {
      const response = await this.makeRequest('/api/health', {
        method: 'OPTIONS'
      });

      const corsHeaders = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers'
      ];

      const hasCorsHeaders = corsHeaders.every(header => response.headers[header]);
      if (hasCorsHeaders) {
        this.log('CORS Configuration', 'PASS', 'CORS headers properly configured');
        passed++;
      } else {
        this.log('CORS Configuration', 'WARNING', 'Some CORS headers missing');
        warnings++;
      }
    } catch (error) {
      this.log('CORS Configuration', 'FAIL', 'CORS check failed', error.message);
      failed++;
    }

    // Test 7: Error handling
    try {
      const response = await this.makeRequest('/api/nonexistent');
      if (response.status >= 400) {
        const isJsonError = response.data && typeof response.data === 'object' && response.data.success === false;
        if (isJsonError) {
          this.log('Error Handling', 'PASS', 'Proper error response format');
          passed++;
        } else {
          this.log('Error Handling', 'WARNING', 'Error response not in expected format');
          warnings++;
        }
      } else {
        this.log('Error Handling', 'FAIL', `Expected error status, got ${response.status}`);
        failed++;
      }
    } catch (error) {
      this.log('Error Handling', 'FAIL', 'Error handling check failed', error.message);
      failed++;
    }

    // Test 8: Queue system (if available)
    try {
      const response = await this.makeRequest('/api/queue-test?action=stats');
      if (response.status === 200 && response.data?.stats) {
        this.log('Queue System', 'PASS', 'Queue system operational');
        passed++;
      } else {
        this.log('Queue System', 'WARNING', 'Queue system not accessible or not configured');
        warnings++;
      }
    } catch (error) {
      this.log('Queue System', 'WARNING', 'Queue system check failed (may not be configured)', error.message);
      warnings++;
    }

    // Test 9: API documentation
    try {
      const response = await this.makeRequest('/api/docs');
      if (response.status === 200) {
        this.log('API Documentation', 'PASS', 'Swagger/OpenAPI documentation accessible');
        passed++;
      } else {
        this.log('API Documentation', 'WARNING', 'API documentation not accessible');
        warnings++;
      }
    } catch (error) {
      this.log('API Documentation', 'WARNING', 'API documentation check failed', error.message);
      warnings++;
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VERCEL DEPLOYMENT VALIDATION SUMMARY');
    console.log('='.repeat(60));

    console.log(`\n✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`📊 Total Tests: ${passed + failed + warnings}`);

    const totalTests = passed + failed + warnings;
    const successRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : '0';

    console.log(`\n🎯 Success Rate: ${successRate}%`);

    if (failed === 0 && warnings <= 2) {
      console.log('\n🎉 DEPLOYMENT STATUS: SUCCESSFUL');
      console.log('✅ All critical systems operational');
      console.log('✅ Security measures active');
      console.log('✅ API functionality verified');
      process.exit(0);
    } else if (failed === 0) {
      console.log('\n⚠️ DEPLOYMENT STATUS: MOSTLY SUCCESSFUL');
      console.log('✅ Core functionality working');
      console.log('⚠️ Some non-critical issues to address');
      process.exit(0);
    } else {
      console.log('\n❌ DEPLOYMENT STATUS: FAILED');
      console.log('❌ Critical issues found');
      console.log('🔴 Deployment should be rolled back or fixed');
      process.exit(1);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new VercelDeploymentValidator();

  validator.validateDeployment().catch(error => {
    console.error('💥 Deployment validation failed:', error);
    process.exit(1);
  });
}

module.exports = VercelDeploymentValidator;