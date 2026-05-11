# 📖 PORTA - Complete Reference Guide

## Quick Navigation

### 📚 Documentation Files
- **[DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md)** - Project completion summary (START HERE!)
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Comprehensive setup guide
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute quick start
- **[README.md](./README.md)** - Full documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Design decisions
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Features list

### 🎯 Choose Your Path

#### Just Want to Run It?
👉 **[QUICKSTART.md](./QUICKSTART.md)** (5 minutes)

#### Need Complete Setup Instructions?
👉 **[GETTING_STARTED.md](./GETTING_STARTED.md)** (30 minutes)

#### Want to Understand the System?
👉 **[ARCHITECTURE.md](./ARCHITECTURE.md)** (detailed design)

#### Need the Full Documentation?
👉 **[README.md](./README.md)** (complete reference)

---

## ⚡ Command Reference

### Installation

```bash
# Windows (Automated)
install.bat

# Mac/Linux (Automated)
bash install.sh

# Manual Backend
cd server && npm install

# Manual Frontend
cd client && npm install
```

### Development

```bash
# Start Backend (from server/)
npm run dev

# Start Frontend (from client/)
npm run dev

# Build Backend
npm run build

# Build Frontend
npm run build
```

### Production

```bash
# Start Backend (from server/)
npm start

# Start Frontend (from client/)
npm start
```

### Database

```bash
# Start MongoDB (if local)
mongod

# Mac with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Utilities

```bash
# Lint TypeScript
npm run lint

# Format Code
npm run format

# Clean Install
rm -rf node_modules && npm install
```

---

## 🔐 Default Credentials

**Admin Email**: admin@porta.com  
**Admin Password**: AdminPass123!

Found in: `server/admins.txt`

---

## 🌐 URLs When Running

| Service | URL |
|---------|-----|
| Frontend Portal | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/health |
| MongoDB | mongodb://localhost:27017/porta |

---

## 📂 Important Files

### Backend Configuration
- `server/.env` - Environment variables
- `server/admins.txt` - Admin users
- `server/package.json` - Dependencies
- `server/tsconfig.json` - TypeScript config

### Frontend Configuration
- `client/.env.local` - Environment variables
- `client/package.json` - Dependencies
- `client/tailwind.config.ts` - Tailwind CSS
- `client/tsconfig.json` - TypeScript config

### Entry Points
- Backend: `server/src/index.ts`
- Frontend: `client/app/layout.tsx`
- Root Auth Store: `client/store/authStore.ts`

---

## 🏗️ Project Structure

### Backend
```
server/src/
├── controllers/    → Handle HTTP requests
├── services/       → Business logic
├── models/         → Database schemas
├── routes/         → API endpoints
├── middlewares/    → Auth, validation, errors
├── utils/          → Helper functions
├── config/         → Setup & configuration
└── index.ts        → Server entry
```

### Frontend
```
client/
├── app/           → Next.js pages (routing)
├── components/    → React components
├── lib/           → API client & utilities
├── store/         → Zustand auth store
└── styles/        → Tailwind CSS
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register     - Create intern account
POST   /api/auth/login        - Login user
POST   /api/auth/request      - Request access
GET    /api/auth/check-email  - Check request status
POST   /api/auth/logout       - Logout user
```

### Users (Admin)
```
GET    /api/users             - List all users
GET    /api/users/:id         - Get user details
PUT    /api/users/:id/role    - Update user role
PUT    /api/users/:id/status  - Toggle user status
DELETE /api/users/:id         - Delete user
GET    /api/users/stats       - Dashboard statistics
```

### Requests (Admin)
```
GET    /api/admin/requests       - List all requests
PUT    /api/admin/requests/:id   - Approve/reject request
GET    /api/admin/requests/stat  - Request statistics
```

---

## 🗄️ Database Models

### User
- email (unique)
- password (hashed)
- name
- role (ADMIN, DATA_ENTRY, INTERN)
- isApproved
- isActive
- createdAt, updatedAt

### AccessRequest
- email (unique)
- status (PENDING, APPROVED, REJECTED)
- approvedBy (User reference)
- rejectionReason
- createdAt, updatedAt

### ActivityLog
- userId
- action
- description
- timestamp

### DataRecord
- title
- content
- assignedTo (User)
- status
- createdAt, updatedAt

---

## 🎨 Color Scheme

### Primary Colors
- **Black**: #000000
- **White**: #FFFFFF
- **Dark Gray**: #1F2937
- **Light Gray**: #F3F4F6

### Status Colors
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444
- **Info**: #3B82F6

---

## 📊 Feature Matrix

| Feature | Admin | Data Entry | Intern |
|---------|-------|-----------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Approve Requests | ✅ | ❌ | ❌ |
| Upload Data | ❌ | ✅ | ❌ |
| View Tasks | ❌ | ❌ | ✅ |
| Request Access | ❌ | ❌ | ✅ |

---

## 🔒 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ HttpOnly cookies
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection

---

## 🧪 Testing Workflows

### Test 1: Admin Login
1. Go to http://localhost:3000/login
2. Use: admin@porta.com / AdminPass123!
3. See admin dashboard

### Test 2: Request Access
1. Go to http://localhost:3000/request-access
2. Enter email: testuser@example.com
3. Request access

### Test 3: Approve Request
1. Login as admin
2. Click "Access Requests"
3. Approve the request

### Test 4: Create Intern Account
1. Go to http://localhost:3000/register
2. Use the approved email
3. Create account and login

### Test 5: Protected Routes
1. Logout
2. Try accessing /dashboard
3. Redirected to login

---

## 📈 Performance Targets

- Page Load: < 2 seconds
- API Response: < 100ms
- Database Query: < 50ms
- Build Time: < 5 seconds
- Bundle Size: < 200KB (optimized)

---

## 🚨 Troubleshooting Quick Guide

| Problem | Solution |
|---------|----------|
| Cannot connect to MongoDB | Check MongoDB is running |
| Port 5000 in use | Change PORT in .env |
| No admin created | Check admins.txt format |
| Token expired | Login again |
| CORS error | Check CORS_ORIGIN in .env |
| Styles not loading | Restart frontend server |

See [GETTING_STARTED.md](./GETTING_STARTED.md#troubleshooting) for detailed troubleshooting.

---

## 🎓 Learning Checklist

- [ ] Read DELIVERY_SUMMARY.md
- [ ] Run the installation script
- [ ] Login with admin credentials
- [ ] Explore the admin dashboard
- [ ] Test the intern workflow
- [ ] Review the codebase structure
- [ ] Read ARCHITECTURE.md
- [ ] Customize colors in tailwind.config.ts
- [ ] Add your own features
- [ ] Deploy to production

---

## 📚 Code Examples

### Using the API Client

```typescript
import { authAPI } from '@/lib/api/endpoints';

