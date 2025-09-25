# ChipsStore - MERN Stack E-commerce

A complete e-commerce website for selling chips built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Frontend (React + Vite)**
  - Responsive product catalog
  - Shopping cart with quantity management
  - Checkout system with customer details
  - Success animations and notifications
  - Mobile-friendly design with Tailwind CSS

- **Backend (Node.js + Express)**
  - RESTful API for products and orders
  - MongoDB integration with Mongoose
  - Admin authentication and management
  - Order processing and storage

- **Admin Panel**
  - Product management (CRUD operations)
  - Order viewing and tracking
  - Secure admin authentication

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (recommended), Docker support included

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd chips-ecommerce
   \`\`\`

2. **Setup Backend**
   \`\`\`bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   npm run seed  # Populate with sample products
   npm run dev   # Start development server
   \`\`\`

3. **Setup Frontend**
   \`\`\`bash
   cd client
   npm install
   npm run dev   # Start development server
   \`\`\`

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin (Key: chips-admin-2024)

## Environment Variables

### Backend (.env)
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chips_ecommerce
ADMIN_KEY=chips-admin-2024
NODE_ENV=development
PORT=5000
\`\`\`

### Frontend (for production)
\`\`\`env
VITE_API_URL=https://your-backend-url.vercel.app
\`\`\`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin only)

### Admin
- `POST /api/admin/products` - Add product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)
- `GET /api/admin/products` - Get all products including out of stock (admin only)

## Deployment

### Vercel (Recommended)

1. **Deploy Backend**
   \`\`\`bash
   cd server
   vercel --prod
   \`\`\`
   - Add environment variables in Vercel dashboard
   - Note the deployment URL

2. **Deploy Frontend**
   \`\`\`bash
   cd client
   # Update vercel.json with your backend URL
   vercel --prod
   \`\`\`

### Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up --build -d
\`\`\`

### Other Platforms

- **Render**: Use the included Dockerfile
- **Railway**: Connect GitHub repo and deploy
- **Heroku**: Add Procfile and deploy

## Database Setup

1. **MongoDB Atlas**
   - Create a free cluster at mongodb.com
   - Get connection string
   - Add to environment variables

2. **Seed Data**
   \`\`\`bash
   cd server
   npm run seed
   \`\`\`

## Admin Access

- **URL**: `/admin`
- **Default Key**: `chips-admin-2024`
- **Features**: Add/Edit/Delete products, View orders

## Project Structure

\`\`\`
chips-ecommerce/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (cart)
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   └── server.js           # Main server file
├── docker-compose.yml      # Docker configuration
└── README.md
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with details

---

Built with ❤️ using the MERN stack
