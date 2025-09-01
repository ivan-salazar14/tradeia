# API Design for Crypto Signals App

The Crypto Signals app, as described in the Product Requirements Document (PRD), is a web application for crypto traders, busy professionals, and seniors, offering a curated signal marketplace, real-time alerts, trading bot automation, and performance tracking. The API design below outlines the RESTful endpoints required to support the app’s functionality, implemented as Next.js API routes with Supabase for authentication and data storage. The design ensures role-based access, scalability, and alignment with user stories (US-001 to US-008) as of June 21, 2025.

## Endpoint List

### API-001: User Signup
- Method: POST
- Path: /api/auth/signup
- Description: Register a new user account.
- RequiredRoles: Guest
- Parameters:
  - RequestBody:
    - Schema:
      - email: string, required, User’s email address.
      - password: string, required, User’s password (minimum 8 characters).
      - username: string, optional, User’s display name.
- Responses:
  - StatusCode: 201, Description: User created successfully, returns user data and session token.
  - StatusCode: 400, Description: Validation error (e.g., invalid email or weak password).
  - StatusCode: 409, Description: Email already exists.

### API-002: User Login
- Method: POST
- Path: /api/auth/login
- Description: Authenticate a user and return a session token.
- RequiredRoles: Guest
- Parameters:
  - RequestBody:
    - Schema:
      - email: string, required, User’s email address.
      - password: string, required, User’s password.
- Responses:
  - StatusCode: 200, Description: Successful login, returns user data and session token.
  - StatusCode: 401, Description: Invalid credentials.
  - StatusCode: 400, Description: Missing or invalid parameters.

### API-003: User Logout
- Method: POST
- Path: /api/auth/logout
- Description: Log out the current user and invalidate the session.
- RequiredRoles: RegisteredUser
- Parameters: None
- Responses:
  - StatusCode: 200, Description: Successfully logged out.
  - StatusCode: 401, Description: Unauthorized (no valid session).

### API-004: Complete Onboarding
- Method: POST
- Path: /api/onboarding
- Description: Save user onboarding data to customize their experience.
- RequiredRoles: RegisteredUser
- Parameters:
  - RequestBody:
    - Schema:
      - experienceLevel: string, required, Trading experience (e.g., novice, intermediate, advanced).
      - tradingGoals: string, required, User’s trading objectives (e.g., short-term gains, long-term investment).
- Responses:
  - StatusCode: 200, Description: Onboarding data saved successfully.
  - StatusCode: 400, Description: Validation error (e.g., missing fields).
  - StatusCode: 401, Description: Unauthorized.

### API-005: Get Signal Bundles
- Method: GET
- Path: /api/signals/bundles
- Description: Retrieve a list of available signal bundles.
- RequiredRoles: RegisteredUser, Guest
- Parameters:
  - filter: string, optional, Filter bundles by criteria (e.g., provider, asset type).
  - limit: number, optional, Number of bundles to return (default: 20).
  - offset: number, optional, Pagination offset (default: 0).
- Responses:
  - StatusCode: 200, Description: List of signal bundles, each including ID, name, provider, and description.
  - StatusCode: 404, Description: No bundles found.

### API-006: Subscribe to Signal Bundle
- Method: POST
- Path: /api/signals/subscribe
- Description: Subscribe the user to a signal bundle.
- RequiredRoles: RegisteredUser
- Parameters:
  - RequestBody:
    - Schema:
      - bundleId: string, required, ID of the signal bundle.
- Responses:
  - StatusCode: 200, Description: Successfully subscribed.
  - StatusCode: 400, Description: Invalid bundleId.
  - StatusCode: 409, Description: User already subscribed to this bundle.
  - StatusCode: 401, Description: Unauthorized.

### API-007: Unsubscribe from Signal Bundle
- Method: POST
- Path: /api/signals/unsubscribe
- Description: Unsubscribe the user from a signal bundle.
- RequiredRoles: RegisteredUser
- Parameters:
  - RequestBody:
    - Schema:
      - bundleId: string, required, ID of the signal bundle.
- Responses:
  - StatusCode: 200, Description: Successfully unsubscribed.
  - StatusCode: 400, Description: Invalid bundleId.
  - StatusCode: 404, Description: User not subscribed to this bundle.
  - StatusCode: 401, Description: Unauthorized.

### API-008: Get User Signals
- Method: GET
- Path: /api/signals
- Description: Retrieve the list of signals for the current user’s subscribed bundles.
- RequiredRoles: RegisteredUser
- Parameters:
  - limit: number, optional, Number of signals to return (default: 20).
  - offset: number, optional, Pagination offset (default: 0).
  - filter: string, optional, Filter signals by criteria (e.g., date, status).
- Responses:
  - StatusCode: 200, Description: List of signals, each including ID, asset, TP, SL, timestamp, and status.
  - StatusCode: 404, Description: No signals found.
  - StatusCode: 401, Description: Unauthorized.

