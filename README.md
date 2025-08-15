# ChatSDKX - Your AI-Powered Chat Companion

## 1. Project Overview

ChatSDKX is a cutting-edge chat application designed to provide users with an intelligent and intuitive messaging experience. It leverages the power of Google's Gemini AI to offer features like real-time assistance, code tutoring, and dynamic content generation within a familiar chat interface.

**Why does this exist?**

Traditional chat applications often lack the ability to provide contextual assistance or generate dynamic content. ChatSDKX addresses this gap by integrating AI capabilities directly into the chat experience, making it a powerful tool for learning, problem-solving, and collaboration.

**Who is it for?**

- Developers seeking an AI-powered coding assistant.
- Students looking for a dynamic learning environment.
- Anyone who wants a more intelligent and interactive chat experience.

**What makes it unique?**

- **Seamless AI Integration:** Google Gemini AI is deeply integrated for intelligent responses and code generation.
- **Real-time Assistance:** Get help and suggestions as you type.
- **Dynamic Content:** Generate code snippets, explanations, and more directly within the chat.
- **Modern UI:** Built with React, Next.js, Tailwind CSS, and Shadcn UI for a sleek and responsive user experience.

## 2. Key Features

- **User Authentication:** Secure authentication using NextAuth.js with providers like GitHub and Google.
- **Real-time Messaging:** Send and receive messages instantly.
- **AI-Powered Assistance:** Google Gemini AI provides intelligent responses and code generation.
- **Code Tutoring:** Get explanations and suggestions for code snippets.
- **File Attachments:** Share files within the chat interface.
- **Chat History:** View and manage your previous conversations.
- **Markdown Support:** Format messages using Markdown.
- **Customizable UI:** Styled with Tailwind CSS and Shadcn UI for a consistent and modern look.
- **Mobile-Responsive:** Optimized for use on a variety of devices.
- **Dynamic Backgrounds:** Visually appealing backgrounds with moving gradients and animations.
- **Toast Notifications:** Display informative messages to the user using Sonner.
- **Sidebar Navigation:** Easy access to chats and user settings.
- **Code Block Highlighting:** Beautiful syntax highlighting for code snippets.

## 3. Architecture & Code Organization

ChatSDKX follows a modern web application architecture, leveraging the strengths of Next.js for server-side rendering, routing, and API endpoints. The application is structured into reusable components and modules, making it easy to maintain and extend.

**Overall Architecture:**

- **Frontend:** React, Next.js, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API routes, Prisma (ORM)
- **Authentication:** NextAuth.js
- **AI Integration:** Google Gemini AI

**Component Interaction:**

- The `Chat` component orchestrates the main chat interface, handling message display, streaming responses from the AI, and user input.
- `ChatInput` manages user input, file attachments, and prompt improvement features.
- `useMessage` hook manages the state of messages in a chat.
- API routes in `app/api/chat/[id]/ask/route.ts` handle user queries to the AI.
- Prisma is used to interact with the database for storing and retrieving chat data.

**Directory Structure:**

```
├── app/                # Next.js app directory (pages, layouts, API routes)
├── components/         # Reusable React components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── lib/                # Utility functions, AI integration, Prisma client
├── prisma/             # Prisma schema and migrations
├── styles/             # Global CSS styles
├── public/             # Static assets
└── ...
```

**Key Design Decisions:**

- **Next.js:** Chosen for its server-side rendering capabilities, routing, and API endpoint handling.
- **Prisma:** Selected as the ORM for its type safety and ease of use.
- **Tailwind CSS & Shadcn UI:** Used for rapid UI development and a consistent design system.
- **Google Gemini AI:** Integrated for its powerful language generation capabilities.

## 4. Technology Stack

- **Next.js:** React framework for building performant web applications.
- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Superset of JavaScript that adds static typing.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Shadcn UI:** Reusable UI components built with Radix UI and Tailwind CSS.
- **Prisma:** ORM for database access.
- **NextAuth.js:** Authentication library for Next.js.
- **Google Gemini AI:** Language model for AI-powered features.
- **Framer Motion:** Animation library for React.
- **Radix UI:** Unstyled, accessible UI primitives.
- **Sonner:** Library for displaying toast notifications.

