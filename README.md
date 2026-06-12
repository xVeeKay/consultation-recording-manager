# Consultation Recording Manager

A CRM-style web application that helps astrologers manage customers, consultations, and consultation recordings from a centralized dashboard.

Live Demo: https://consultation-recording-manager-pearl.vercel.app/

Backend API: https://consultation-recording-manager-lmyh.onrender.com/

---

## Demo Credentials

Use the following account to explore the application:

Email: demo@gmail.com

Password: demo@123

The demo account already contains sample customers, consultations, and recordings so reviewers can immediately evaluate the application's workflow without creating data manually.

---

## Features

- JWT Authentication
- Customer Management
- Consultation Management
- Audio Recording Uploads
- Cloudinary Integration
- Dashboard Analytics
- Secure Route Protection
- Request Validation using Zod
- Centralized Error Handling

---

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Shadcn UI
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Zod

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- File Storage: Cloudinary

---

## Project Structure

backend/
├── controllers
├── middlewares
├── models
├── routes
├── validators
├── utils

frontend/
├── pages
├── components
├── layouts
├── api
├── hooks

---

## Authentication Flow

1. User logs in
2. JWT token generated
3. Token stored in HTTP-only cookie
4. Protected routes verify token
5. User remains authenticated across requests

---

## Consultation Workflow

1. Create Customer
2. Create Consultation
3. Upload Recording
4. Recording stored in Cloudinary
5. Consultation linked with recording URL
6. Recording available for playback/download

---

## Engineering Decisions

### Separate Recording Upload Endpoint

Recording uploads can take significantly longer than creating consultation metadata.

To improve reliability and user experience, consultation creation and recording uploads were separated into independent operations.

Benefits:

- Faster consultation creation
- Better failure handling
- Easier upload retries
- Cleaner API design

---

### Cloudinary for Recording Storage

Audio files can become large over time.

Instead of storing files on the application server, recordings are uploaded directly to Cloudinary.

Benefits:

- Scalable storage
- CDN delivery
- Reduced server load
- Easier file management

---

### Zod Validation

All incoming requests are validated using Zod schemas before reaching business logic.

Benefits:

- Consistent validation
- Cleaner controllers
- Better API error messages

---

### Centralized Error Handling

The application uses:

- ApiError
- ApiResponse
- asyncHandler
- Global Error Middleware

Benefits:

- Consistent API responses
- Cleaner controller code
- Reduced duplication

---

### Role Simplification

The application currently supports a single authenticated astrologer role.

Since the assignment focuses on engineering quality rather than enterprise authorization systems, role complexity was intentionally kept minimal.

## Future Improvements

- Multi-user role system
- Appointment scheduling
- Recording transcription
- AI-generated consultation summaries
- Consultation search using transcripts
- Reminder notifications
- Recording streaming support
- Advanced analytics dashboard