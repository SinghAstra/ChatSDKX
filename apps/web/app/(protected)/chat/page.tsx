"use client";

import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const handleNewChatSubmit = async (prompt: string) => {
    // 1. Optimistic Update
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    // 2. Simulate ID generation
    const newChatId = `chat_${Math.random().toString(36).substring(2, 9)}`;

    // 3. Shallow Routing
    window.history.pushState(null, "", `/chat/${newChatId}`);

    // 4. Simulate the AI responding with rich Markdown
    const markdownSimulation = `
# Markdown Rendering Test

This is a simulated response to demonstrate the capabilities of your new **MarkdownRenderer**. 

## Code Formatting
Here is a practical example of a React component written in TypeScript. Notice how the syntax highlighting and the custom copy header work:

\`\`\`tsx
import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="p-4 border rounded-md">
      <p>Current count: {count}</p>
      <button 
        onClick={() => setCount(prev => prev + 1)}
        className="bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Typography & Inline Elements
You can easily mix standard text with inline code like \`Array.prototype.map()\`, or emphasize points with blockquotes:

> "Code is read much more often than it is written." - Guido van Rossum

### Data Presentation

Tables are fully supported and will overflow gracefully on smaller screens:

| Feature | Implementation | Status |
| :--- | :--- | :--- |
| **Rich Text** | \`react-markdown\` | ✅ Complete |
| **Syntax Highlighting** | \`rehype-highlight\` | ✅ Complete |
| **Streaming UI** | Simulated Delay | 🚧 Pending |

### Task List
1. Sent message optimistically.
2. Updated URL via shallow routing.
3. Rendered Markdown response.
4. Test the copy buttons!

Let me know if you want to proceed to the streaming UI next!
`;

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: markdownSimulation,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <div
          className={`flex flex-col w-full max-w-4xl mx-auto p-4 flex-1 ${
            messages.length === 0 ? "justify-center" : "justify-start"
          }`}
        >
          {messages.length === 0 ? (
            <ChatEmptyState />
          ) : (
            <ChatMessageList messages={messages} />
          )}
        </div>
      </div>

      <div className="w-full bg-background shrink-0">
        <div className="w-full max-w-4xl mx-auto p-4">
          <ChatInputForm onSubmit={handleNewChatSubmit} />
        </div>
      </div>
    </div>
  );
}