**Why these technologies?**

This stack was chosen for its modern features, developer productivity, and performance. Next.js provides server-side rendering and routing, while React and TypeScript enable building maintainable and scalable user interfaces. Tailwind CSS and Shadcn UI offer a rapid UI development experience, and Prisma simplifies database interactions.

## 5. Getting Started

**Prerequisites:**

- Node.js (version 18 or higher)
- npm or yarn
- Google Cloud project with Gemini API enabled
- PostgreSQL database

**Installation:**

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd ChatSDKX
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

3.  Set up environment variables:

    - Create a `.env.local` file in the root directory.
    - Add the following variables, replacing the placeholders with your actual values:

      ```
      DATABASE_URL="your_postgresql_connection_string"
      NEXTAUTH_SECRET="your_secret_key"
      NEXTAUTH_URL="http://localhost:3000" # or your deployment URL
      GITHUB_ID="your_github_client_id"
      GITHUB_SECRET="your_github_client_secret"
      GOOGLE_CLIENT_ID="your_google_client_id"
      GOOGLE_CLIENT_SECRET="your_google_client_secret"
      GEMINI_API_KEY="your_gemini_api_key"
      ```

4.  Run Prisma migrations:

    ```bash
    npx prisma migrate dev --name init
    ```

5.  Start the development server:

    ```bash
    npm run dev # or yarn dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

**Basic Usage:**

1.  Sign in using GitHub or Google.
2.  Start a new chat or select an existing one.
3.  Type your message in the input field and press Enter.
4.  The AI will respond with intelligent suggestions and code snippets.

**Common Development Commands:**

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run format`: Format the code using Prettier.
- `npx prisma migrate dev`: Create a new Prisma migration.
- `npx prisma migrate deploy`: Apply Prisma migrations to the database.
- `npx prisma studio`: Open the Prisma Studio to view and manage the database.

## 6. Project Structure

