# 👥 Admin User CRUD & Management

## ✅ Complete User Management Features

Admins now have **full CRUD (Create, Read, Update, Delete)** capabilities for user management, plus the ability to unapprove users.

---

## 🎯 Available Operations

### ✅ CREATE
- Create new users with email/password
- Assign role (USER or ADMIN)
- Auto-approve or leave pending

### ✅ READ
- View all users in table format
- See user statistics (vehicles, theft cases)
- View approval status
- Check user roles

### ✅ UPDATE
- Edit user name
- Change user email
- Modify user role (USER ↔ ADMIN)

### ✅ DELETE
- Remove users from system
- Cascade delete all related data
- Protection: Can't delete last admin

### ✅ APPROVE/UNAPPROVE
- Approve pending users
- Unapprove approved users (revoke access)
- Reject and delete pending users

---

## 🚀 How to Use

### Access User Management:
1. Login as admin: http://localhost:3001/login
2. Navigate to "Gestion Utilisateurs"
3. Use the available action buttons

---

## 📋 User Actions Reference

### For Pending Users:

| Action | Button | Description |
|--------|--------|-------------|
| **Approve** | ✅ Approuver | Approve user, allow login |
| **Reject** | ❌ Rejeter | Delete user and account |

### For Approved Users:

| Action | Button | Description |
|--------|--------|-------------|
| **Edit** | ✏️ Modifier | Edit name, email, role |
| **Unapprove** | 🚫 Retirer approbation | Revoke access, block login |
| **Delete** | 🗑️ Supprimer | Permanently delete user |

---

## 🔧 Detailed Features

### 1. CREATE User
**Button:** "Créer un utilisateur" (top right)

**Form Fields:**
- Name (required)
- Email (required, must be unique)
- Password (required, min 8 chars)
- Role (USER or ADMIN)
- Auto-approve checkbox (✅ by default)

**Result:**
- User account created
- Credentials set
- Can login immediately if approved
- Activity logged

---

### 2. READ Users
**Location:** User Management table

**Information Displayed:**
- Name
- Email
- Role badge (with icon)
- Approval status
- Number of vehicles registered
- Number of theft cases reported

**Sections:**
- **Pending Approvals** - Users waiting for approval
- **All Users** - Complete user list

---

### 3. UPDATE User
**Button:** "Modifier" (in user row)

**Editable Fields:**
- ✏️ Name
- ✏️ Email (validated for uniqueness)
- ✏️ Role (USER/ADMIN dropdown)

**Features:**
- Real-time validation
- Duplicate email prevention
- Toast notifications
- Activity logging

**Example:**
```
Before:
  Name: Jean Dupont
  Email: jean@old.com
  Role: USER

After:
  Name: Jean Dupont-Martin
  Email: jean@new.com
  Role: ADMIN
```

---

### 4. DELETE User
**Button:** "Supprimer" (red, destructive)

**Safety Features:**
- ⚠️ Confirmation dialog required
- 🛡️ Cannot delete last admin
- 📝 Activity logged before deletion
- 🗑️ Cascades to related data

**What Gets Deleted:**
- User account
- Login credentials
- Sessions
- All activities by user
- Related vehicles (if any)
- Related theft cases (if any)

**Confirmation Dialog:**
```
⚠️ Êtes-vous sûr?

Cette action supprimera définitivement le compte de
user@example.com et toutes ses données associées.
Cette action est irréversible.

[Annuler]  [Confirmer la suppression]
```

---

### 5. UNAPPROVE User
**Button:** "Retirer approbation"

**Purpose:**
- Revoke user access temporarily
- Block login without deleting account
- Keep user data intact
- Can re-approve later

**Use Cases:**
- Suspend user for investigation
- Temporary account deactivation
- Security concerns
- Policy violations

**Effect:**
```
Before: isApproved = true  → User can login ✅
After:  isApproved = false → User cannot login ❌
```

When user tries to login:
```
❌ Your account is pending approval from an
   administrator. Please contact your administrator.
```

---

## 🔐 Security & Validation

### Email Validation:
- ✅ Must be valid email format
- ✅ Must be unique in system
- ✅ Checked on create and update

### Role Management:
- ✅ Admin can promote/demote
- ✅ Cannot delete last admin
- ✅ Role changes logged

### Password Requirements:
- ✅ Minimum 8 characters
- ✅ Securely hashed (Better Auth)
- ✅ Cannot be viewed by admin

### Deletion Protection:
- ✅ Confirmation required
- ✅ Last admin protected
- ✅ Activity logged first

---

## 📊 Activity Logging

All operations are logged for audit:

### CREATE_USER:
```json
{
  "action": "CREATE_USER",
  "entityType": "User",
  "entityId": "user-id",
  "details": "Created user user@example.com with role USER",
  "userId": "admin-id",
  "timestamp": "2024-12-09T15:00:00Z"
}
```

### UPDATE_USER:
```json
{
  "action": "UPDATE_USER",
  "entityType": "User",
  "entityId": "user-id",
  "details": "Updated user user@example.com: {\"name\":\"New Name\",\"role\":\"ADMIN\"}",
  "userId": "admin-id",
  "timestamp": "2024-12-09T15:05:00Z"
}
```

### DELETE_USER:
```json
{
  "action": "DELETE_USER",
  "entityType": "User",
  "entityId": "user-id",
  "details": "Deleted user user@example.com",
  "userId": "admin-id",
  "timestamp": "2024-12-09T15:10:00Z"
}
```

### UNAPPROVE_USER:
```json
{
  "action": "UNAPPROVE_USER",
  "entityType": "User",
  "entityId": "user-id",
  "details": "Unapproved user user@example.com",
  "userId": "admin-id",
  "timestamp": "2024-12-09T15:15:00Z"
}
```

---

## 🎯 Use Case Examples

### Scenario 1: New Employee Onboarding
```
1. Admin clicks "Créer un utilisateur"
2. Fills: Name, Email, Password, Role=USER, Auto-approve=✅
3. Employee receives credentials
4. Employee logs in immediately ✅
```

### Scenario 2: Role Promotion
```
1. Admin clicks "Modifier" for user
2. Changes Role from USER to ADMIN
3. Saves changes
4. User now has admin access ✅
```

### Scenario 3: Security Incident
```
1. Admin clicks "Retirer approbation"
2. User can no longer login ❌
3. Admin investigates issue
4. Admin either:
   - Re-approves user, or
   - Deletes user permanently
```

### Scenario 4: Employee Departure
```
1. Admin clicks "Supprimer"
2. Confirms deletion
3. User account removed ✅
4. All user data archived in activity log
```

### Scenario 5: Correcting User Info
```
1. Admin clicks "Modifier"
2. Updates email from old@company.com to new@company.com
3. User continues with new email ✅
```

---

## 🔄 User Lifecycle

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. CREATED (by admin or self-registration)     │
│           ↓                                     │
│  2. PENDING (isApproved = false)                │
│           ↓                                     │
│  3. APPROVED (admin approves)                   │
│           ↓                                     │
│  4. ACTIVE (user can login and use system)      │
│           ↓                                     │
│  Options:                                       │
│  • UNAPPROVED → back to PENDING                 │
│  • UPDATED → modify info, stays ACTIVE          │
│  • DELETED → permanently removed                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🧪 Testing Guide

### Test Create:
1. Login as admin
2. Click "Créer un utilisateur"
3. Fill form with new user data
4. Submit and verify user appears in list

### Test Update:
1. Click "Modifier" on any user
2. Change name, email, or role
3. Save and verify changes appear

### Test Delete:
1. Click "Supprimer" on a test user
2. Confirm deletion
3. Verify user removed from list

### Test Unapprove:
1. Click "Retirer approbation" on approved user
2. Logout
3. Try to login as that user → Should fail ❌
4. Login as admin and re-approve

---

## ⚠️ Important Notes

### Cannot Delete Last Admin:
```
❌ Impossible de supprimer le dernier administrateur
```
System ensures at least one admin always exists.

### Email Must Be Unique:
```
❌ Cet email est déjà utilisé
```
Each email can only be used once.

### Unapproved Users Cannot Login:
```
❌ Your account is pending approval from an administrator
```
Login is blocked until re-approved.

---

## 📈 Benefits

### For Administrators:
- ✅ Complete control over user accounts
- ✅ Quick user management
- ✅ Security through approval system
- ✅ Audit trail for compliance
- ✅ Flexible user lifecycle management

### For Security:
- ✅ Prevent unauthorized access
- ✅ Suspend suspicious accounts
- ✅ Full audit logging
- ✅ Protected admin deletion

### For Compliance:
- ✅ All actions logged
- ✅ User access control
- ✅ Data retention policies
- ✅ GDPR-ready (user deletion)

---

## 🎉 Summary

**Admin can now:**
- ✅ **Create** users with custom settings
- ✅ **Read** all user information
- ✅ **Update** user details and roles
- ✅ **Delete** users permanently
- ✅ **Approve** pending users
- ✅ **Unapprove** active users

**All with:**
- 🔒 Security validation
- 📝 Activity logging
- ⚠️ Safety confirmations
- 🎯 User-friendly interface

---

**Access:** http://localhost:3001/admin/users

**Full CRUD operations ready for production use!** 🚀