### API-009: Connect Trading Bot
- Method: POST
- Path: /api/bot/connect
- Description: Connect the user’s trading account for automated signal execution.
- RequiredRoles: RegisteredUser
- Parameters:
  - RequestBody:
    - Schema:
      - exchange: string, required, Exchange name (e.g., Binance, Coinbase).
      - apiKey: string, required, API key for the exchange.
      - apiSecret: string, required, API secret for the exchange.
- Responses:
  - StatusCode: 200, Description: Successfully connected.
  - StatusCode: 400, Description: Validation error (e.g., invalid API key).
  - StatusCode: 401, Description: Unauthorized.

### API-010: Disconnect Trading Bot
- Method: POST
- Path: /api/bot/disconnect
- Description: Disconnect the user’s trading account from automated execution.
- RequiredRoles: RegisteredUser
- Parameters: None
- Responses:
  - StatusCode: 200, Description: Successfully disconnected.
  - StatusCode: 401, Description: Unauthorized.

### API-011: Get Signal Performance
- Method: GET
- Path: /api/signals/performance
- Description: Retrieve performance metrics for the user’s subscribed signals.
- RequiredRoles: RegisteredUser
- Parameters:
  - bundleId: string, optional, Filter by specific bundle ID.
  - dateRange: string, optional, Date range (e.g., last7days, last30days).
- Responses:
  - StatusCode: 200, Description: Performance data including accuracy, profit/loss, and historical metrics.
  - StatusCode: 404, Description: No performance data found.
  - StatusCode: 401, Description: Unauthorized.

### API-012: List Users (Admin)
- Method: GET
- Path: /api/admin/users
- Description: Retrieve a list of all user accounts (admin only).
- RequiredRoles: Admin
- Parameters:
  - filter: string, optional, Filter users by criteria (e.g., status, role).
  - limit: number, optional, Number of users to return (default: 20).
  - offset: number, optional, Pagination offset (default: 0).
- Responses:
  - StatusCode: 200, Description: List of users, each including ID, email, and status.
  - StatusCode: 404, Description: No users found.
  - StatusCode: 403, Description: Forbidden (non-admin access).

### API-013: List Signal Providers
- Method: GET
- Path: /api/signals/providers
- Description: Retrieve a list of signal providers.
- RequiredRoles: RegisteredUser, Guest
- Parameters:
  - filter: string, optional, Filter providers by criteria (e.g., performance).
  - limit: number, optional, Number of providers to return (default: 20).
  - offset: number, optional, Pagination offset (default: 0).
- Responses:
  - StatusCode: 200, Description: List of providers, each including ID, name, and description.
  - StatusCode: 404, Description: No providers found.

### API-014: Get Signal Provider Details
- Method: GET
- Path: /api/signals/providers/{providerId}
- Description: Retrieve details of a specific signal provider.
- RequiredRoles: RegisteredUser, Guest
- Parameters:
  - providerId: string, required, ID of the signal provider (path parameter).
- Responses:
  - StatusCode: 200, Description: Provider details including ID, name, description, and performance metrics.
  - StatusCode: 404, Description: Provider not found.

### API-015: Add Signal Provider (Admin)
- Method: POST
- Path: /api/admin/providers
- Description: Add a new signal provider (admin only).
- RequiredRoles: Admin
- Parameters:
  - RequestBody:
    - Schema:
      - name: string, required, Provider’s name.
      - description: string, required, Provider’s description.
      - contactEmail: string, optional, Provider’s contact email.
- Responses:
  - StatusCode: 201, Description: Provider created successfully.
  - StatusCode: 400, Description: Validation error.
  - StatusCode: 403, Description: Forbidden (non-admin access).

### API-016: Update User Profile
- Method: PUT
- Path: /api/users/profile
- Description: Update the current user’s profile information.
- RequiredRoles: RegisteredUser
- Parameters:
  - RequestBody:
    - Schema:
      - username: string, optional, Updated display name.
      - email: string, optional, Updated email address.
- Responses:
  - StatusCode: 200, Description: Profile updated successfully.
  - StatusCode: 400, Description: Validation error.
  - StatusCode: 401, Description: Unauthorized.

## Schema Review

### Requirements Coverage
The API design addresses all user stories from the PRD:
- **US-001 (User Login)**: Covered by API-002 (Login) and API-003 (Logout).
- **US-002 (Onboarding Process)**: Covered by API-004 (Complete Onboarding).
- **US-003 (Subscribe to Signal Bundles)**: Covered by API-005 (Get Signal Bundles), API-006 (Subscribe), and API-007 (Unsubscribe).
- **US-004 (Receive Signal Alerts)**: Supported by API-008 (Get User Signals), with real-time updates via Supabase Realtime and push notifications via Firebase Cloud Messaging.
- **US-005 (Connect to Trading Bot)**: Covered by API-009 (Connect Trading Bot) and API-010 (Disconnect Trading Bot).
- **US-006 (Track Signal Performance)**: Covered by API-011 (Get Signal Performance).
- **US-007 (Senior-Friendly UX)**: Ensured by simple, consistent API responses with clear data structures.
- **US-008 (Cross-Device Syncing)**: Supported by stateless RESTful design and Supabase’s session management.

