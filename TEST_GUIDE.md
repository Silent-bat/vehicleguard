# VehicleGuard - Test Guide

## Application URLs
- **Local:** http://localhost:3001
- **Network:** http://10.237.18.101:3001
- **Prisma Studio:** http://localhost:5555 (for database inspection)

## Test Accounts

### Admin Account (Pre-approved)
- **Email:** admin@vehicleguard.com
- **Password:** admin123456
- **Access:** Full admin dashboard, user approval, all features

### Regular User Account (Pre-approved for testing)
- **Email:** user@vehicleguard.com
- **Password:** user123456
- **Access:** Standard user dashboard (after admin approval)

## Testing Authentication & Approval Flow

### Test 1: Register a New User
1. Go to http://localhost:3001/register
2. Fill in the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
   - Confirm Password: test123456
3. Click "Create account"
4. **Expected Result:** You should see an alert message saying "Account created successfully! Your account is pending approval from an administrator."
5. You will be redirected to the login page

### Test 2: Try to Login with Unapproved Account
1. Go to http://localhost:3001/login
2. Try to login with the newly created account:
   - Email: test@example.com
   - Password: test123456
3. Click "Sign in"
4. **Expected Result:** You should see an error message: "Your account is pending approval from an administrator. Please contact your administrator."

### Test 3: Admin Login
1. Go to http://localhost:3001/login
2. Login with admin credentials:
   - Email: admin@vehicleguard.com
   - Password: admin123456
3. Click "Sign in"
4. **Expected Result:** You should be redirected to the admin dashboard at /admin

### Test 4: Approve New User (Admin)
1. While logged in as admin, click on "Gestion Utilisateurs" in the sidebar
2. You should see the pending user (test@example.com) in the "Comptes en attente d'approbation" section
3. Click the "Approuver" button next to the user
4. **Expected Result:** 
   - Success toast notification
   - User moves from pending to approved users list
   - User status changes to "Approuvé"

### Test 5: Login with Approved User
1. Logout from admin account (click avatar in sidebar footer -> Log out)
2. Go to http://localhost:3001/login
3. Login with the newly approved account:
   - Email: test@example.com
   - Password: test123456
4. Click "Sign in"
5. **Expected Result:** You should successfully login and see the user dashboard

### Test 6: Reject a User (Admin)
1. Login as admin
2. Register another test user (e.g., reject@example.com)
3. Go to "Gestion Utilisateurs"
4. Click "Rejeter" button next to the pending user
5. Confirm the deletion in the dialog
6. **Expected Result:**
   - User is deleted from the database
   - Success toast notification
   - User disappears from the list

### Test 7: Change User Role (Admin)
1. Login as admin
2. Go to "Gestion Utilisateurs"
3. Find an approved user in the "Tous les utilisateurs" section
4. Click "Promouvoir en Admin" button
5. **Expected Result:**
   - User role badge changes from "User" to "Admin"
   - Success toast notification
   - User can now access admin features

### Test 8: Admin Menu Visibility
1. Login as a regular user (user@vehicleguard.com)
2. **Expected Result:** You should NOT see the "Administration" and "Gestion Utilisateurs" menu items in the sidebar
3. Logout and login as admin
4. **Expected Result:** You SHOULD see the admin menu items in the sidebar

## Key Features Implemented

✅ **Authentication System**
- Email/password registration and login
- Secure session management with Better Auth
- Protected routes with middleware

✅ **Account Approval System**
- New users require admin approval
- Unapproved users cannot login
- Admins can approve or reject accounts
- Rejection deletes the user account

✅ **Role-Based Access Control**
- USER role: Standard dashboard and features
- ADMIN role: Full admin dashboard + user management
- Admins can promote/demote users

✅ **User Management Interface**
- View pending approvals
- View all users with stats (vehicles, theft cases)
- Approve/reject pending accounts
- Change user roles
- Activity logging for audit trail

✅ **Enhanced Database Schema**
- User approval tracking (isApproved, approvedAt, approvedById)
- User roles (USER, ADMIN)
- Vehicle status tracking (ACTIVE, STOLEN, RECOVERED, INACTIVE)
- Comprehensive theft case management
- Evidence and activity logging

## Navigation Structure

### For Regular Users:
- Dashboard (/)
- Véhicules (/vehicles)
- Signaler un vol (/report-theft)
- Dossiers de vol (/theft-cases)
- Rapports (/reports)

### For Admins (Additional):
- Administration (/admin)
- Gestion Utilisateurs (/admin/users)

## Notes
- Admin accounts are automatically approved
- All user actions are logged in the Activity table for audit purposes
- Password minimum length: 8 characters
- Database can be inspected using Prisma Studio at http://localhost:5555