```
ChatSDKX/
├── app/                      # Next.js app directory
│   ├── (home)/               # Home route
│   │   ├── layout.tsx        # Layout for the home route
│   │   ├── page.tsx          # Home page component
│   ├── (protected)/          # Protected routes (requires authentication)
│   │   ├── chat/             # Chat related components and pages
│   │   │   ├── [id]/         # Dynamic route for individual chats
│   │   │   │   ├── page.tsx  # Chat page component
│   │   │   │   ├── action.ts # Server actions for fetching chat data
│   │   │   ├── new/          # Route for creating a new chat
│   │   │   │   ├── page.tsx  # New chat page component
│   │   │   ├── action.ts     # Server actions for chat functionality
│   │   │   ├── chat.tsx      # Main chat component
│   │   │   ├── chat-history.tsx # Chat history component
│   │   │   ├── chat-input.tsx  # Chat input component
│   │   │   ├── chat-header.tsx # Chat header component
│   │   │   ├── layout.tsx      # Layout for the chat section
│   │   │   ├── page.tsx        # Main chat page component
│   │   │   ├── sidebar.tsx     # Sidebar component
│   │   │   ├── sidebar-toggle.tsx # Sidebar toggle component
│   │   │   ├── sidebar-history-item.tsx # Sidebar chat history item
│   │   │   ├── sidebar-user-nav.tsx # Sidebar user navigation
│   │   │   ├── message-content.tsx # Component to render message content
│   │   │   ├── file-preview-card.tsx # Component to preview attached files
│   │   │   ├── prompt-reasoning.tsx # Component to display reasoning toast
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth.js API routes
│   │   │   ├── [...nextauth]/ # NextAuth.js route handler
│   │   ├── chat/             # Chat API routes
│   │   │   ├── [id]/         # Dynamic route for individual chats
│   │   │   │   ├── ask/      # Route for asking the AI
│   │   │   │   │   ├── route.ts # API route handler
│   │   │   ├── route.ts      # API route handler for chat data
│   ├── layout.tsx            # Root layout component
│   ├── not-found.tsx         # Custom 404 page component
│   ├── globals.css           # Global CSS styles
├── components/             # Reusable React components
│   ├── componentX/           # Example components
│   │   ├── auth-dialog.tsx   # Authentication dialog component
│   │   ├── dialog.tsx        # Reusable dialog component
│   │   ├── moving-background.tsx # Moving background component
│   │   ├── conic-gradient-background.tsx # Conic gradient background component
│   │   ├── masked-grid-background.tsx # Masked grid background component
│   │   ├── moving-glow.tsx   # Moving glow effect component
│   │   ├── radial-fade-pulsating-background.tsx # Pulsating background component
│   ├── home/                 # Home page components
│   │   ├── footer.tsx        # Footer component
│   │   ├── navbar.tsx        # Navbar component
│   ├── markdown/             # Markdown rendering components
│   │   ├── copy.tsx          # Copy to clipboard component
│   │   ├── pre.tsx           # Code block component
│   ├── providers/            # Context providers
│   │   ├── provider.tsx      # Main provider component
│   │   ├── toast.tsx         # Toast provider component
│   ├── ui/                   # Shadcn UI components
│   │   ├── alert-dialog.tsx  # Alert dialog component
│   │   ├── avatar.tsx        # Avatar component
│   │   ├── avatar-menu.tsx   # Avatar menu component
│   │   ├── background-shine.tsx # Background shine component
│   │   ├── border-beam.tsx   # Border beam component
│   │   ├── border-hover-link.tsx # Border hover link component
│   │   ├── button.tsx        # Button component
│   │   ├── card.tsx          # Card component
│   │   ├── dialog.tsx        # Dialog component
│   │   ├── dropdown-menu.tsx # Dropdown menu component
│   │   ├── gradient-button.tsx # Gradient button component
│   │   ├── input.tsx         # Input component
│   │   ├── rotating-border-badge.tsx # Rotating border badge component
│   │   ├── separator.tsx     # Separator component
│   │   ├── sheet.tsx         # Sheet component
│   │   ├── sidebar.tsx       # Sidebar component
│   │   ├── sign-in.tsx       # Sign in component
│   │   ├── skeleton.tsx      # Skeleton component
│   │   ├── sonner.tsx        # Sonner toast component
│   │   ├── textarea.tsx      # Textarea component
│   │   ├── tooltip.tsx       # Tooltip component
│   │   ├── typography.tsx    # Typography component
├── config/                 # Configuration files
│   ├── site.ts             # Site configuration
├── hooks/                  # Custom React hooks
│   ├── use-message.tsx     # Hook for managing messages
│   ├── use-mobile.tsx      # Hook for detecting mobile devices
├── lib/                    # Utility functions and AI integration
│   ├── auth-options.ts     # NextAuth.js configuration
│   ├── gemini.ts           # Google Gemini AI integration
│   ├── markdown.tsx        # Markdown rendering configuration
│   ├── prisma.ts           # Prisma client initialization
│   ├── prompt.ts           # System prompt for the AI
│   ├── types.ts            # Shared types
│   ├── utils.ts            # Utility functions
│   ├── variants.ts         # Framer Motion animation variants
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma       # Prisma schema definition
│   ├── migrations/         # Prisma migration files
├── public/                 # Static assets
├── styles/                 # Global CSS styles
├── .eslintrc.json          # ESLint configuration
├── components.json         # Shadcn UI configuration
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Dependency lock file
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

**Key Files to Know:**

- `app/(protected)/chat/chat.tsx`: The main chat component.
- `app/api/chat/[id]/ask/route.ts`: The API route that handles user queries to the AI.
- `lib/gemini.ts`: The Google Gemini AI integration.
- `prisma/schema.prisma`: The Prisma schema that defines the database structure.
- `components/ui/*`: The Shadcn UI components used throughout the application.

We hope this README provides a clear understanding of ChatSDKX and how to contribute to its development. Happy coding!
