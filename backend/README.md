# KIIK 69 Backend API

A complete Express.js backend for the KIIK 69 Sports Bar website with SQLite database, authentication, and file uploads.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the API:**
   - Health check: `http://localhost:5001/api/health`
   - API base: `http://localhost:5001/api`

## 🔑 Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

## 📊 Database Schema

The backend uses SQLite with the following tables:

- **users** - Admin authentication
- **menu_items** - Food and drink items
- **events** - Bar events and activities
- **gallery_items** - Images and videos
- **party_packages** - Party booking packages
- **games** - Available games
- **contact_messages** - Contact form submissions

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Menu Management
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)
- `GET /api/menu/categories/list` - Get menu categories

### Events Management
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Gallery Management
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get specific gallery item
- `POST /api/gallery` - Create gallery item (admin)
- `PUT /api/gallery/:id` - Update gallery item (admin)
- `DELETE /api/gallery/:id` - Delete gallery item (admin)
- `GET /api/gallery/categories/list` - Get gallery categories

### Party Packages
- `GET /api/party-packages` - Get all packages
- `GET /api/party-packages/:id` - Get specific package
- `POST /api/party-packages` - Create package (admin)
- `PUT /api/party-packages/:id` - Update package (admin)
- `DELETE /api/party-packages/:id` - Delete package (admin)

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get specific game
- `POST /api/games` - Create game (admin)
- `PUT /api/games/:id` - Update game (admin)
- `DELETE /api/games/:id` - Delete game (admin)
- `GET /api/games/types/list` - Get game types

### Contact
- `POST /api/contact/submit` - Submit contact form (public)
- `GET /api/contact` - Get messages (admin)
- `GET /api/contact/:id` - Get specific message (admin)
- `PATCH /api/contact/:id/status` - Update message status (admin)
- `DELETE /api/contact/:id` - Delete message (admin)
- `GET /api/contact/stats/overview` - Get contact stats (admin)

## 📁 File Uploads

The backend supports file uploads for:
- Menu item images
- Event images
- Gallery images and videos
- Party package images
- Game images

Files are stored in the `uploads/` directory with organized subdirectories.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with express-validator
- File upload security with multer
- Helmet.js for security headers

## 🛠️ Environment Variables

Create a `.env` file with:

```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
DB_PATH=./data/kiik69.db
```

## 📦 Dependencies

- **express** - Web framework
- **sqlite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File uploads
- **express-validator** - Input validation
- **cors** - Cross-origin requests
- **helmet** - Security headers
- **morgan** - Logging
- **compression** - Response compression

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Set up a production database
5. Use a process manager like PM2
6. Configure reverse proxy (nginx)
7. Set up SSL certificates

## 🔧 Development

- **Hot reload:** `npm run dev`
- **Production build:** `npm start`
- **Database location:** `./data/kiik69.db`
- **Upload directory:** `./uploads/` 