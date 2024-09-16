# Video Conferencing and Real-Time Chat Application

This project is a **Node.js** based video conferencing and chat application, allowing users to securely register, log in, and join video rooms. The application provides real-time communication using **Socket.IO** for chat and room functionality, with dynamic room creation using **UUIDs**.

## Features

### 1. User Authentication
- Users can register and log in securely using **Passport.js** and **passport-local-mongoose**.
- Passwords are encrypted and securely stored in the MongoDB database.

### 2. Real-Time Video Conferencing
- Users can join video chat rooms by entering or generating a unique room ID.
- Rooms are dynamically generated with unique IDs using **UUID**.

### 3. Live Chat Support
- Integrated **Socket.IO** for real-time messaging within video rooms.
- Messages are broadcast to all users within a room.

### 4. MongoDB Integration
- The application uses **MongoDB** as the database, connected via **Mongoose** for storing user credentials and session data.

### 5. Express.js Web Server
- The server is built using **Express.js** and serves web pages using **EJS** as the templating engine.
- Static files like CSS, images, and client-side JavaScript are served from the `public` directory.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gaurav01singh/video-conferencing-website.git
