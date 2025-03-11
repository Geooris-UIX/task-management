# Node-Express-TypeScript Project

A simple Node.js project using Express and TypeScript.

## Installation

```sh
npm install
```

## Scripts

- **Start Development Server:** `npm start`
- **Build Project:** `npm run build`
- **Run Tests:** `npm test`

## Project Structure

```
/src
  /config
    db.ts                           <-- Configuration for Database
    mail.ts                         <-- Configuration for Mailers
  /mailers
    /auth
      authMailer.ts                 <-- Mailer for Authentication flow
      verificationMail.ts           <-- Verification mail HTML template
    /tasks
      taskMailer.ts                 <-- Mailer for Task flow
      reminderMail.ts               <-- Remainder mail HTML template
  /migrations                       <-- All the migrations for changing fields and data 
  /modules
    /auth                           <-- Handles user authentication
      entity.ts                     <-- Defines User Mongoose schema & model
      repository.ts                 <-- Handles User DB queries
      service.ts                    <-- Business logic for authentication
      types.d.ts                    <-- TypeScript types for User
      constants.ts                  <-- Error messages & constants
      routes.ts                     <-- Express routes for authentication
    
    /tasks                          <-- Handles task management
      entity.ts                     <-- Defines Task Mongoose schema & model
      repository.ts                 <-- Handles Task DB queries
      service.ts                    <-- Business logic for tasks
      types.d.ts                    <-- TypeScript types for Task
      constants.ts                  <-- Task-related constants
      routes.ts                     <-- Express routes for tasks

    /common                         <-- Handles common tasks
      middleware.ts                 <-- Defines middleware
      service.ts                    <-- Common business logic
      types.d.ts                    <-- Common types for whole application
  /schedulers
    taskReminders.ts                <-- Schedule reminder for task about to end.
  /index.ts                         <-- Entry point of the app
```
