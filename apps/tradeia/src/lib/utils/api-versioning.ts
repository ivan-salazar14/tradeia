import { NextRequest, NextResponse } from 'next/server';

// API Version configuration
export const API_VERSIONS = {
  v1: '2024-01-01', // Initial version
  v2: '2024-09-01', // Current version with improvements
  latest: 'v2'
} as const;

export type APIVersion = keyof typeof API_VERSIONS;

// Version detection strategies
export enum VersionStrategy {
  HEADER = 'header',
  URL = 'url',
  QUERY = 'query',
  ACCEPT_HEADER = 'accept'
}

// Version detection from request
export function detectAPIVersion(request: NextRequest): APIVersion {
  const url = new URL(request.url);

  // 1. Check URL path (e.g., /api/v2/signals)
  const urlMatch = url.pathname.match(/^\/api\/(v\d+)\//);
  if (urlMatch) {
    const version = urlMatch[1] as APIVersion;
    if (version in API_VERSIONS) {
      return version;
    }
  }

  // 2. Check custom header (X-API-Version)
  const headerVersion = request.headers.get('x-api-version') as APIVersion;
  if (headerVersion && headerVersion in API_VERSIONS) {
    return headerVersion;
  }

  // 3. Check query parameter (api_version=v2)
  const queryVersion = url.searchParams.get('api_version') as APIVersion;
  if (queryVersion && queryVersion in API_VERSIONS) {
    return queryVersion;
  }

  // 4. Check Accept header (application/vnd.tradeia.v2+json)
  const acceptHeader = request.headers.get('accept');
  if (acceptHeader) {
    const acceptMatch = acceptHeader.match(/application\/vnd\.tradeia\.(\w+)\+json/);
    if (acceptMatch) {
      const version = `v${acceptMatch[1]}` as APIVersion;
      if (version in API_VERSIONS) {
        return version;
      }
    }
  }

  // Default to latest version
  return API_VERSIONS.latest as APIVersion;
}

// Version compatibility matrix
const VERSION_COMPATIBILITY: Record<APIVersion, APIVersion[]> = {
  v1: ['v1'],
  v2: ['v1', 'v2'], // v2 is backward compatible with v1
  latest: ['v1', 'v2']
};

// Check version compatibility
export function isVersionCompatible(requestedVersion: APIVersion, supportedVersion: APIVersion): boolean {
  return VERSION_COMPATIBILITY[supportedVersion]?.includes(requestedVersion) ?? false;
}

// Version-specific response formatting
export function formatVersionedResponse(
  data: any,
  version: APIVersion,
  request: NextRequest
): NextResponse {
  const response = NextResponse.json(data);

  // Add version headers
  response.headers.set('X-API-Version', version);
  response.headers.set('X-API-Compatible', API_VERSIONS[version]);

  // Version-specific content type
  if (version === 'v2') {
    response.headers.set('Content-Type', `application/vnd.tradeia.${version}+json; charset=utf-8`);
  } else {
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  return response;
}

// Version-specific error responses
export function createVersionedError(
  message: string,
  statusCode: number,
  version: APIVersion,
  details?: any
): NextResponse {
  const errorResponse = {
    success: false,
    error: {
      message,
      code: statusCode,
      ...(version === 'v2' && details && { details }),
      ...(version === 'v1' && { details: undefined }) // v1 doesn't include details
    },
    timestamp: new Date().toISOString(),
    version
  };

  const response = NextResponse.json(errorResponse, { status: statusCode });
  response.headers.set('X-API-Version', version);

  return response;
}

// Middleware for API versioning
export function withVersioning(
  handler: (request: NextRequest, version: APIVersion) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const version = detectAPIVersion(request);

    // Add version to request for use in handlers
    (request as any).apiVersion = version;

    try {
      return await handler(request, version);
    } catch (error) {
      console.error(`[API ${version.toUpperCase()}] Error:`, error);
      return createVersionedError(
        'Internal server error',
        500,
        version,
        process.env.NODE_ENV === 'development' ? error : undefined
      );
    }
  };
}

// Version-specific feature flags
export const VERSION_FEATURES = {
  v1: {
    pagination: false,
    filtering: false,
    advanced_validation: false,
    detailed_errors: false,
    rate_limiting: false
  },
  v2: {
    pagination: true,
    filtering: true,
    advanced_validation: true,
    detailed_errors: true,
    rate_limiting: true
  },
  latest: {
    pagination: true,
    filtering: true,
    advanced_validation: true,
    detailed_errors: true,
    rate_limiting: true
  }
} as const;

// Check if feature is available for version
export function hasFeature(version: APIVersion, feature: keyof typeof VERSION_FEATURES.v2): boolean {
  return VERSION_FEATURES[version]?.[feature] ?? false;
}

// Version migration helpers
export function migrateResponseData(data: any, fromVersion: APIVersion, toVersion: APIVersion): any {
  // Handle breaking changes between versions
  if (fromVersion === 'v1' && toVersion === 'v2') {
    // Add pagination metadata if missing
    if (Array.isArray(data) && !('pagination' in data)) {
      return {
        items: data,
        pagination: {
          total: data.length,
          limit: data.length,
          offset: 0,
          current_page: 1,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      };
    }
  }

  return data;
}

// API endpoint versioning decorator
export function versionedEndpoint(supportedVersions: APIVersion[] = ['v1', 'v2']) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const request = args[0] as NextRequest;
      const version = detectAPIVersion(request);

      if (!supportedVersions.includes(version)) {
        return createVersionedError(
          `API version ${version} is not supported by this endpoint`,
          400,
          version,
          { supported_versions: supportedVersions }
        );
      }

      // Add version context
      (request as any).apiVersion = version;

      return method.apply(this, args);
    };

    return descriptor;
  };
}