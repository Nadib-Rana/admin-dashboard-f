# Referral Management System Documentation

## Overview

This document provides comprehensive documentation for the Referral Management System implemented in the admin dashboard. The system allows administrators to manage referral bonuses, track referral relationships between users, and process payouts.

## Table of Contents

1. [Database Schema](#database-schema)
2. [System Architecture](#system-architecture)
3. [Frontend Components](#frontend-components)
4. [Mock Data Structure](#mock-data-structure)
5. [Bonus Calculation Logic](#bonus-calculation-logic)
6. [API Endpoints](#api-endpoints)
7. [User Interface](#user-interface)
8. [Setup Instructions](#setup-instructions)

## Database Schema

### Referral Model (Prisma)

```prisma
model Referral {
  id               String   @id @default(uuid()) @db.Uuid
  referrerUserId   String   @map("referrer_user_id") @db.Uuid
  referrer         User     @relation("Referrer", fields: [referrerUserId], references: [id])
  referredVendorId String   @map("referred_vendor_id") @db.Uuid
  referredVendor   Vendor   @relation("ReferredVendor", fields: [referredVendorId], references: [id])
  bonusAmount      Decimal  @map("bonus_amount") @db.Decimal(10, 2)
  payoutStatus     PayoutStatus @default(pending) @map("payout_status")
  adminNote        String?  @map("admin_note")
  paidAt           DateTime? @map("paid_at")
  createdAt        DateTime @default(now()) @map("created_at")

  @@unique([referredVendorId])
  @@index([referrerUserId, payoutStatus])
  @@map("referrals")
}
```

### Related Models

- **User**: Contains referrer information (id, fullName, email)
- **Vendor**: Contains referred vendor information (id, user details)
- **PayoutStatus**: Enum with values `pending`, `paid`

## System Architecture

### Frontend Structure

```
src/
├── app/(admin)/admin/referrals/
│   ├── page.tsx                    # Pending payouts page
│   └── all/
│       └── page.tsx               # All referrals management page
├── components/admin/referrals/
│   ├── PendingPayoutsTable.tsx    # Pending payouts table
│   ├── ReferralTable.tsx          # All referrals table
│   ├── ViewReferredVendorsModal.tsx # Modal for viewing referrals
│   ├── MarkAsPaidModal.tsx        # Payment confirmation modal
│   └── AllUserReferralsTable.tsx  # User referral statistics
└── lib/
    └── mock-db.ts                 # Mock data and functions
```

### Key Features

1. **Referral Tracking**: Track all referral relationships
2. **Bonus Management**: Calculate and manage referral bonuses
3. **Payout Processing**: Mark referrals as paid with timestamps
4. **Admin Notes**: Add administrative notes to referrals
5. **Bulk Operations**: Export data to CSV
6. **Real-time Updates**: Immediate UI updates after operations

## Frontend Components

### 1. ReferralTable Component

**Location**: `src/components/admin/referrals/ReferralTable.tsx`

**Purpose**: Displays all referral records in a comprehensive table format.

**Features**:

- Shows referrer and referred vendor details
- Displays bonus amounts and payout status
- Inline editing for admin notes
- Mark as paid functionality
- Responsive design

**Props**:

```typescript
interface ReferralTableProps {
  referrals: Referral[];
  isLoading: boolean;
  onMarkPaid: (referral: Referral) => void;
  onUpdateNote: (referralId: string, note: string) => void;
  isUpdating: boolean;
}
```

### 2. PendingPayoutsTable Component

**Location**: `src/components/admin/referrals/PendingPayoutsTable.tsx`

**Purpose**: Displays pending referral payouts grouped by referrer.

**Features**:

- Groups referrals by referrer
- Shows summary statistics (count, total bonus)
- "View All" button to see detailed referrals
- Bonus calculation with extra incentives

### 3. ViewReferredVendorsModal Component

**Location**: `src/components/admin/referrals/ViewReferredVendorsModal.tsx`

**Purpose**: Modal dialog showing all referrals for a specific referrer.

**Features**:

- Detailed table of all referrals
- Individual mark as paid actions
- Admin note editing

## Mock Data Structure

### Referral Data Types

```typescript
export type ReferralRecord = {
  id: string;
  referrerUserId: string;
  referredVendorId: string;
  bonusAmount: number;
  payoutStatus: "pending" | "paid";
  adminNote?: string;
  paidAt?: string;
  createdAt: string;
};

export type Referral = {
  id: string;
  referrer: {
    id: string;
    fullName: string;
    email: string;
  };
  referredVendor: {
    id: string;
    user: {
      fullName: string;
      email: string;
    };
  };
  bonusAmount: number;
  payoutStatus: "pending" | "paid";
  adminNote?: string;
  paidAt?: string;
  createdAt: string;
};
```

### Sample Data

The system includes sample referral data:

- Super Admin referring Vendor One ($50, paid)
- Vendor One referring Vendor Two ($25, pending)
- Super Admin referring Vendor Two ($75, pending)

### Mock Functions

```typescript
// Get all referrals with populated user data
getAllReferrals(): Referral[]

// Update referral payout status
updateReferralStatus(referralId: string, status: "pending" | "paid"): Result

// Update admin note
updateReferralNote(referralId: string, note: string): Result
```

## Bonus Calculation Logic

### Standard Bonus

Each referral earns a base bonus amount stored in `bonusAmount` field.

### Extra Bonus Incentive

For referrers with 10+ referrals:

- Additional $5 bonus per referral
- Formula: `totalBonus = sum(bonusAmount) + (count >= 10 ? count * 5 : 0)`

### Example Calculation

Referrer with 12 referrals:

- Base bonuses: $50 + $25 + $75 = $150
- Extra bonus: 12 × $5 = $60
- Total payout: $210

## API Endpoints

All referral admin endpoints are protected for super admin access via the application auth flow. Requests are authenticated using the `super_admin_session` cookie or a `Bearer` token in the format `sa-token-<userId>`.

### Referral Stats

```
GET /api/admin/referral/stats
Response:
{
  "totalReferrals": number,
  "referralVendors": number,
  "convertedSubscriptions": number
}
```

### All User Referrals

```
GET /api/admin/all/user/refferls
Response: [
  {
    "userName": string,
    "email": string,
    "totalReferralVendors": number,
    "convertedSubscriptions": number,
    "bonus": string
  }
]
```

### Pending Payouts

```
GET /api/admin/referral/payouts
Response: PendingPayout[]
```

### Mark Referral as Paid

```
PATCH /api/admin/referral/:id/mark-paid
Content-Type: application/json
Body: {
  "adminNote": "TXN-12345"
}
```

Behavior:

- Sets `payoutStatus` to `paid`
- Sets `paidAt` to the current timestamp
- Stores optional `adminNote`
- Decrements the referrer user's `bonusBalance` by `bonusAmount`
- Creates an audit log entry with action `referral_marked_paid`

### Backend Implementation Notes

1. **Authentication**: Protected for super admin only
2. **Authorization**: `super_admin` role enforced in API guards
3. **Request Validation**: `zod` is used for payload validation
4. **Mock Data**: The current admin app uses `src/lib/mock-db.ts` for demo referral data
5. **Audit Logs**: Payout actions are recorded in `state.auditLogs`

## User Interface

### Navigation

- Admin sidebar includes "All Referrals" menu item
- Located at `/admin/referrals/all`

### Pages

#### All Referrals Page (`/admin/referrals/all`)

- **Header**: Title, refresh button, export CSV button
- **Table**: Comprehensive referral data table
- **Actions**: Mark as paid, edit notes, export data

#### Pending Payouts Page (`/admin/referrals`)

- **Grouped View**: Referrers with summary statistics
- **Modal Details**: Individual referral details
- **Bonus Calculations**: Includes extra incentives

### Responsive Design

- Mobile-friendly tables with horizontal scrolling
- Collapsible columns on small screens
- Touch-friendly buttons and interactions

## Setup Instructions

### 1. Database Setup

```sql
-- Run Prisma migrations
npx prisma migrate dev

-- Generate Prisma client
npx prisma generate
```

### 2. Environment Variables

Ensure `.env` includes database connection string:

```
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Access Admin Panel

1. Login as super admin
2. Navigate to `/admin/referrals/all`
3. View and manage referrals

## Data Flow

### Creating a Referral

1. User refers a vendor
2. System creates Referral record
3. Bonus amount calculated
4. Status set to "pending"

### Processing Payout

1. Admin reviews referral
2. Marks as "paid"
3. System updates status and paidAt timestamp
4. Bonus credited to referrer account

### Admin Management

1. View all referrals in table
2. Edit admin notes
3. Export data for reporting
4. Monitor payout status

## Security Considerations

### Authentication

- JWT token validation for all admin endpoints
- Role-based access control (super_admin only)

### Data Validation

- Input sanitization using Zod schemas
- SQL injection prevention via Prisma ORM
- Type safety with TypeScript

### Audit Trail

- All status changes logged
- Admin actions tracked in audit logs
- Timestamp tracking for all operations

## Future Enhancements

1. **Bulk Operations**: Mark multiple referrals as paid
2. **Filtering**: Filter by status, date range, referrer
3. **Search**: Search by user names or emails
4. **Notifications**: Email notifications for payouts
5. **Reports**: Advanced reporting and analytics
6. **Integration**: Payment gateway integration for automatic payouts

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed
2. **Type Errors**: Check TypeScript types match Prisma schema
3. **Database Connection**: Verify DATABASE_URL is correct
4. **Permissions**: Ensure user has super_admin role

### Debug Mode

Enable debug logging in development:

```bash
DEBUG=* npm run dev
```

## Support

For backend implementation questions, refer to:

- Prisma documentation: https://www.prisma.io/docs
- Next.js API routes: https://nextjs.org/docs/api-routes/introduction
- TypeScript types in `/src/types/admin.ts`

---

**Last Updated**: April 28, 2026
**Version**: 1.0.0
**Maintainer**: Development Team</content>
<parameter name="filePath">/home/nadibrana/Desktop/admin/admin-dashboard-f/REFERRAL_SYSTEM_DOCUMENTATION.md
