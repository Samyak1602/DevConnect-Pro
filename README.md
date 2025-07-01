# DevConnect Pro

A professional developer networking platform built with modern web technologies.

## Project Structure

```
DevConnect-Pro/
├── devconnect-backend/          # Backend API server
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── index.js                 # Main server file
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

## Backend Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd devconnect-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values according to your setup

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on `http://localhost:5000`

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development auto-restart

## Development

### Available Scripts

In the `devconnect-backend` directory:

- `npm run dev` - Start development server with auto-restart
- `npm test` - Run tests (coming soon)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the ISC License.