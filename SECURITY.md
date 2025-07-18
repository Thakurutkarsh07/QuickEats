# QuickEats Security & Deployment Guide

## Security Enhancements Implemented

### 1. Dependency Security
- **Fixed all npm vulnerabilities** in frontend, admin, and backend
- **Updated vulnerable packages** including axios, vite, eslint, and others
- **Removed security vulnerabilities** related to SSRF, ReDoS, and XSS

### 2. Backend Security

#### Environment Variables
- **Moved sensitive data to .env file**: Database credentials, JWT secrets, API keys
- **Created .env.example** for documentation
- **Added .gitignore** to prevent credential exposure

#### Security Middleware
- **Helmet**: Added security headers (XSS protection, content type sniffing, etc.)
- **Rate Limiting**: Protection against DDoS and brute force attacks
- **CORS Configuration**: Strict origin control for cross-origin requests
- **Request Validation**: Input validation and sanitization using express-validator
- **File Upload Security**: File type restrictions and size limits

#### Authentication & Authorization
- **Strong JWT Secret**: Enhanced JWT token security
- **Token Expiration**: Configured appropriate token lifetimes
- **Error Handling**: Improved auth error messages and status codes

#### Database Security
- **Connection Security**: Proper MongoDB connection with timeouts
- **Connection Pooling**: Optimized database connections
- **Error Handling**: Graceful database error handling

### 3. API Security

#### Input Validation
- **User Registration**: Name, email, and strong password validation
- **User Login**: Email and password validation
- **Food Items**: Name, description, price, and category validation
- **Orders**: Items, amount, and address validation
- **Cart Operations**: Item ID validation

#### File Upload Security
- **File Type Restrictions**: Only image files (JPEG, PNG, GIF) allowed
- **File Size Limits**: Maximum 5MB per file
- **Secure File Naming**: Timestamp and random string naming
- **Upload Directory Security**: Proper static file serving configuration

## Environment Configuration

### Required Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Payment Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_SECRET=your-razorpay-secret-key

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Setup Instructions

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update environment variables** with your actual values

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   npm run server
   ```

## Security Features

### Rate Limiting
- **15-minute window** with 100 requests per IP
- **Configurable via environment variables**
- **Applied to all API routes**

### CORS Security
- **Whitelist specific origins** (frontend and admin URLs)
- **Credentials support** for authenticated requests
- **Specific HTTP methods** allowed

### File Upload Security
- **MIME type validation** for image files only
- **File size limits** (5MB maximum)
- **Secure filename generation** to prevent path traversal
- **Static file serving** with security options

### Input Validation
- **Strong password requirements**: Uppercase, lowercase, numbers, special characters
- **Email validation** and normalization
- **MongoDB ObjectId validation** for references
- **Request body sanitization**

### Error Handling
- **Graceful error responses**
- **No sensitive information exposure** in production
- **Proper HTTP status codes**
- **Security event logging**

## Health Monitoring

### Health Check Endpoint
- **GET /health**: Server health status
- **Response includes**: Timestamp, uptime, status
- **Use for monitoring** and load balancer health checks

### Logging
- **Development**: Detailed request logging
- **Production**: Combined format logging
- **Error logging**: Console error tracking

## Deployment Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Configure proper CORS origins for production domains
- [ ] Set up proper SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up database connection with proper authentication
- [ ] Configure proper rate limiting for production traffic
- [ ] Set up monitoring and alerting
- [ ] Regular security updates for dependencies
- [ ] Database backup strategy

## Security Testing

Test the security features:

1. **Rate Limiting**:
   ```bash
   # Test rate limiting (should block after 100 requests)
   for i in {1..105}; do curl http://localhost:3000/health; done
   ```

2. **CORS Protection**:
   ```bash
   # Test CORS (should block unauthorized origins)
   curl -H "Origin: http://evil-site.com" http://localhost:3000/api/food/list
   ```

3. **Input Validation**:
   ```bash
   # Test weak password (should be rejected)
   curl -X POST http://localhost:3000/api/user/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"weak"}'
   ```

## Performance Optimizations

- **Connection pooling** for database
- **Static file caching** with appropriate headers
- **Compression** for responses
- **Request body limits** to prevent large payloads
- **Graceful shutdown** handling

## Monitoring and Maintenance

- **Regular dependency updates**: `npm audit` and `npm update`
- **Security scanning**: Regular vulnerability assessments
- **Log monitoring**: Track authentication failures and rate limit hits
- **Performance monitoring**: Database connection health and response times