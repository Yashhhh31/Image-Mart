# ImageMart — Stock Image Marketplace

A full-stack e-commerce platform for buying and selling stock images. Built with **Next.js 16**, **Tailwind CSS v4**, **MongoDB**, **ImageKit**, and **Razorpay**.

## ✨ Features

### For Buyers
- **Browse Gallery** — View all available images in a responsive card grid with hover effects
- **Multiple Variants** — Each image available in Square (1:1), Portrait (3:4), and Landscape (16:9)
- **License Options** — Choose between Personal Use and Commercial Use licenses
- **Secure Payments** — Pay via Razorpay with SSL encryption
- **Instant Download** — Download purchased images immediately after payment
- **Order History** — View all past orders with download links

### For Sellers
- **Upload Images** — Upload via ImageKit with drag-and-drop support (up to 5MB)
- **Set Pricing** — Configure different prices for each size/license variant
- **Manage Listings** — Admin panel for managing product catalog (admin users)

### User Roles
- **User** — Browse, purchase, and download images; upload own images for sale
- **Admin** — All user permissions plus access to admin management panel

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router, Turbopack) |
| **Tailwind CSS v4** | Utility-first styling |
| **MongoDB + Mongoose** | Database |
| **NextAuth.js** | Authentication (credentials/JWT) |
| **ImageKit** | Image upload, storage, and transformation |
| **Razorpay** | Payment processing |
| **React Hook Form** | Form handling & validation |
| **Lucide React** | Icons |
| **bcryptjs** | Password hashing |

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- ImageKit account (free tier available)
- Razorpay account (test mode)

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd imagemart
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MongoDB
MONGODB_URI="your_mongodb_connection_string"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Razorpay (test mode keys from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"

# ImageKit (from https://imagekit.io/dashboard)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
```

### 4. Seed the Database (optional)

Create an admin user (no sample/demo images are seeded — the marketplace
starts empty and only shows images that real users add via **Sell Your
Images** or the admin **Add New Image** page):
```bash
node scripts/seed-admin.mjs
```

This creates:
- Admin user: `admin@imagemart.com` / `admin123`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
imagemart/
├── app/
│   ├── admin/products/     # Admin panel (add products)
│   ├── api/
│   │   ├── auth/           # NextAuth + registration
│   │   ├── imagekit-auth/  # ImageKit authentication
│   │   ├── orders/         # Create & fetch orders
│   │   ├── products/       # CRUD products
│   │   └── webhook/        # Razorpay webhook
│   ├── components/         # Reusable UI components
│   │   ├── AdminProductForm.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Header.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── Notification.tsx
│   │   ├── ProductCard.tsx
│   │   └── Provider.tsx
│   ├── login/              # Login page
│   ├── orders/             # Order history page
│   ├── product/[id]/       # Product detail page
│   ├── register/           # Register page
│   ├── sell/               # Upload & sell image page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── lib/
│   ├── api-client.ts       # API client class
│   ├── auth.ts             # NextAuth configuration
│   ├── db.ts               # MongoDB connection
│   └── product-types.ts    # TypeScript types
├── models/
│   ├── Order.ts            # Order schema
│   ├── Product.ts          # Product schema
│   └── User.ts             # User schema
├── scripts/
│   └── seed-admin.mjs      # Admin user seeder
├── middlewares.ts          # NextAuth middleware
├── next.config.js          # Next.js config
├── types.d.ts              # Global type declarations
└── package.json
```

## 🖥️ Page Guide

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage with hero, features, image gallery |
| `/login` | Public | Sign in page |
| `/register` | Public | Create account page |
| `/sell` | Authenticated | Upload and list images for sale |
| `/product/[id]` | Public | Product detail with variant selector & purchase |
| `/orders` | Authenticated | View order history & download purchased images |
| `/admin/products` | Admin only | Admin panel for product management |

## 💳 Payment Flow

1. User browses images on homepage
2. Clicks "View Options" → navigates to `/product/[id]`
3. Selects size variant + license type
4. Clicks "Purchase" → Razorpay checkout opens
5. Completes payment → redirected to `/orders`
6. Downloads high-quality image from order history

## 📸 Image Upload Flow

1. User logs in → clicks "Sell Image" in header or hero section
2. Uploads image via ImageKit (drag-and-drop, max 5MB)
3. Sets title, description
4. Configures size variants (Square/Portrait/Landscape) with prices and license types
5. Submits → image listed on marketplace immediately

## 🧪 Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `NEXTAUTH_SECRET` | ✅ | JWT encryption secret |
| `NEXTAUTH_URL` | ⚠️ | Required for production |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay API secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | Public Razorpay key (exposed to browser) |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ✅ | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ✅ | ImageKit private key |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ✅ | ImageKit URL endpoint |
| `RESEND_API_KEY` | ❌ | Optional: for transactional emails |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational/demo purposes.