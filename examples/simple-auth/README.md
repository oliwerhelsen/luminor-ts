# Simple Authentication Example

A minimal example showing how to use Better Auth with Brewy.

## Features

- Email/Password authentication
- Protected and public routes
- User session management
- Simple blog posts CRUD

## Setup

```bash
# Install dependencies
npm install

# Run the server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - Create a new account
- `POST /api/auth/sign-in/email` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/get-session` - Get current session

### Public Routes
- `GET /api/posts` - List all posts (public)
- `GET /api/posts/:id` - Get a single post (public)

### Protected Routes (require authentication)
- `POST /api/posts` - Create a new post
- `DELETE /api/posts/:id` - Delete your own post
- `GET /api/me` - Get current user profile

## Example Requests

### 1. Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }' \
  -c cookies.txt
```

### 2. Sign In
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }' \
  -c cookies.txt
```

### 3. Create a Post (Protected)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first blog post!"
  }' \
  -b cookies.txt
```

### 4. Get All Posts (Public)
```bash
curl http://localhost:3000/api/posts
```

### 5. Get Current User (Protected)
```bash
curl http://localhost:3000/api/me -b cookies.txt
```

### 6. Sign Out
```bash
curl -X POST http://localhost:3000/api/auth/sign-out -b cookies.txt
```

## Code Structure

```
simple-auth/
├── src/
│   ├── index.ts              # Main application entry point
│   ├── auth.ts               # Auth configuration
│   └── routes/
│       ├── posts.ts          # Blog posts routes
│       └── profile.ts        # User profile routes
├── package.json
└── README.md
```
