# Complete Getting Started Guide for PORTA

## 📚 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running)
5. [Testing the Features](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

## Prerequisites {#prerequisites}

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **MongoDB**: 4.4 or higher (local or Atlas)
- **Git**: For version control (optional)

### Installation Verification
```bash
# Check Node.js
node --version    # Should be v18+

# Check npm
npm --version     # Should be v8+

# Check MongoDB (if local)
mongod --version  # Should be v4.4+
```

## Installation {#installation}

### Option 1: Automated Setup (Recommended)

#### Windows
```bash
cd PORTAL-V2
install.bat
```

#### macOS/Linux
```bash
cd PORTAL-V2
chmod +x install.sh
bash install.sh
```

### Option 2: Manual Setup

#### 1. Backend Installation
```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# (Optional) Build TypeScript
npm run build
```

#### 2. Frontend Installation
```bash
cd client

# Install dependencies
npm install

# Create environment file (usually auto-created)
# The .env.local is already configured with default values
```

## Configuration {#configuration}

### Backend Configuration

1. **Edit `server/.env`**:
```env
# Server port (default: 5000)
PORT=5000

# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/porta

# JWT secret (change in production!)
JWT_SECRET=your_super_secret_jwt_key

# JWT expiration
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development

# CORS origin (frontend URL)
CORS_ORIGIN=http://localhost:3000
```

2. **Edit `server/admins.txt`** (Admin users):
```
admin@porta.com:AdminPass123!
owner@porta.com:OwnerPass123!
# Add more admins as needed, format: email:password
```

### Frontend Configuration

The frontend is pre-configured with:
- **API URL**: `http://localhost:5000/api`
- **Environment**: Development

No changes needed unless using a different backend URL.

### Database Setup

#### Local MongoDB
```bash
# Windows (MongoDB as service should auto-start)
# Or manually:
mongod

# macOS (using Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod
```

#### MongoDB Atlas (Cloud)
1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create account and cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/porta?retryWrites=true&w=majority
```

## Running the Application {#running}

### Step 1: Start MongoDB (if local)
```bash
mongod
```

### Step 2: Start Backend
```bash
cd server
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ Admin created: admin@porta.com
✓ PORTA Server is running
✓ Port: 5000
✓ API: http://localhost:5000/api
```

### Step 3: Start Frontend (NEW TERMINAL)
```bash
cd client
npm run dev
```

You should see:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

### Step 4: Open in Browser
- **Portal**: http://localhost:3000
- **API Health**: http://localhost:5000/health

## Testing the Features {#testing}

### ✓ Test 1: Admin Login
1. Go to http://localhost:3000/login
2. Use credentials from `server/admins.txt`:
   - Email: `admin@porta.com`
   - Password: `AdminPass123!`
3. You should see the admin dashboard with statistics

**Expected Results:**
- ✓ Successful login
- ✓ Redirected to dashboard
- ✓ See user statistics
- ✓ Dashboard shows all admin options

### ✓ Test 2: User Management
1. On dashboard, click "Users" in sidebar
2. You should see a table with users (including the admin)
3. Try searching by name or email

**Expected Results:**
- ✓ Users table displays
- ✓ Search functionality works
- ✓ Can see user roles and status

### ✓ Test 3: Intern Access Request
1. Open new private/incognito window
2. Go to http://localhost:3000/request-access
3. Enter an email: `newuser@example.com`
4. Click "Request Access"

**Expected Results:**
- ✓ Success message shown
- ✓ Can check status

### ✓ Test 4: Admin Approval
1. Back to admin window
2. Click "Access Requests" in sidebar
3. You should see the pending request
4. Click "Approve"

**Expected Results:**
- ✓ Request shows in table
- ✓ Approve button works
- ✓ Request status changes to approved

### ✓ Test 5: Intern Registration
1. In private window, go to http://localhost:3000/register
2. Enter:
   - Name: John Doe
   - Email: newuser@example.com
   - Password: TestPass123!
3. Click "Create Account"

**Expected Results:**
- ✓ Account created
- ✓ Automatically logged in
- ✓ Redirected to dashboard
- ✓ See intern-specific dashboard

### ✓ Test 6: Logout
1. In any dashboard, scroll to bottom of sidebar
2. Click "Logout"

**Expected Results:**
- ✓ Token cleared
- ✓ Redirected to login
- ✓ Cannot access dashboard

### ✓ Test 7: Protected Routes
1. Try accessing http://localhost:3000/dashboard without login

**Expected Results:**
- ✓ Redirected to login page

## Troubleshooting {#troubleshooting}

### Backend Issues

#### "MongoDB connection failed"
```
Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGODB_URI in .env
3. If using Atlas, verify network access
4. Check connection string format
```

#### "Admin users not created"
```
Solution:
1. Verify admins.txt exists in server/
2. Check format: email:password
3. Ensure each admin on new line
4. Check server startup logs
```

#### "Port 5000 already in use"
```
Solution:
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Change PORT in .env
PORT=5001
```

#### "Cannot find module"
```
Solution:
1. Delete node_modules: rm -rf node_modules
2. Reinstall: npm install
3. Clear cache: npm cache clean --force
```

### Frontend Issues

#### "Cannot connect to API"
```
Solution:
1. Verify backend is running: http://localhost:5000/health
2. Check NEXT_PUBLIC_API_URL in .env.local
3. Verify CORS_ORIGIN in backend .env
4. Check browser console for errors
```

#### "Tailwind styles not working"
```
Solution:
1. Rebuild Tailwind: npm run build
2. Clear .next folder: rm -rf .next
3. Restart dev server: npm run dev
```

#### "Token/Session expired"
```
Solution:
1. Clear browser cookies
2. Log in again
3. Check JWT_EXPIRES_IN in backend .env
```

### General Issues

#### "Blank page on load"
```
Solution:
1. Check browser console (F12)
2. Check Network tab for errors
3. Verify both servers are running
4. Check backend logs
```

#### "Search not working"
```
Solution:
1. Check database has data
2. Verify indexes are created
3. Check MongoDB connection
4. Restart backend
```

## Next Steps {#next-steps}

### Immediate (Today)
1. ✓ Get both servers running
2. ✓ Test all features
3. ✓ Create test accounts
4. ✓ Understand the workflow

### Short-term (This Week)
1. Add your team members to admins.txt
2. Configure custom environment
3. Set up a real MongoDB (Atlas)
4. Test approval workflows with team

### Medium-term (This Month)
1. Customize branding and colors
2. Add email notifications
3. Set up monitoring and alerts
4. Deploy to staging environment

### Long-term (This Quarter)
1. Deploy to production
2. Set up CI/CD pipeline
3. Add advanced features
4. Scale infrastructure

## 🎓 Learning Resources

### Documentation Files
- **[README.md](./README.md)** - Complete documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Design decisions
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Features & stats
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference

### Code Structure
```
server/src/
├── controllers/    # Request handling
├── services/       # Business logic
├── models/         # Database schemas
├── routes/         # API endpoints
├── middlewares/    # Auth, validation
└── utils/          # Helpers

client/
├── app/           # Next.js pages
├── components/    # React components
├── lib/           # Utilities & API
└── store/         # State management
```

### Key Files to Explore
1. `server/src/index.ts` - Server setup
2. `server/src/config/admins.ts` - Admin initialization
3. `client/store/authStore.ts` - Auth state
4. `client/lib/api/endpoints.ts` - API methods

## 📞 Support

### If Something Goes Wrong
1. **Check logs**: Look at terminal output
2. **Read documentation**: See README.md
3. **Check network**: Is backend running?
4. **Clear cache**: Delete .next and node_modules
5. **Restart**: Kill and restart servers

### Common Commands

#### Backend
```bash
npm run dev      # Start development
npm run build    # Build TypeScript
npm start        # Start production
```

#### Frontend
```bash
npm run dev      # Start development
npm run build    # Build optimized
npm start        # Start production
npm run lint     # Check code
```

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:3000
- [ ] Can login with admin credentials
- [ ] Can access admin dashboard
- [ ] Can see user management
- [ ] Can see access requests
- [ ] Can request access as intern
- [ ] Can approve requests
- [ ] Can create new account
- [ ] Can logout successfully
- [ ] Protected routes work
- [ ] No console errors

## 🎉 You're Ready!

Congratulations! PORTA is now running on your system. You have a production-ready enterprise portal with:

✓ Secure authentication
✓ Role-based access control
✓ Admin approval system
✓ Beautiful modern UI
✓ Scalable architecture

Happy coding! 🚀

---

**PORTA v1.0.0**  
Enterprise Portal - Production Ready  
Last Updated: 2024
