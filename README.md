# PORTA - Enterprise Internal Portal

## Overview

PORTA is a modern, enterprise-grade internal company portal built with cutting-edge technologies. It features secure authentication, role-based access control, admin approval systems, and a premium black & white UI.

## Key Features

### Authentication & Authorization
- **Secure JWT-based authentication** with bcrypt password hashing
- **Three distinct roles**: Admin, Data Entry, Intern
- **Admin initialization system** from `admins.txt`
- **Intern approval workflow** before portal access

### Admin Dashboard
- User management and role assignment
- Access request approval/rejection
- Activity monitoring and logs
- Real-time statistics and metrics
- User activation/deactivation

### Security
- ✓ Helmet.js for security headers
- ✓ CORS protection
- ✓ Rate limiting (100 requests/15min, 5 login attempts/15min)
- ✓ Secure cookie handling
- ✓ Input validation and sanitization
- ✓ Environment variable protection
- ✓ MongoDB connection security

### User Experience
- **Premium black & white UI** inspired by Linear, Notion, Stripe
- **Responsive design** for all devices
- **Smooth animations** and transitions
- **Professional typography** and spacing
- **Intuitive navigation**

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Axios** for API calls
- **Shadcn UI** components

### Backend
- **Node.js** runtime
- **Express.js** framework
- **MongoDB** database (Mongoose ODM)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for throttling

## Project Structure

```
PORTA-V2/
├── server/                    # Backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Auth, error, logging
│   │   ├── models/           # MongoDB schemas
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helpers and validators
│   │   ├── config/           # Configuration files
│   │   └── index.ts          # Entry point
│   ├── admins.txt            # Admin credentials
│   ├── package.json
│   └── tsconfig.json
│
├── client/                    # Frontend
│   ├── app/
│   │   ├── (auth)/           # Auth pages
│   │   ├── (dashboard)/      # Dashboard pages
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   └── auth/             # Auth components
│   ├── lib/
│   │   ├── api/              # API client & endpoints
│   │   └── utils/            # Helper functions
│   ├── store/                # Zustand stores
│   ├── package.json
│   └── tsconfig.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd server

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Update .env with your MongoDB URI and JWT secret
MONGODB_URI=mongodb://localhost:27017/porta
JWT_SECRET=your_super_secret_key

# 4. Update admins.txt with your admin credentials
# Format: email:password (one per line)
admin@porta.com:AdminPass123!
owner@porta.com:OwnerPass123!

# 5. Build TypeScript
npm run build

# 6. Start server (development)
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client

# 1. Install dependencies
npm install

# 2. Update .env.local if needed
# Default: http://localhost:5000/api

# 3. Start development server
npm run dev

# Client runs on http://localhost:3000
```

## API Routes

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register intern
- `POST /api/auth/logout` - Logout
- `POST /api/auth/request-access` - Request access
- `GET /api/auth/check-email` - Check email approval status

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:userId` - Get user by ID (admin only)
- `PATCH /api/users/:userId/role` - Update role (admin only)
- `PATCH /api/users/:userId/status` - Toggle status (admin only)
- `DELETE /api/users/:userId` - Delete user (admin only)
- `GET /api/users/dashboard/stats` - Get dashboard stats (admin only)

### Admin
- `GET /api/admin/requests` - Get all access requests
- `GET /api/admin/requests/pending` - Get pending requests
- `PATCH /api/admin/requests/:requestId/approve` - Approve request
- `PATCH /api/admin/requests/:requestId/reject` - Reject request

## Database Schemas

### User
```javascript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: "ADMIN" | "DATA_ENTRY" | "INTERN",
  isApproved: boolean,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### AccessRequest
```javascript
{
  email: string,
  status: "pending" | "approved" | "rejected",
  requestedAt: Date,
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  rejectionReason: string
}
```

### ActivityLog
```javascript
{
  userId: ObjectId (ref: User),
  action: string,
  resource: string,
  resourceId: ObjectId,
  details: object,
  ipAddress: string,
  timestamp: Date
}
```

## User Workflow

### 1. Intern Access Flow
```
Intern → Request Access → Admin Approves → Intern Creates Account → Portal Access
```

### 2. Admin Initialization
```
Server Start → Read admins.txt → Hash Passwords → Create Admin Users → Ready
```

### 3. Authentication Flow
```
Login → Verify Email & Password → Generate JWT → Set Secure Cookie → Redirect to Dashboard
```

## Security Features

1. **Password Security**
   - bcryptjs hashing with salt rounds: 12
   - Never stored in plain text

2. **JWT Security**
   - 7-day expiration
   - Secure HTTP-only cookies
   - CSRF protection via SameSite

3. **Rate Limiting**
   - General: 100 requests/15 minutes
   - Login: 5 attempts/15 minutes

4. **Input Validation**
   - Email format validation
   - Password requirements (6+ characters)
   - Name validation
   - Request body validation

5. **Database Security**
   - Mongoose schema validation
   - Indexed queries for performance
   - No sensitive data in logs

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/porta
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Deployment

### Backend Deployment (Render/Railway/Azure)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy automatically

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

## Troubleshooting

### "MongoDB Connection Failed"
- Check MongoDB is running: `mongod`
- Verify MongoDB URI in .env
- Ensure network access if using Atlas

### "Admin Users Not Created"
- Check admins.txt file exists in server directory
- Verify correct format: `email:password`
- Check server logs for errors

### "CORS Errors"
- Verify CORS_ORIGIN in backend .env
- Ensure frontend and backend URLs match
- Check cookies are HTTP-only

### "JWT Token Expired"
- User needs to login again
- Tokens expire after 7 days by default
- Check JWT_EXPIRES_IN in backend

## Development

### Run Both Servers (Development)

Terminal 1:
```bash
cd server && npm run dev
```

Terminal 2:
```bash
cd client && npm run dev
```

### Build for Production

Backend:
```bash
cd server
npm run build
npm start
```

Frontend:
```bash
cd client
npm run build
npm start
```

## License

Proprietary - All Rights Reserved

## Support

For issues or questions, contact the development team.

---

Built with ❤️ for enterprise excellence. PORTA v1.0.0
