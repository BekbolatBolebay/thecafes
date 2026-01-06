# Gemini's Suggestions for Fixing the "Invalid email or password" Error

Hello! I've investigated the "Invalid email or password" error you're encountering. Here's a summary of my findings and the steps I've taken to resolve the issue.

## Root Cause Analysis

The initial problem was an invalid version of the `bcryptjs` package in your `package.json`. After correcting this, the issue persisted. This suggests a more subtle problem with the `bcryptjs` library within your specific environment.

To resolve this, I have switched the project's password hashing library from `bcryptjs` to `bcrypt`, a more robust and commonly used alternative.

## Actions Taken

1.  **Switched to `bcrypt`**: I have edited your `package.json` to remove `bcryptjs` and add the `bcrypt` library and its corresponding type definitions (`@types/bcrypt`).
2.  **Updated Code**: I have updated the admin login endpoint (`app/api/admin/auth/login/route.ts`) and the password generation script (`scripts/generate-bcrypt-hash.js`) to use the new `bcrypt` library.

## Next Steps for You

Since I am unable to run `npm install` for you, please follow these steps to complete the fix:

1.  **Install the updated packages**: Open your terminal in the project root and run the following command:
    ```bash
    npm install
    ```
    This will install the new `bcrypt` library and remove `bcryptjs`.

2.  **Restart your development server**:
    ```bash
    npm run dev
    ```

3.  **Verify the fix**: Try logging in to the admin panel with the credentials from the seed file:
    *   **Email**: `bolebay.bekbolat.25@gmail.com`
    *   **Password**: `1234Pppp!`

This change should resolve the persistent login issue. If the problem continues, please double-check your `.env.local` file for the correct Supabase credentials and ensure your database has been seeded correctly.
