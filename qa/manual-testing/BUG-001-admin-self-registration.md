# BUG-001: Any anonymous user can register an ADMIN account

| Field | Value |
|-------|-------|
| ID | BUG-001 |
| Severity | Critical |
| Priority | High |
| Status | Open |
| Component | Auth, `POST /auth/register` |
| Environment | Local, Spring Boot app on http://localhost:8080 |
| Found by | Automated test `AuthRegisterTest.anonymousUserCannotSelfRegisterAsAdmin` |

## Summary
The register endpoint accepts a `role` field from the request body and saves it without checking who is calling. An anonymous user can therefore create an account with the ADMIN role.

## Steps to reproduce
1. Send `POST /auth/register` with no Authorization header:
   `{"name": "Attacker", "email": "attacker@example.com", "password": "Test@12345", "role": "ADMIN"}`
2. Send `POST /auth/login` with the same email and password.
3. Read the `role` in the login response, and use the returned token on `POST /events`.

## Expected result
Self-registered accounts always get the USER role. The `role` field is ignored or rejected for anonymous callers. Admin accounts can only be created by an existing admin or seeded by the system.

## Actual result
Login returns `"role": "ADMIN"`, and the token passes the admin-only checks on `/events`.

## Impact
Full privilege escalation. Any visitor can create, update and delete events and delete users, which defeats the role-based access control.

## Suggested fix
Do not read `role` from the register request. Set it to USER in the controller, and add a separate admin-only endpoint or a seeded admin for creating admins.

## Evidence
Test `AuthRegisterTest.anonymousUserCannotSelfRegisterAsAdmin` fails with: expected role not to be "ADMIN", but was "ADMIN". The test is in the `known-issues` suite.