## ChatSDKX

### Why This Exists

chatsdkx is a comprehensive chat application framework designed to simplify the development of scalable and secure chat applications. It provides a robust set of features for managing user authentication, chat functionality, and email communication, ensuring a seamless user experience.

### What It Does

- **User Authentication**: Handles user sign-in, sign-up, password reset, and verification, as well as Google authentication and password strength feedback.
- **Chat Management**: Enables chat-related business logic, including deletion, enhancement, retrieval, and updating of chat data, as well as managing chat threads, lists, and prompt suggestions.
- **Email Communication**: Provides a robust framework for sending password reset notifications and verifying email addresses.
- **Error Handling and Logging**: Standardizes and manages error codes for authentication, chat, user operations, and common issues, facilitating consistent error management throughout the codebase.
- **API Response Schemas**: Validates and structures data exchanged between services for authentication, chat, and other features, ensuring consistency and correctness of data across the application.

### How It's Built

#### 🔒 Authentication and User Management (`/apps/api/src`)

The core API module handles user authentication, chat functionality, and email communication. It provides a robust framework for managing user sessions, verifying email addresses, and sending password reset notifications.

#### 📱 Web Application (`/apps/web`)

The web application module serves as the core authentication and user management pipeline for the web application. It handles user sign-up, sign-in, password recovery, and reset functionality, as well as email verification and Google authentication.

#### 📝 UI Component Library (`/apps/web/components`)

The UI component library provides a range of reusable components for creating visually appealing and interactive user interfaces, including customizable hover effects, grid backgrounds, animations, and input fields.

#### 🗣️ Chat Application (`/apps/web/features/chat`)

The chat application module handles chat-related business logic, including deletion, enhancement, retrieval, and updating of chat data, as well as managing chat threads, lists, and prompt suggestions.

#### 📝 Error Handling and Logging (`/packages/shared`)

The error handling and logging module standardizes and manages error codes for authentication, chat, user operations, and common issues, facilitating consistent error management throughout the codebase.

#### 📁 API Response Schemas (`/packages/shared/src/responses`)

The API response schemas module validates and structures data exchanged between services for authentication, chat, and other features, ensuring consistency and correctness of data across the application.

#### 🗂️ Data Validation and Schema Definitions (`/packages/shared/src/schemas`)

The data validation and schema definitions module encompasses authentication-related schemas, such as validating user sign-in and sign-up data, as well as chat-related schemas for prompt enhancement, chat deletion, and title updates.

#### 🏗️ Infrastructure (`/`)

The root directory module serves as the foundation for the application's infrastructure, defining and validating environment configurations, initializing and managing the Prisma database client, and providing a global instance for database interactions.
