# Request Management System
## Implementation & Setup Guide
---

---

## 1. Introduction

The Request Management System is a modern microservices-based application designed to handle employee requests and approvals. It consists of:

- **Frontend Application**: React-based user interface
- **Authentication Service**: Handles Google SSO integration
- **Request Service**: Manages request lifecycle
- **Notification Service**: Handles email notifications

### Key Features
- Google Single Sign-On (SSO)
- Request creation and management
- Email notifications
- Role-based access control
- Real-time status updates

---

## 2. System Requirements

### Development Environment
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)
- Git

### Required Accounts
- Google Cloud Console account
- MongoDB Atlas account (optional, for cloud database)
- Gmail account (for notifications)

### Development Tools
- Code editor (VSCode recommended)
- Postman (for API testing)
- MongoDB Compass (optional)

---

## 3. Project Setup

### Repository Setup
```bash
# Clone the repository
git clone <repository-url>
cd microservicesapp

# Create necessary environment files
cp auth-service/.env.example auth-service/.env
cp request-service/.env.example request-service/.env
cp notification-service/.env.example notification-service/.env
cp frontend/.env.example frontend/.env
```

### Environment Configuration

#### Frontend (.env)
```plaintext
REACT_APP_AUTH_SERVICE_URL=http://localhost:5001
REACT_APP_REQUEST_SERVICE_URL=http://localhost:5003
REACT_APP_NOTIFICATION_SERVICE_URL=http://localhost:5002
```

#### Auth Service (.env)
```plaintext
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb:mongodb+srv://username:password@dbname 
FRONTEND_URL=http://localhost:3000
PORT=5001
```

#### Request Service (.env)
```plaintext
MONGODB_URI=mongodb:mongodb+srv://username:password@dbname 
FRONTEND_URL=http://localhost:3000
NOTIFICATION_SERVICE_URL=http://localhost:5002
PORT=5003
```

#### Notification Service (.env)
```plaintext
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
FRONTEND_URL=http://localhost:3000
PORT=5002
```

---

## 4. Service Configuration

### Database Setup
1. Start MongoDB service
   ```bash
   # For Windows
   net start MongoDB

   # For macOS/Linux
   sudo systemctl start mongod
   ```

2. Verify MongoDB connection
   ```bash
   mongo --eval "db.version()"
   ```

### Port Configuration
- Frontend: 3000
- Auth Service: 5001
- Notification Service: 5002
- Request Service: 5003

---

## 5. Installation Steps

### Install Dependencies
```bash
# Auth Service
cd auth-service
npm install

# Notification Service
cd ../notification-service
npm install

# Request Service
cd ../request-service
npm install

# Frontend
cd ../frontend
npm install
```

### Start Services
```bash
# Terminal 1 - Auth Service
cd auth-service
npm start

# Terminal 2 - Notification Service
cd notification-service
npm start

# Terminal 3 - Request Service
cd request-service
npm start

# Terminal 4 - Frontend
cd frontend
npm start
```

---

## 6. Google OAuth Configuration

1. **Create Google Cloud Project**
   - Visit Google Cloud Console
   - Create new project
   - Enable Google+ API

2. **Configure OAuth Consent Screen**
   - Set application name
   - Add authorized domains
   - Configure test users

3. **Create OAuth Credentials**
   - Create OAuth 2.0 Client ID
   - Configure authorized origins
   - Set redirect URI: `http://localhost:5001/auth/google/callback`

4. **Update Environment Variables**
   - Add Client ID and Secret to auth-service/.env

---

## 7. Email Service Setup

### Gmail Configuration
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security
   - App Passwords → Generate
3. Update notification-service/.env

### SMTP Configuration (Alternative)
```plaintext
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your_username
EMAIL_PASS=your_password
```

---

## 8. Testing & Verification

### System Testing Checklist
- [ ] Google SSO login works
- [ ] Request creation successful
- [ ] Email notifications received
- [ ] Approver dashboard accessible
- [ ] Request status updates working

### Test Scenarios
1. **User Registration**
   - Login with Google
   - Verify welcome email

2. **Request Creation**
   - Create new request
   - Verify requester notification
   - Verify approver notification

3. **Request Approval**
   - Login as approver
   - Approve/reject request
   - Verify status update
   - Check email notifications

---

## 9. Troubleshooting Guide

### Common Issues

#### CORS Errors
```javascript
// Add to service configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### MongoDB Connection Issues
- Check connection string
- Verify MongoDB service status
- Check network connectivity

#### OAuth Errors
- Verify redirect URIs
- Check client credentials
- Validate consent screen setup

#### Email Service Issues
- Verify SMTP credentials
- Check spam folder
- Validate email service configuration

---

## 10. Security Considerations

### Best Practices
1. **Environment Variables**
   - Never commit .env files
   - Use strong passwords
   - Rotate credentials regularly

2. **Authentication**
   - Implement rate limiting
   - Use secure session management
   - Enable OAuth2.0 security features

3. **Data Protection**
   - Encrypt sensitive data
   - Implement input validation
   - Use prepared statements

---



## Support & Contact

For technical support or queries, please contact:
- Email: prathmesh.admg@gmail.com

