// MessagesList.tsx
import { useMessages } from 'utils/useMessages'
import { useEffect, useRef } from 'react'

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-72">  {/* Added large bottom padding */}
        {messages?.map((message, i) => {
          const isUser = message.role === 'user'
          if (message.role === 'system') return null
          return (
            <div
              id={`message-${i}`}
              className={`flex mb-4 fade-up ${isUser ? 'justify-end' : 'justify-start'} ${
                i === 1 ? 'max-w-md' : ''
              }`}
              key={message.content}
            >
              {!isUser && (
                <img
                  src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
                  className="w-9 h-9 rounded-full"
                  alt="avatar"
                />
              )}
              <div
                style={{ maxWidth: 'calc(100% - 45px)' }}
                className={`group relative px-3 py-2 rounded-lg ${
                  isUser
                    ? 'mr-2 bg-gradient-to-br from-primary-700 to-primary-600 text-white'
                    : 'ml-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                }`}
              >
                {message.content.trim()}
              </div>
              {isUser && (
                <img
                  src="https://www.teamsmart.ai/next-assets/profile-image.png"
                  className="w-9 h-9 rounded-full cursor-pointer"
                  alt="avatar"
                />
              )}
            </div>
          )
        })}
        {isLoadingAnswer && (
          <div className="flex justify-start mb-4">
            <img
              src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
              className="w-9 h-9 rounded-full"
              alt="avatar"
            />
            <div className="loader ml-2 p-2.5 px-4 bg-gray-200 dark:bg-gray-800 rounded-full space-x-1.5 flex justify-between items-center relative">
              <span className="block w-3 h-3 rounded-full"></span>
              <span className="block w-3 h-3 rounded-full"></span>
              <span className="block w-3 h-3 rounded-full"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessagesList