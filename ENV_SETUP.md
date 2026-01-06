# Environment Variables Setup

To enable email and SMS notifications, add these environment variables to your Vercel project:

## Email Configuration (Gmail)

\`\`\`
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
\`\`\`

## SMS Configuration (Twilio)

\`\`\`
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
\`\`\`

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with its corresponding value
5. Deploy your project to apply the changes

## Features Enabled

- **Email Notifications**: Order confirmations and verification codes sent via Gmail
- **SMS Notifications**: Order updates and verification codes sent via Twilio
- **Authentication**: Email/SMS verification during registration
- **Order Tracking**: Real-time order status updates via email and SMS