// Login
const response = await authAPI.login(email, password);

// Request access
await authAPI.requestAccess(email);

// Check status
const status = await authAPI.checkEmailStatus(email);
```

### Using Auth Store

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  
  return (
    <div>
      {isAuthenticated ? `Hello, ${user?.name}` : 'Not logged in'}
    </div>
  );
}
```

### Creating a Protected Page

```typescript
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  if (user?.role !== 'ADMIN') {
    router.push('/unauthorized');
  }
  
  return <div>Admin Content</div>;
}
```

---

## 🌟 Best Practices

### Backend
- Use TypeScript everywhere
- Validate inputs before processing
- Hash passwords with bcryptjs
- Use JWT for authentication
- Log important actions
- Handle errors gracefully

### Frontend
- Use TypeScript for type safety
- Store auth in Zustand
- Use Tailwind for styling
- Protect routes with middleware
- Validate forms before submit
- Show loading states

### Security
- Keep JWT_SECRET secure
- Use HTTPS in production
- Validate CORS origins
- Rate limit all endpoints
- Hash passwords (never plain text)
- Use HttpOnly cookies

---

## 🔄 Deployment Steps

### Quick Deploy
1. Update environment variables
2. Connect production MongoDB
3. Build both frontend and backend
4. Deploy backend to (Render/Railway/Azure)
5. Deploy frontend to (Vercel/Netlify)
6. Test all features

### Pre-Deployment Checklist
- [ ] Change JWT_SECRET
- [ ] Update CORS_ORIGIN
- [ ] Configure MongoDB Atlas
- [ ] Set NODE_ENV=production
- [ ] Test all features
- [ ] Enable HTTPS
- [ ] Set up monitoring

---

## 📞 Support Resources

### Within Project
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup help
- [README.md](./README.md) - Full documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Design info

### Online
- Next.js: https://nextjs.org/docs
- Express: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Tailwind: https://tailwindcss.com/docs

---

## ✅ Project Status

**Completion**: 100% ✅  
**Production Ready**: YES ✅  
**Type Safe**: YES ✅  
**Documented**: YES ✅  
**Secure**: YES ✅  

---

## 🎯 Next Actions

### For Immediate Use
1. Read DELIVERY_SUMMARY.md
2. Run install script
3. Start both servers
4. Test with default credentials

### For Development
1. Review ARCHITECTURE.md
2. Explore the codebase
3. Understand the API structure
4. Create your first feature

### For Production
1. Prepare deployment targets
2. Configure environment variables
3. Set up monitoring
4. Deploy and test
5. Monitor performance

---

## 🏆 Project Highlights

✨ **Production-Ready Code**  
🔒 **Enterprise Security**  
📚 **Comprehensive Documentation**  
⚡ **Fast Performance**  
🎨 **Premium UI Design**  
📱 **Fully Responsive**  
🔐 **Role-Based Access**  
🚀 **Scalable Architecture**

---

## 📞 Quick Links

| Resource | Link |
|----------|------|
| Start Here | [DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md) |
| Installation | [GETTING_STARTED.md](./GETTING_STARTED.md) |
| Quick Start | [QUICKSTART.md](./QUICKSTART.md) |
| Full Docs | [README.md](./README.md) |
| Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Features | [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) |

---

## 🎉 Ready to Go!

Everything you need is in place. Start with **[GETTING_STARTED.md](./GETTING_STARTED.md)** and you'll be running PORTA in minutes.

**Happy Coding! 🚀**

---

**PORTA v1.0.0** | Enterprise Portal | Production Ready  
Last Updated: 2024
