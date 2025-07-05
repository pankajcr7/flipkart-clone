# Razorpay Integration Guide

This document explains how to set up and use Razorpay payment integration in your Flipkart MERN application.

## Backend Setup

### 1. Environment Configuration

Add the following environment variables to your `backend/config/config.env` file:

```env
# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

**To get your Razorpay credentials:**
1. Sign up at [https://razorpay.com/](https://razorpay.com/)
2. Go to Dashboard → Account & Settings → API Keys
3. Generate API Keys for Test Mode
4. Copy the Key ID and Key Secret

### 2. Backend API Endpoints

The following new endpoints have been added:

- **POST** `/api/v1/razorpay/order` - Create a Razorpay order
- **POST** `/api/v1/razorpay/verify` - Verify payment signature
- **GET** `/api/v1/razorpay/key` - Get Razorpay public key

### 3. Dependencies

The following npm package has been installed:
- `razorpay` - Official Razorpay Node.js SDK

## Frontend Setup

### 1. Payment Flow

1. User selects Razorpay as payment method
2. Frontend creates a Razorpay order via API call
3. Razorpay checkout window opens
4. User completes payment
5. Payment signature is verified on backend
6. Order is confirmed

### 2. Payment Component Features

- **Multiple Payment Options**: Users can choose between Paytm and Razorpay
- **Dynamic Script Loading**: Razorpay SDK is loaded dynamically when needed
- **Secure Verification**: Payment signatures are verified server-side
- **Error Handling**: Comprehensive error handling for failed payments

## Testing

### Test Card Details (Razorpay Test Mode)

```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

### UPI Testing
```
UPI ID: success@razorpay
```

### Net Banking
- Select any bank
- Use "success" as username and password

## Important Security Notes

1. **Never expose Key Secret**: Keep `RAZORPAY_KEY_SECRET` secure and never expose it in frontend code
2. **Signature Verification**: Always verify payment signatures on the backend
3. **HTTPS**: Use HTTPS in production for secure payment processing
4. **Webhook Security**: Consider implementing Razorpay webhooks for additional security

## Production Deployment

1. **Switch to Live Mode**: Replace test keys with live keys from Razorpay dashboard
2. **Update URLs**: Change any test URLs to production URLs
3. **Webhook Setup**: Configure webhooks for payment confirmations
4. **SSL Certificate**: Ensure your domain has a valid SSL certificate

## API Usage Examples

### Create Order
```javascript
POST /api/v1/razorpay/order
{
  "amount": 1000,
  "currency": "INR",
  "receipt": "receipt_123"
}
```

### Verify Payment
```javascript
POST /api/v1/razorpay/verify
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

## Troubleshooting

### Common Issues

1. **Payment fails with "Key not found"**
   - Check if RAZORPAY_KEY_ID is set correctly
   - Ensure the key is from the correct mode (test/live)

2. **Signature verification fails**
   - Verify RAZORPAY_KEY_SECRET is correct
   - Check if all required parameters are sent

3. **Checkout doesn't open**
   - Ensure Razorpay script is loaded properly
   - Check browser console for JavaScript errors

### Support

For additional help:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Integration Examples](https://github.com/razorpay/razorpay-node)
