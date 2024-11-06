# ridhauth - AuthCreator 🚀

A modern authentication system built with React, Node.js, and Prisma, featuring both traditional email-password and Google OAuth authentication.

## Features ✨

- 🔐 Secure Authentication System
- 📧 Email Verification
- 🔑 Password Reset
- 🌐 Google OAuth Integration
- 🖼️ Profile Image Upload
- 💾 Persistent Sessions
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design

## Tech Stack 🛠️

### Frontend
- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL
- JWT
- Nodemailer
- Cloudinary
- Passport.js

## Getting Started 🚀

### 1. Clone the repository
```bash
git clone https://github.com/ridh21/Authify.git
```

### 2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 3. Set up environment variables
Create a `.env` file in the backend directory:

```env
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

### 4. Run the development servers
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

## API Documentation 📚

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
```

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "image": "file (optional)"
}
```

#### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### Verify Email
```http
POST /api/auth/verify-email
```

**Body:**
```json
{
  "email": "string",
  "otp": "string"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
```

**Body:**
```json
{
  "email": "string",
  "otp": "string",
  "newPassword": "string"
}
```

#### Google OAuth
```http
GET /api/auth/google
GET /api/auth/google/callback
```

## Database Schema 📊

```prisma
model User {
  id              Int      @id @default(autoincrement())
  username        String
  email           String   @unique
  password        String?
  provider        String? @default("local")
  image           String   @default("https://ui-avatars.com/api/?name=RP")
  imagePublicId   String?
  emailVerified   Boolean  @default(false)
  googleId        String?  @unique // Nullable for users who sign up with email/password
  otp             String?  // For OTP verification
  otpExpiresAt    DateTime? // OTP expiration time
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([email]) // Index on email for faster lookups
}

```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

Ridham Patel - [ridhampatel2k4@gmail.com](mailto:ridhampatel2k4@gmail.com)

Project Link: [https://github.com/ridh21/Authify](https://github.com/ridh21/Authify)


Made with ❤️ by Ridham Patel
