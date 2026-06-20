# Mali — waste collection & recycling platform (Tanzania)

A production-oriented rebuild of your two-sided waste platform:

1. **Collection ("collect_ease")** — a generator requests a pickup, a nearby verified collector accepts, moves through a status flow, and gets paid into a wallet after the customer confirms. Both sides rate each other.
2. **Recycling market ("recycle_market")** — a seller lists recyclables, buyers make offers and negotiate, money is held in escrow until the goods are confirmed, then the seller is paid out.

Stack: **Django + Graphene (GraphQL)** backend, **Next.js (App Router) + Tailwind v4** frontend, installable as a **PWA**. Interface is **bilingual (Swahili / English)** with a visible toggle; Swahili is the default.

> All explanations live in this file on purpose — there are **no comments in the code**, per your instruction.

---

## 1. The design concept — "hi-vis civic"

The lime you chose (`#C0CA33`) is the colour of a **safety vest** — the gear waste collectors actually wear. So the whole identity is built on that idea: deep municipal **blue** for trust, a single lime **hi-vis diagonal stripe** as the one signature element (it appears in the logo mark, the headline underline, and the footer), heavy signage-style display type (**Archivo**) over a calm body face (**Inter**), big tap targets, and plain bilingual words instead of corporate copy.

It deliberately avoids everything on your "avoid" list: no purple-blue gradients, no glassmorphism, no floating dashboards, no glowing blobs, no generic feature grid, no startup hero, no buzzwords, no emojis. The hero is a Swahili-first statement — **"Taka ni mali." / "Waste is value."** — and the conversion path is three large role cards (I have waste / I collect / I buy recyclables) so a low-literacy user can self-select with one tap.

`preview.html` at the project root is a **standalone copy of the landing page** — open it directly in any browser to see the design without installing anything. The Next.js version under `frontend/` is the real deliverable and looks the same.

---

## 2. Project structure

```
waste-tech/
├── preview.html            open this to see the landing page immediately
├── README.md
├── backend/                Django + Graphene
│   ├── config/             settings, urls, combined GraphQL schema
│   ├── users/              custom phone-based User, PhoneOTP, auth mutations
│   ├── collect_ease/       CollectionJob, PricingRule, pickup flow
│   ├── recycle_market/     MaterialCategory, RecyclingListing, Offer, SaleTransaction
│   ├── finance/            Wallet, Transaction, WithdrawalRequest
│   ├── platform_core/      PlatformConfig, Notification, Dispute
│   ├── requirements.txt
│   └── .env.example
└── frontend/               Next.js + Tailwind v4
    ├── app/                layout, globals.css (your @theme), page (landing)
    ├── public/             manifest.json, sw.js, icons/
    ├── package.json
    └── next.config.mjs
```

---

## 3. Run it

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then edit .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # it will ask for a phone number, not a username
python manage.py runserver
```
GraphQL playground: `http://localhost:8000/graphql/` · Admin: `http://localhost:8000/admin/`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`. The PWA install prompt and service worker only work over **HTTPS or on localhost** (that is normal browser behaviour).

---

## 4. What I changed in your models, and why

Your originals had a few inconsistencies that would break at runtime or contradict the described flow. Each change is listed so nothing is a surprise.

1. **`users.User` — phone-based registration.** Your model set `USERNAME_FIELD = 'email'` but the flow is "register with a phone number", and `REQUIRED_FIELDS` listed `username` and `phone` (which `USERNAME_FIELD` already forbids overlapping). I switched login to **phone**: `USERNAME_FIELD = 'phone'`, `REQUIRED_FIELDS = ['role']`, made `username` and `email` optional, and added a `UserManager` (`create_user` / `create_superuser`) because `AbstractUser`'s default manager assumes a username. Added `rating_count` and `created_at`.

2. **`finance` wallet auto-creation — the signal would never fire.** Your `@receiver(post_save, sender=settings.AUTH_USER_MODEL)` passes a **string** as `sender`; Django needs the model class, so wallets would silently never be created. I moved the signal into `users/signals.py`, wired through `UsersConfig.ready()`, and used `get_or_create`. `finance/models.py` is now signal-free.

3. **`recycle_market.Offer` — `countered` had nowhere to store the counter price.** Added `counter_price`, so a seller can actually counter an offer.

4. **`recycle_market.SaleTransaction` — no ratings, unlike collection.** Collection jobs could be rated by both parties but sales could not. Added `buyer_rating`, `seller_rating`, an `offer` link, and `completed_at` for parity.

5. **`collect_ease.CollectionJob` — no money fields, unlike sales.** Sales carried `commission` and `seller_payout` but jobs did not, so the platform cut was unmodelled. Added `commission`, `collector_payout`, `payment_status`, `photo_url`, and `accepted_at`. Added a **`PricingRule`** model and an `estimate_price()` helper as the pricing engine.

