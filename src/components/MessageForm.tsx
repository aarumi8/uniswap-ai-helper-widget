import { Button, TextArea } from '@apideck/components'
import { Card } from '@apideck/components'
import { useState, useEffect } from 'react'
import { useMessages } from 'utils/useMessages'

interface MessageFormProps {}

const MessageForm: React.FC<MessageFormProps> = () => {
  const [content, setContent] = useState('')
  const { addMessage } = useMessages()
  const [isInIframe, setIsInIframe] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  console.log(onboardingStep);

  useEffect(() => {
    setIsInIframe(window !== window.parent)

    // Listen for messages from parent
    const handleParentMessage = (event: MessageEvent) => {
      if (event.data.type === 'ONBOARDING_STEP_COMPLETE') {
        // Move to next step or end onboarding
        setOnboardingStep(prev => prev + 1)
      }
    }

    window.addEventListener('message', handleParentMessage)
    return () => window.removeEventListener('message', handleParentMessage)
  }, [])

  const quickMessages = [
    "What is Uniswap?",
    "How do I get started?"
  ]

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    addMessage(content)
    setContent('')
  }

  const handleCardClick = (message: string) => {
    addMessage(message)
  }

  const startOnboarding = () => {
    if (isInIframe) {
      setOnboardingStep(0)
      window.parent.postMessage({
        type: 'START_ONBOARDING',
        payload: {
          closeModal: true,
          step: 0
        }
      }, '*') // Using '*' for development, replace with actual origin in production
    }
  }

  // // Function to notify parent when ready for next step
  // const progressOnboarding = () => {
  //   window.parent.postMessage({
  //     type: 'PROGRESS_ONBOARDING',
  //     payload: {
  //       step: onboardingStep
  //     }
  //   }, '*')
  // }

  return (
    <div className="flex-shrink-0 bg-gray-50 pt-4">
      <div className="relative mx-auto max-w-3xl px-4">
        {isInIframe && (
          <div className="mb-4">
            <Button
              onClick={startOnboarding}
              size="small"
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Start Platform Tour
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {quickMessages.map((message, index) => (
            <Card 
              key={index}
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => handleCardClick(message)}
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
            </Card>
          ))}
        </div>
        
        <form className="relative rounded-t-xl mb-4" onSubmit={handleSubmit}>
          <div className="border-gray-200 h-[130px] rounded-t-xl backdrop-blur border-t border-l border-r border-gray-500/10 dark:border-gray-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 p-5">
            <label htmlFor="content" className="sr-only">
              Your message
            </label>
            <TextArea
              name="content"
              placeholder="Enter your message here..."
              rows={3}
              value={content}
              autoFocus
              className="!p-3 text-gray-900 border-0 ring-1 dark:ring-0 ring-gray-300/40 focus:ring-gray-300/80 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800/80 backdrop-blur shadow-none"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            />
            <div className="absolute right-8 bottom-10">
              <div className="flex space-x-3">
                <Button className="" type="submit" size="small">
                  Send
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 ml-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MessageForm