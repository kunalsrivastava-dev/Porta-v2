# PORTA Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** running locally or connection string ready
- **Git** for version control

### Quick Setup

#### 1️⃣ Clone/Extract Project
```bash
cd PORTAL-V2
```

#### 2️⃣ Start MongoDB (if local)
```bash
# Windows
mongod

# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod
```

#### 3️⃣ Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your settings (optional - defaults work)
# MONGODB_URI=mongodb://localhost:27017/porta
# JWT_SECRET=your_super_secret_jwt_key

# Start backend
npm run dev
```

Backend will start on `http://localhost:5000`

#### 4️⃣ Setup Frontend (NEW TERMINAL)

```bash
cd client

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

### 🎯 Test the Portal

#### Admin Login
1. Go to `http://localhost:3000/login`
2. Use credentials from `server/admins.txt`:
   - Email: `admin@porta.com`
   - Password: `AdminPass123!`
3. You'll see the admin dashboard

#### Test Intern Flow
1. Go to `http://localhost:3000/request-access`
2. Enter an email to request access
3. Go back to admin dashboard
4. Approve the request in "Access Requests"
5. Go to register page with that email
6. Create account and login

## 📁 Project Structure

```
PORTAL-V2/
├── server/              # Express.js backend
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # MongoDB schemas
│   │   └── ...
│   ├── admins.txt       # Admin credentials
│   └── package.json
│
├── client/              # Next.js frontend
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities
│   └── package.json
│
└── README.md
```

## 🔐 Admin Credentials

Edit `server/admins.txt` to add/change admin users:

```
admin@porta.com:AdminPass123!
owner@porta.com:OwnerPass123!
newadmin@porta.com:NewPassword123!
```

Format: `email:password` (one per line)

Admins are auto-created on server startup.

## 🎨 Features to Explore

### Admin Dashboard
- ✓ User management
- ✓ Access request approval
- ✓ Activity monitoring
- ✓ Statistics & metrics

### Intern Portal
- ✓ Request access
- ✓ Create account (after approval)
- ✓ View assigned tasks
- ✓ Track progress

### Data Entry Portal
- ✓ Upload CSV/Excel files
- ✓ Manage datasets
- ✓ Assign to interns

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change `PORT` in `server/.env` |
| Port 3000 in use | Run `npm run dev -- -p 3001` in client |
| MongoDB connection failed | Ensure MongoDB is running: `mongod` |
| Admins not created | Check `server/admins.txt` exists |
| CORS errors | Verify `CORS_ORIGIN` in backend .env |
| Token errors | Clear cookies and login again |

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/login              - Login user
POST   /api/auth/register           - Register intern
POST   /api/auth/logout             - Logout
POST   /api/auth/request-access     - Request access
GET    /api/auth/check-email        - Check email status
```

### Admin Operations
```
GET    /api/admin/requests/pending  - Pending requests
PATCH  /api/admin/requests/:id/approve  - Approve request
PATCH  /api/admin/requests/:id/reject   - Reject request
```

### User Management
```
GET    /api/users                   - All users (admin)
GET    /api/users/me                - Current user
PATCH  /api/users/:id/role          - Change role (admin)
DELETE /api/users/:id               - Delete user (admin)
```

## 🚢 Deploy to Production

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Import project
3. Set `NEXT_PUBLIC_API_URL`
4. Deploy

## 💡 Next Steps

1. **Customize admins.txt** with your team
2. **Test the workflow** with different roles
3. **Configure email notifications** (optional)
4. **Setup monitoring** and alerts
5. **Deploy to production**

## 📞 Support

For issues:
1. Check MongoDB is running
2. Verify environment variables
3. Check logs in terminal
4. Review error messages

---

**Happy Portal Building! 🎉**

Built with enterprise-grade architecture for production use.
