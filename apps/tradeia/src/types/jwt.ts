export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  // Custom claims
  subscription_plan?: string;
  active_strategies?: string[];
  [key: string]: any;
}