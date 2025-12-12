# 🍽️ Ghadwa - Food Delivery App

A modern, responsive food delivery marketplace built with React, TypeScript, and Vite.

## 📋 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🛠️ Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚀 Deployment

The app is ready for deployment on Vercel. See [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) for detailed instructions.

## 📁 Project Structure

```
├── components/      # React components
│   ├── admin/      # Admin interface
│   ├── home/       # Home page sections
│   └── *.tsx       # Main components
├── pages/          # Page components
├── services/       # API & data services
├── utils/          # Utility functions
├── docs/           # Documentation
├── public/         # Static assets
└── App.tsx         # Root component
```

## 📚 Documentation

All documentation is in the [docs/](docs/) folder:

- **[DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment guide
- **[DEPLOYMENT_READINESS_SUMMARY.md](docs/DEPLOYMENT_READINESS_SUMMARY.md)** - Pre-deployment checklist
- **[PRE_DEPLOYMENT_SCAN_REPORT.md](docs/PRE_DEPLOYMENT_SCAN_REPORT.md)** - Full technical audit

## 🔧 Tech Stack

- **React** 19.2.1
- **TypeScript** 5.8+
- **Vite** 6.4.1
- **Tailwind CSS** (CDN)
- **Supabase** 2.87.1

## 🔐 Environment Variables

See `.env.example` for required variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_publishable_key
VITE_ENV=development
```

## 📦 Features

✅ Responsive design (mobile, tablet, desktop)  
✅ Chef & menu browsing  
✅ Shopping cart functionality  
✅ Order tracking  
✅ Admin dashboard  
✅ Local data persistence  

## 📞 Support

For issues or questions, refer to the documentation in the [docs/](docs/) folder or check the project's GitHub repository.

## 📄 License

This project is proprietary and confidential.
