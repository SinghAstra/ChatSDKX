# ChatSDKX

ChatSDKX is a modern real-time chat application built with Next.js, featuring user authentication, streaming AI responses, and Google Gemini integration. Inspired by Vercel’s AI SDK, it implements a minimal viable product (MVP) version of client-side messaging using a custom useMessages hook.

Key features:

🔒 User authentication
💬 Real-time messaging interface
⚙️ In-house message management with React state
🧠 Google Gemini AI integration for intelligent responses
🔁 Streaming AI responses for a smooth user experience
✍️ Prompt enhancement tools to refine user inputs

## 🧰 Technology Stack

| Technology        | Purpose/Role                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| Next.js           | React framework for server-side rendering and routing.                       |
| NextAuth.js       | Authentication handling and session management.                              |
| Prisma            | ORM for database access and schema management.                               |
| TypeScript        | Adds static typing to JavaScript.                                            |
| Tailwind CSS      | Utility-first CSS framework for styling.                                     |
| Radix UI          | Primitive UI components for building accessible and customizable interfaces. |
| Google Gemini API | AI model for generating text responses within the chat.                      |
| ESLint            | JavaScript linter for code quality and consistency.                          |
| Framer Motion     | Animation library for creating smooth UI transitions.                        |
| Shadcn UI         | UI component library for rapid UI development.                               |
| react-markdown    | Library for rendering markdown content.                                      |
| rehype-prism      | Syntax highlighting for markdown code blocks.                                |
| Sonner            | Library for displaying toast notifications.                                  |

## 📁 File Structure and Purpose

