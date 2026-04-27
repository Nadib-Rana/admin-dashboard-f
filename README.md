# Super Admin Console

This workspace has been rebuilt as a Super Admin-only Next.js application.

## Stack

- Next.js App Router
- Redux Toolkit
- Radix UI
- Framer Motion
- React Hook Form
- Zod
- Lucide Icons
- date-fns
- SweetAlert2
- Sonner
- class-variance-authority
- clsx
- tailwind-merge
- Docker

## What is included

- RBAC protection for admin routes
- Redux-based session storage
- Axios client with Bearer token interceptor
- Dashboard overview with animated metric cards
- User management table with active/inactive toggles
- Audit log table
- Responsive sidebar and top bar
- Dockerized deployment

## Routes

- `/login` — Super Admin sign in
- `/admin` — dashboard overview
- `/admin/users` — user management
- `/admin/audit-logs` — audit logs
- `/admin/referrals` — referral payouts management
- `/admin/referrals/all` — comprehensive referral management

## API endpoints

- `POST /api/auth/login`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `GET /api/admin/audit-logs`
- `GET /api/admin/referrals` (planned)
- `PATCH /api/admin/referrals/:id/status` (planned)
- `PATCH /api/admin/referrals/:id/note` (planned)

## Referral Management System

A comprehensive referral bonus management system has been implemented with the following features:

- **Referral Tracking**: Track all referral relationships between users and vendors
- **Bonus Management**: Calculate referral bonuses with extra incentives for high-volume referrers
- **Payout Processing**: Mark referrals as paid with timestamp tracking
- **Admin Notes**: Add administrative notes to referral records
- **Data Export**: Export referral data to CSV for reporting
- **Mock Data**: Currently using demo data for development and testing

### Bonus Calculation Logic

- Base bonus per referral (stored in database)
- Extra $5 bonus per referral for referrers with 10+ total referrals
- Formula: `totalBonus = sum(baseBonuses) + (referralCount >= 10 ? referralCount * 5 : 0)`

For detailed documentation including database schema, API specifications, component architecture, and setup instructions, see: **[REFERRAL_SYSTEM_DOCUMENTATION.md](REFERRAL_SYSTEM_DOCUMENTATION.md)**

## Demo credentials

- Email: `superadmin@demo.com`
- Password: `Admin@1234`

## Development

1. Install dependencies.
2. Run `npm run dev`.
3. Open `http://localhost:3000`.

## Docker

```bash
docker compose up --build
```

Then open `http://localhost:3000`.

## Notes

- Legacy landing pages, template assets, and unrelated dashboard code were removed.
- The local API layer mirrors the provided Prisma schema shape so it can be replaced with a real Prisma backend later.
- All admin UI, auth flow, and validation use the approved stack.