6. **New `platform_core` app for the parts the flow needs but the models lacked.**
   - `PlatformConfig` — a single settings row for commission rates (collection default 15%, recycle 10%), matching radius, and the accept window. Read it with `PlatformConfig.current()`. This is what an admin adjusts.
   - `Notification` — SMS / push / in-app messages.
   - `Dispute` — links to a job or a sale so an admin can resolve it.
   - `users.PhoneOTP` — stores the one-time code for phone verification (10-minute expiry).

The GraphQL layer (`schema.py` in each app, stitched in `config/schema.py`) exposes types plus the core queries and mutations: register / request OTP / verify OTP, create pickup / accept / update status / confirm completion / rate, create listing / make offer / respond to offer, wallet & withdrawal, notifications & disputes. Auth uses `django-graphql-jwt` (`tokenAuth`, `verifyToken`, `refreshToken`).

---

## 5. What is intentionally stubbed (next phase)

These are wired as clean seams, not finished integrations, because they need **your live credentials and decisions**:

- **Sending the OTP SMS.** The code is generated and stored; actually delivering it needs an SMS gateway (see checklist).
- **Mobile-money in and out.** `ConfirmCompletion` pays the collector's wallet and records a transaction, and `RequestWithdrawal` queues a payout — but moving real money (M-Pesa / Tigo Pesa / Airtel Money) is not connected.
- **Escrow money movement** on the recycle side records the transaction states; tying real funds to it depends on the mobile-money integration.
- **Live collector matching / push delivery.** Open jobs are queryable; real-time "ping the nearest collector" needs a push service and a matching job.
- **The in-app screens** (pickup form, collector job board, market, wallet, profile/KYC upload, admin dashboard) are the next build on top of this landing page and API.

---

## 6. Everything YOU need to do

### Decisions / content
- [ ] **Confirm the product name.** "Mali" (Swahili for *wealth/value*) is a working placeholder used in the logo, manifest, and copy. Replace it everywhere if you have a real name.
- [ ] **Have a native Swahili speaker review all copy.** I wrote simple, careful Swahili, but it must be checked before launch. Strings live in `frontend/app/page.jsx` (and `preview.html`) as paired `data-sw` / `data-en` spans.
- [ ] **Supply real recycling prices.** I did **not** invent any per-kg prices. `MaterialCategory.base_price_per_kg` and the `PricingRule` rows are empty until you add real figures via the admin.
- [ ] **Set support contact details** in the footer (`[set your support phone]` / `[set your support email]`).

### Services & secrets (fill into `backend/.env`)
- [ ] **SMS gateway** for OTP and notifications (e.g. Africa's Talking, Beem, or your telco) → `SMS_PROVIDER_API_KEY`, `SMS_SENDER_ID`. Then send the code inside `RequestOTP`.
- [ ] **Mobile-money** merchant/collection API (M-Pesa, Tigo Pesa, Airtel Money, or an aggregator like Selcom/Beem/Flutterwave) → `MOBILE_MONEY_API_KEY/SECRET`. Wire it into payment, payout, and escrow.
- [ ] **Web push / VAPID keys** if you want push notifications → `PUSH_VAPID_PUBLIC_KEY/PRIVATE_KEY`.
- [ ] **Maps / geocoding key** if you want addresses → coordinates and distance matching (Google Maps or similar).
- [ ] **`DJANGO_SECRET_KEY`** — generate a long random value; never reuse the dev default.

### Infrastructure
- [ ] **Postgres in production.** SQLite is the default for local dev only. Set `DB_ENGINE=django.db.backends.postgresql` and the `DB_*` values; `psycopg2-binary` is already in requirements.
- [ ] **Hosting.** Backend (Render / Railway / a VPS) and frontend (Vercel works well for Next.js). Point the frontend at the backend's GraphQL URL and update `CORS_ALLOWED_ORIGINS`.
- [ ] **HTTPS.** Required for the PWA to install and for the service worker to run.
- [ ] **Set `DJANGO_DEBUG=false`** and a proper `DJANGO_ALLOWED_HOSTS` in production.

### Verify
- [ ] `createsuperuser` asks for a **phone number** (this is expected after the auth change).
- [ ] Seed `PlatformConfig`, `MaterialCategory` rows, and `PricingRule` rows in the admin so pricing and commission work.
- [ ] Open the site on a phone over HTTPS and confirm "Install the app" adds it to the home screen.

---

## 7. Notes
- Fonts load from Google Fonts (`next/font`); if you deploy somewhere without outbound network at build time, self-host Archivo and Inter instead.
- The language toggle stores the choice in `localStorage` under `mali-lang` and defaults to Swahili.
- The service worker (`public/sw.js`) is a small hand-written cache-first shell with an offline fallback — no extra build dependency. Bump `CACHE` ("mali-shell-v1") when you want clients to refresh.