Additional endpoints support implied requirements:
- **User Registration**: API-001 (Signup) enables new user creation.
- **Profile Management**: API-016 (Update User Profile) allows user data updates.
- **Admin Functionality**: API-012 (List Users) and API-015 (Add Signal Provider) support admin tasks for managing users and providers.
- **Provider Information**: API-013 (List Signal Providers) and API-014 (Get Signal Provider Details) enhance transparency.

### Design Consistency
- **Naming Conventions**: Endpoints use clear, resource-based paths (e.g., /api/signals, /api/auth) and consistent verbs (GET for retrieval, POST for creation, PUT for updates).
- **HTTP Methods**: Follow REST standards (GET for read, POST for create, PUT for update, DELETE not needed based on PRD).
- **Response Codes**: Standard HTTP codes (200, 201, 400, 401, 403, 404, 409) ensure clarity.
- **Role-Based Access**: Each endpoint specifies authorized roles, enforced via Supabase Auth and Next.js middleware.
- **Parameters**: Query parameters (e.g., limit, offset) enable pagination and filtering, while request bodies use JSON schemas for clarity.
- **No Data Handling**: Empty result sets return 404 with “No [resource] found,” treating no data as valid per requirements.

### Completeness
- All user-facing features are supported by endpoints.
- Admin tasks are partially covered (user and provider management); additional admin endpoints (e.g., update/delete providers) could be added if needed but are not specified in the PRD.
- Real-time and push notifications are handled outside REST endpoints via Supabase Realtime and Firebase Cloud Messaging, as per the tech stack.
- Security is ensured through Supabase Auth for authentication and role-based checks in API routes.

### Traceability
Each endpoint maps to specific PRD requirements:
- Authentication: US-001, implied signup needs.
- Onboarding: US-002.
- Signal Management: US-003, US-004.
- Trading Bot: US-005.
- Performance Tracking: US-006.
- Admin Tasks: Section 2.3 (Admin role).
- Cross-Device Syncing: US-008 (implicit in stateless design).

## Implementation Notes
- **Tech Stack Integration**: Endpoints are implemented as Next.js API routes, interacting with Supabase for data storage and authentication. Supabase Realtime handles live signal updates, and Firebase Cloud Messaging delivers push notifications.
- **Security**: API keys for trading bots are encrypted in Supabase. Role-based access is enforced using Supabase Auth’s user roles and Next.js middleware.
- **Scalability**: Supabase and Vercel ensure scalability, with pagination (limit/offset) for large datasets.
- **Testing**: Jest and Cypress, per the tech stack, should test each endpoint for functionality and security.

This API design provides a robust foundation for the Crypto Signals app, ensuring all PRD requirements are met with a secure, scalable, and user-friendly backend.
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [API Design for Crypto Signals App](#api-design-for-crypto-signals-app)
  - [Endpoint List](#endpoint-list)
    - [API-001: User Signup](#api-001-user-signup)
    - [API-002: User Login](#api-002-user-login)
    - [API-003: User Logout](#api-003-user-logout)
    - [API-004: Complete Onboarding](#api-004-complete-onboarding)
    - [API-005: Get Signal Bundles](#api-005-get-signal-bundles)
    - [API-006: Subscribe to Signal Bundle](#api-006-subscribe-to-signal-bundle)
    - [API-007: Unsubscribe from Signal Bundle](#api-007-unsubscribe-from-signal-bundle)
    - [API-008: Get User Signals](#api-008-get-user-signals)
    - [API-009: Connect Trading Bot](#api-009-connect-trading-bot)
    - [API-010: Disconnect Trading Bot](#api-010-disconnect-trading-bot)
    - [API-011: Get Signal Performance](#api-011-get-signal-performance)
    - [API-012: List Users (Admin)](#api-012-list-users-admin)
    - [API-013: List Signal Providers](#api-013-list-signal-providers)
    - [API-014: Get Signal Provider Details](#api-014-get-signal-provider-details)
    - [API-015: Add Signal Provider (Admin)](#api-015-add-signal-provider-admin)
    - [API-016: Update User Profile](#api-016-update-user-profile)
  - [Schema Review](#schema-review)
    - [Requirements Coverage](#requirements-coverage)
    - [Design Consistency](#design-consistency)
    - [Completeness](#completeness)
    - [Traceability](#traceability)
  - [Implementation Notes](#implementation-notes)

<!-- /code_chunk_output -->

