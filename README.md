# TechDukaan Frontend

A modern e-commerce platform for refurbished business laptops built with Next.js 15, TypeScript, and Supabase.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Authentication**: Supabase with OAuth (Google, Facebook)
- **E-commerce Features**: Cart, Wishlist, Product Comparison, Checkout
- **Search**: Advanced product search with MeiliSearch
- **Responsive Design**: Mobile-first design with dark/light themes
- **Real-time Data**: Supabase for user data synchronization
- **Production Ready**: Optimized for Vercel deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4.1.9
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase
- **Search**: MeiliSearch
- **Authentication**: Supabase Auth
- **State Management**: React Context
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 🏗️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AryanXPatel/TechDukaan-FE.git
cd TechDukaan-FE
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

- Supabase project URL and key
- MeiliSearch host and API key
- Other optional services

4. **Run development server**

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── account/           # User account pages
│   ├── auth/              # Authentication
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── product/           # Product pages
│   └── shop/              # Product catalog
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── cart/              # Cart components
│   ├── ui/                # shadcn/ui components
│   └── ...
├── lib/                   # Utilities and services
│   ├── supabase/          # Supabase configuration
│   └── ...
└── public/               # Static assets
```

## 🗄️ Database Setup

The project uses Supabase for authentication and user data. Run the SQL schema:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Execute the `supabase-schema.sql` file

This creates tables for:

- User addresses
- User preferences
- Cart items
- Wishlist items
- Product comparison

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**

   - Connect your GitHub repository to Vercel
   - Vercel will auto-detect Next.js configuration

2. **Environment Variables**
   Add these in your Vercel dashboard:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_MEILISEARCH_HOST=your_meilisearch_host
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Push to main branch
   - Vercel will automatically build and deploy

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🧪 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript type checking

## 🔧 Key Features

### Authentication

- Supabase authentication with OAuth providers
- Protected routes with AuthGuard component
- User session management

### E-commerce

- **Cart**: Persistent cart with localStorage and Supabase sync
- **Wishlist**: Save products for later
- **Comparison**: Side-by-side product comparison
- **Checkout**: Secure checkout for authenticated users

### Search

- Advanced product search with MeiliSearch
- Filter by categories, brands, specifications
- Real-time search suggestions

### User Experience

- Responsive design (mobile-first)
- Dark/light theme support
- Accessibility features
- Loading states and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository**: https://github.com/AryanXPatel/TechDukaan-FE
- **Issues**: https://github.com/AryanXPatel/TechDukaan-FE/issues
- **Supabase**: https://supabase.com
- **Vercel**: https://vercel.com
