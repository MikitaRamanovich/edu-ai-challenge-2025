# Logout Button Non-Responsive in Safari Browser

## Description
The logout button in the application fails to respond when clicked in Safari browser. The button appears to be clickable but does not trigger any action, preventing users from logging out of the application.

## Steps to Reproduce
1. Open the application in Safari browser
2. Log in to the application with valid credentials
3. Navigate to any page where the logout button is visible
4. Click the logout button
5. Observe that no action occurs

## Expected vs Actual Behavior
- **Expected**: Clicking the logout button should log the user out of the application and redirect to the login page
- **Actual**: Clicking the logout button produces no response or action

## Environment
- Browser: Safari
- Operating System: Any (issue reported across different OS versions)
- Application Version: Current production version
- Device Type: Desktop/Web application

## Severity/Impact
**High**
- Users cannot log out of the application, which is a critical security and user experience issue
- May lead to session management problems
- Affects all users on Safari browser
- Could result in unauthorized access if users cannot properly end their sessions

## Verification
1. Implement the fix
2. Test the logout functionality in Safari browser:
   - Click the logout button
   - Verify successful logout
   - Confirm redirect to login page
   - Verify session is properly terminated
3. Test across different Safari versions
4. Verify no regression in other browsers 