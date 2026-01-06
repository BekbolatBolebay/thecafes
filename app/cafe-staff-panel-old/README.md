# Cafe Staff Panel

This is a simple React Native application for managing a cafe's staff, orders, and tables.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

This will open a development server. You can then run the app on:
- Android Emulator
- iOS Simulator
- Web browser

## Roles

This application has four roles:
- `admin`: Can see and manage everything.
- `waiter`: Can see and manage orders and tables.
- `chef`: Can only see and manage orders.
- `cashier`: Can see and manage payments.

You can select a role on the login screen.

## Troubleshooting

If you are still experiencing errors, please provide the full error message.

The following files have been reviewed and updated for correctness and type safety:
- `app/orders.tsx`
- `app/dashboard.tsx`
- `app/tables.tsx`
- `app/payments.tsx`
- `app/staff.tsx`
- `app/profile.tsx`

The main changes were:
- Replaced `useSearchParams` with `useLocalSearchParams` for safer access to route parameters.
- Added types for all data models (`Order`, `Table`, `Payment`, etc.) to improve type safety.
