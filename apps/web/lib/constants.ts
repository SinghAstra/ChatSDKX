import { Package, Plug, Sparkles } from "lucide-react";

export const processSteps = [
  {
    title: "Initialize the SDK",
    description:
      "Quickly drop our pre-built, accessible React components into your Next.js application without wrestling with complex UI state or layout shifts.",
    icon: Package,
  },
  {
    title: "Connect Your Backend",
    description:
      "Plug in any LLM—whether it's OpenAI, Anthropic, or a custom model—using our unified API handlers and seamless streaming hooks.",
    icon: Plug,
  },
  {
    title: "Launch Your AI",
    description:
      "Instantly deploy a flawless chat experience complete with real-time markdown rendering, prompt enhancements, and responsive sidebars.",
    icon: Sparkles,
  },
];

export const reviews = [
  {
    name: "Michael Chen",
    rating: 5,
    review:
      "A total lifesaver. I was dreading building another streaming chat UI from scratch with all the edge cases. ChatSDKX gave us a production-ready interface in a single afternoon.",
  },
  {
    name: "Emily Watson",
    rating: 5,
    review:
      "The intelligent prompt enhancement feature is incredible. Our users are getting significantly better AI outputs because the UI actively helps them write better instructions.",
  },
  {
    name: "David Kumar",
    rating: 5,
    review:
      "I use this for all my freelance AI projects now. Instead of spending days tweaking scroll-to-bottom logic and markdown parsers, I just drop in ChatSDKX and focus on the core backend logic.",
  },
  {
    name: "Sophia Rossi",
    rating: 4,
    review:
      "Fantastic tool for React developers. The component architecture is extremely clean, and hooking it up to our existing TanStack Query setup was entirely painless.",
  },
  {
    name: "James Thompson",
    rating: 5,
    review:
      "Absolutely game-changing for our startup. We needed a ChatGPT-like experience embedded in our SaaS dashboard. ChatSDKX delivered the exact UX we wanted with zero layout jank.",
  },
  {
    name: "Olivia Zhang",
    rating: 4,
    review:
      "Simple, effective, and fast. It completely takes the guesswork out of handling Server-Sent Events (SSE). Getting a reliable streaming response up and running is finally easy.",
  },
  {
    name: "William Smith",
    rating: 5,
    review:
      "ChatSDKX is now a permanent part of our boilerplate. If you are building generative AI wrappers or custom chatbots, this isn't just a luxury—it's a necessity for development speed.",
  },
  {
    name: "Mia Lindholm",
    rating: 5,
    review:
      "I've tried other UI libraries, but they are usually too opinionated or impossible to style. ChatSDKX strikes the perfect balance by utilizing Tailwind, letting us match our brand perfectly.",
  },
  {
    name: "Henry Fletcher",
    rating: 5,
    review:
      "This completely transformed how quickly we can prototype AI features. The mobile responsiveness is spot-on out of the box, and the sidebar management feels incredibly native.",
  },
];

export const FAQ = [
  {
    id: "item-1",
    question: "What exactly is ChatSDKX?",
    answer:
      "ChatSDKX is a powerful, developer-first React library that provides pre-built, highly optimized UI components and hooks for building real-time AI chat applications.",
  },
  {
    id: "item-2",
    question: "Do I need to use a specific LLM provider?",
    answer:
      "Not at all! ChatSDKX is completely model-agnostic. Whether you use OpenAI, Anthropic, Google Gemini, or a local Llama model, our streaming hooks can easily consume your API responses.",
  },
  {
    id: "item-3",
    question: "Does it support real-time streaming?",
    answer:
      "Yes. Real-time streaming via Server-Sent Events (SSE) is supported out of the box. We handle the chunk accumulation and state updates so you don't have to.",
  },
  {
    id: "item-4",
    question: "What frameworks do you support?",
    answer:
      "ChatSDKX is heavily optimized for Next.js (App Router) and React. It leverages modern ecosystem standards like Tailwind CSS, Lucide Icons, and Framer Motion.",
  },
  {
    id: "item-5",
    question: "How customizable is the UI?",
    answer:
      "Fully customizable. We expose flexible components that accept standard className props, allowing you to easily override styles using Tailwind CSS to match your exact brand guidelines.",
  },
  {
    id: "item-6",
    question: "Does ChatSDKX store my users' messages?",
    answer:
      "No. ChatSDKX is strictly a frontend UI and state-management layer. You maintain 100% ownership and control over where and how your chat data is stored in your own database.",
  },
  {
    id: "item-7",
    question: "Does it include markdown and code highlighting?",
    answer:
      "Yes. The message components include robust markdown parsing and syntax highlighting for code blocks, providing a premium reading experience for technical AI responses.",
  },
  {
    id: "item-8",
    question: "Is it mobile responsive?",
    answer:
      "Absolutely. The layout, including the collapsible chat history sidebar and the input forms, are fully optimized for mobile devices right out of the box.",
  },
];