| File Path                                                               | Description                                                                                        |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `.eslintrc.json`                                                        | Configures ESLint for Next.js, TypeScript, and web vitals.                                         |
| `app/api/auth/[...nextauth]/route.ts`                                   | Handles authentication using NextAuth.js.                                                          |
| `prisma/migrations/20250505150421_default_value_to_title/migration.sql` | Migration script to set a default value for the "title" column in the "Chat" table.                |
| `app/chat/[id]/action.ts`                                               | Contains the `fetchChat` function for retrieving chat data and performing authorization checks.    |
| `tsconfig.json`                                                         | TypeScript compiler options.                                                                       |
| `app/api/chat/route.ts`                                                 | API route for fetching chat messages for authenticated users.                                      |
| `app/auth/sign-in/layout.tsx`                                           | Layout component for the sign-in page, redirecting authenticated users.                            |
| `app/auth/sign-in/page.tsx`                                             | Handles user sign-in using NextAuth.js.                                                            |
| `app/chat/sidebar-toggle.tsx`                                           | Component for toggling the chat sidebar's visibility.                                              |
| `components/ui/button.tsx`                                              | Reusable button component.                                                                         |
| `interfaces/next-auth.ts`                                               | Extends the NextAuth.js Session interface to include a user ID.                                    |
| `interfaces/site.ts`                                                    | Defines the type for site configuration.                                                           |
| `prisma/schema.prisma`                                                  | Prisma schema defining data models (User, Account, Chat, Session).                                 |
| `config/site.ts`                                                        | Site configuration settings.                                                                       |
| `hooks/use-message.tsx`                                                 | Hook for managing chat messages, including streaming updates.                                      |
| `hooks/use-mobile.tsx`                                                  | Hook for mobile device detection.                                                                  |
| `components/ui/textarea.tsx`                                            | Customizable textarea component.                                                                   |
| `tailwind.config.ts`                                                    | Tailwind CSS configuration.                                                                        |
| `app/(home)/hero.tsx`                                                   | Hero section component for the home page.                                                          |
| `app/chat/chat-history.tsx`                                             | Component for displaying chat history.                                                             |
| `components/ui/dropdown-menu.tsx`                                       | Custom dropdown menu component using Radix UI.                                                     |
| `app/chat/[id]/page.tsx`                                                | Next.js page for displaying a specific chat.                                                       |
| `README.md`                                                             | Project README.                                                                                    |
| `components.json`                                                       | Shadcn UI component configuration.                                                                 |
| `middleware.ts`                                                         | Middleware for redirecting authenticated users.                                                    |
| `package-lock.json`                                                     | Locked versions of project dependencies.                                                           |
| `package.json`                                                          | Project metadata and dependencies.                                                                 |
| `components/ui/tooltip.tsx`                                             | Reusable tooltip component using Radix UI.                                                         |
| `prisma/migrations/20250422171423_simplified_schema/migration.sql`      | Migration script simplifying the database schema.                                                  |
| `prisma/migrations/20250422175743_/migration.sql`                       | Migration script removing the 'attachments' column from the 'Message' table.                       |
| `components/ui/typography.tsx`                                          | Component for rendering styled text content.                                                       |
| `components/markdown/pre.tsx`                                           | Component for rendering markdown `<pre>` blocks with copy functionality.                           |
| `components/providers/provider.tsx`                                     | Context provider for session management and toast notifications.                                   |
| `components/providers/toast.tsx`                                        | Context provider for toast notifications using Sonner.                                             |
| `components/ui/avatar.tsx`                                              | User avatar component using Radix UI.                                                              |
| `components/ui/background-shine.tsx`                                    | Component for rendering a background shine effect.                                                 |
| `components/ui/border-beam.tsx`                                         | Component for creating an animated border beam effect.                                             |
| `components/ui/border-hover-link.tsx`                                   | Link component with a border hover effect.                                                         |
| `prisma/migrations/20250503044839_restructured_schema/migration.sql`    | Migration script altering the "Chat" and "Message" tables.                                         |
| `prisma/migrations/20250503061733_added_role/migration.sql`             | Migration script adding a "content" column and modifying the "role" column in the "Message" table. |
| `app/globals.css`                                                       | Global styles for the application.                                                                 |
| `app/layout.tsx`                                                        | Main layout component.                                                                             |
| `app/not-found.tsx`                                                     | 404 page component.                                                                                |
| `lib/auth-options.ts`                                                   | NextAuth.js authentication configuration.                                                          |
| `components/ui/rotating-border-badge.tsx`                               | Badge component with a rotating conic gradient border.                                             |
| `lib/gemini.ts`                                                         | Module for interacting with Google Gemini's API.                                                   |
| `lib/markdown.tsx`                                                      | Component for rendering Markdown content with syntax highlighting.                                 |
| `components/global/fade-in.tsx`                                         | Reusable fade-in animation component.                                                              |
| `components/global/fade-slide-in.tsx`                                   | Fade-slide-in animation component.                                                                 |
| `components/global/max-width-wrapper.tsx`                               | Component for wrapping content with a max-width container.                                         |
| `components/ui/separator.tsx`                                           | Separator component using Radix UI.                                                                |
| `components/ui/sheet.tsx`                                               | Sheet dialog component using Radix UI.                                                             |
| `components/ui/sidebar.tsx`                                             | Sidebar component.                                                                                 |
| `components/ui/sign-in.tsx`                                             | Simple sign-in UI component.                                                                       |
| `components/ui/skeleton.tsx`                                            | Skeleton loading component.                                                                        |
| `components/ui/sonner.tsx`                                              | Toaster notification component using Sonner.                                                       |
| `app/chat/sidebar.tsx`                                                  | Sidebar component for the chat application.                                                        |
| `lib/prisma.ts`                                                         | Prisma client connection.                                                                          |
| `app/(home)/layout.tsx`                                                 | Layout component for the home page.                                                                |
| `app/(home)/page.tsx`                                                   | Main content component for the home page.                                                          |
| `components/home/footer.tsx`                                            | Footer component for the home page.                                                                |
| `components/home/navbar.tsx`                                            | Navigation bar component for the home page.                                                        |
| `components/markdown/copy.tsx`                                          | Copy-to-clipboard button component for markdown content.                                           |
| `prisma/migrations/migration_lock.toml`                                 | Prisma Migrate lock file.                                                                          |
| `lib/prompt.ts`                                                         | System prompt for code tutor.                                                                      |
| `app/api/chat/[id]/ask/route.ts`                                        | Route handler for asking questions using Google GenAI.                                             |
| `app/chat/action.ts`                                                    | Contains the `fetchChats` function for retrieving chat data.                                       |
| `app/chat/chat.tsx`                                                     | Main chat interface component.                                                                     |
| `app/chat/layout.tsx`                                                   | Layout component for chat pages.                                                                   |
| `app/chat/page.tsx`                                                     | Entry point for the chat page.                                                                     |
| `app/chat/sidebar-history-item.tsx`                                     | Component for rendering a single item in the chat history sidebar.                                 |
| `prisma/migrations/20250410070806_init/migration.sql`                   | Initial database schema migration script.                                                          |
| `components/ui/alert-dialog.tsx`                                        | Custom alert dialog component using Radix UI.                                                      |
| `components/ui/avatar-menu.tsx`                                         | User avatar with dropdown menu component.                                                          |
| `components/ui/card.tsx`                                                | Reusable card component.                                                                           |
| `components/ui/dialog.tsx`                                              | Custom dialog component using Radix UI.                                                            |
| `lib/utils.ts`                                                          | Utility functions.                                                                                 |
| `app/chat/sidebar-user-nav.tsx`                                         | User navigation section in the chat sidebar.                                                       |
| `components/ui/gradient-button.tsx`                                     | Gradient button component.                                                                         |
| `components/ui/input.tsx`                                               | Styled input field component.                                                                      |
| `components/ui/lamp.tsx`                                                | Lamp-like visual style component.                                                                  |
