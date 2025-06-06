# Chat Area Components

This directory contains modular components that make up the ChatArea functionality. The main ChatArea component has been broken down into smaller, focused components for better maintainability and scalability.

## Component Architecture

### Main Container
- **ChatArea.tsx** - Main container that orchestrates all modular components
- **useChatArea.ts** - Custom hook for managing chat logic and state

### Modular Components

#### 1. ChatHeader
**File:** `ChatHeader.tsx`  
**Purpose:** Displays conversation header with user info and action buttons

**Props:**
```typescript
interface ChatHeaderProps {
  conversationName?: string;
  conversationAvatar?: string;
  showContactInfo: boolean;
  onToggleContactInfo: () => void;
  onMoreOptions?: () => void;
  isGroup?: boolean;
  participantCount?: number;
}
```

**Features:**
- User avatar with fallback
- Conversation name and status
- Action buttons (more options, toggle contact info)
- Visual state for active contact info
- Support for group conversations

#### 2. MessageList
**File:** `MessageList.tsx`  
**Purpose:** Container for all messages with auto-scrolling and empty states

**Props:**
```typescript
interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  getUserById: (userId: string) => { id: string; name: string; avatar?: string } | undefined;
  autoScroll?: boolean;
}
```

**Features:**
- Auto-scroll to latest message
- Empty state handling
- Efficient message rendering
- Smart sender name display logic
- Scrollable message container

#### 3. MessageItem
**File:** `MessageItem.tsx`  
**Purpose:** Individual message component with proper styling and alignment

**Props:**
```typescript
interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  showSenderName?: boolean;
  senderName?: string;
  senderAvatar?: string;
}
```

**Features:**
- Message bubble styling based on sender
- Timestamp formatting
- Avatar display for sender/receiver
- Responsive text wrapping
- Conditional sender name display

#### 4. MessageInput
**File:** `MessageInput.tsx`  
**Purpose:** Input area for composing and sending messages

**Props:**
```typescript
interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onAttachFile?: () => void;
  onEmojiPicker?: () => void;
}
```

**Features:**
- Text input with send button
- Keyboard shortcuts (Enter to send)
- Attachment button
- Emoji picker button
- Input validation and trimming
- Disabled state support

#### 5. EmptyState
**File:** `EmptyState.tsx`  
**Purpose:** Component shown when no conversation is selected

**Props:**
```typescript
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}
```

**Features:**
- Customizable title and description
- Optional icon display
- Centered layout
- Responsive design

## State Management Hook

### useChatArea
**File:** `useChatArea.ts`  
**Purpose:** Custom hook that encapsulates all chat logic and state management

**Parameters:**
```typescript
interface UseChatAreaProps {
  conversationId?: number;
  currentUserId?: string;
}
```

**Returns:**
```typescript
{
  // Data
  conversation: ConversationWithMessages | undefined;
  messages: Message[];
  currentUserId: string;
  showContactInfo: boolean;
  
  // Actions
  sendMessage: (content: string) => void;
  getUserById: (userId: string) => User | undefined;
  toggleContactInfo: () => void;
  handleAttachFile: () => void;
  handleEmojiPicker: () => void;
  handleMoreOptions: () => void;
  
  // State setters
  setShowContactInfo: (show: boolean) => void;
}
```

**Features:**
- Centralized state management
- Message sending logic
- User data fetching
- Contact info sidebar control
- Extensible action handlers

## Data Flow

1. **ChatArea** - Main container component
   - Uses `useChatArea` hook for all logic
   - Renders modular child components
   - Passes props and callbacks down

2. **useChatArea Hook** - State management
   - Fetches conversation data via `useCS`
   - Manages local message state
   - Handles user interactions
   - Provides action handlers

3. **Child Components** - UI rendering
   - Receive props from parent
   - Handle user interactions via callbacks
   - Focus on specific UI concerns

## Usage Example

```tsx
import { ChatArea } from "./ChatArea";

// Basic usage
<ChatArea conversationId={123} />

// With custom user ID
<ChatArea conversationId={123} currentUserId="custom-user-id" />
```

## Component Usage Examples

### Standalone Components

```tsx
import { ChatHeader, MessageList, MessageInput } from "./chat-area";

// Custom chat header
<ChatHeader
  conversationName="John Doe"
  conversationAvatar="/avatar.jpg"
  showContactInfo={false}
  onToggleContactInfo={() => console.log("Toggle")}
/>

// Custom message list
<MessageList
  messages={messages}
  currentUserId="1"
  getUserById={getUserById}
  autoScroll={true}
/>

// Custom message input
<MessageInput
  onSendMessage={(content) => console.log("Send:", content)}
  placeholder="Type your message..."
  onAttachFile={() => console.log("Attach file")}
/>
```

## Styling

- Uses Tailwind CSS for styling
- Consistent design system with shadcn/ui components
- Responsive message bubbles
- Proper spacing and typography
- Loading and empty states
- Accessibility considerations

## Future Enhancements

1. **Message Types**
   - Support for images, files, voice messages
   - Rich text formatting
   - Message reactions and replies

2. **Real-time Features**
   - Typing indicators
   - Message status (sent, delivered, read)
   - Live message updates via WebSocket

3. **Advanced Input**
   - Emoji picker integration
   - File drag-and-drop
   - Voice recording
   - Mention autocomplete

4. **Message Features**
   - Message search
   - Message forwarding
   - Message deletion/editing
   - Message translation

5. **Performance**
   - Virtual scrolling for large conversations
   - Message pagination
   - Optimistic updates
   - Background sync

6. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - High contrast mode
   - Focus management

## Error Handling

The components include robust error handling:
- Graceful fallbacks for missing data
- Default avatars and placeholder text
- Validation for message sending
- Loading states during data fetching

## Testing Considerations

Each component is designed to be easily testable:
- Clear prop interfaces
- Separated logic in custom hooks
- Minimal external dependencies
- Predictable state updates
