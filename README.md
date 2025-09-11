# AnupMail - Email Client Application
Project Overview
AnupMail is a modern, responsive email client application built with React that allows users to send, receive, and manage emails. It features a clean, intuitive interface with functionality similar to popular email services.

# Features
Email Management: Send, receive, and organize emails
Folder System: Inbox, Sent, and Trash folders
Read/Unread Status: Visual indicators for unread messages
Email Threads: View individual email details with full content

# Technologies Used
Frontend: React, React Router DOM, Axios
Styling: Tailwind CSS
Authentication: JWT (JSON Web Tokens)
Backend: Node.js, Express 
Database: MongoDB Atlas

# Installation

# Clone the repository:

git clone https://github.com/Anupkr7273/AnupMail.git
cd AnupMail


# Install dependencies for both frontend and backend:

cd backend
npm install
cd ../frontend
npm install


# Create a .env file in the backend with the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


# Start the backend server:
cd backend
npm run dev


# Start the frontend server:
cd frontend
npm run dev


# Open the application in your browser at:

http://localhost:5173
