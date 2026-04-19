import { useState, useRef, useEffect, useCallback } from 'react'
import { SplineSceneBasic } from "./components/ui/demo"
import './App.css'

/* ============================================
   KNOWLEDGE BASE: Nifail's Personal Context
   ============================================ */
const KNOWLEDGE = {
  about: {
    keywords: ['who', 'about', 'tell me about', 'nifail', 'yourself', 'introduce', 'you'],
    response: "I am CEO & Co-Founder of QueueFree, building India's real-time healthcare queue infrastructure. I design, build, and ship production systems that solve real problems."
  },
  skills: {
    keywords: ['skills', 'skill', 'tech stack', 'technologies', 'good at', 'strengths', 'capabilities', 'what can you do'],
    response: "Full-stack development. UI/UX design. System architecture. Healthcare technology. Product development. Technical leadership. I build end-to-end, from database to pixel."
  },
  built: {
    keywords: ['built', 'build', 'projects', 'portfolio', 'work', 'created', 'made', 'developed', 'shipped'],
    response: (
      <>
        I build real systems, not just demos.<br /><br />
        • Tourist Planner — <a href="https://tourist-planner-hits.vercel.app/" target="_blank" rel="noopener noreferrer">https://tourist-planner-hits.vercel.app/</a><br />
        AI-based travel planning demo<br /><br />
        • AI Meeting Assistant (in progress) — <a href="https://github.com/Nifail10/AI-meeting-assistant" target="_blank" rel="noopener noreferrer">https://github.com/Nifail10/AI-meeting-assistant</a><br /><br />
        • Internship Website — <a href="https://github.com/Nifail10/internship_web" target="_blank" rel="noopener noreferrer">https://github.com/Nifail10/internship_web</a><br /><br />
        • Gym Music Player — <a href="https://github.com/Nifail10/Gym_Music_Player" target="_blank" rel="noopener noreferrer">https://github.com/Nifail10/Gym_Music_Player</a><br /><br />
        • Gym Website — <a href="https://github.com/Nifail10/Gym_Website" target="_blank" rel="noopener noreferrer">https://github.com/Nifail10/Gym_Website</a><br /><br />
        Now building QueueFree — solving real-world hospital queue problems.
      </>
    )
  },
  working: {
    keywords: ['working on', 'current', 'right now', 'doing', 'focus', 'building now', 'next'],
    response: "Scaling QueueFree. Conducting doctor surveys for validation. Preparing for pilot launch. Refining the healthcare queue infrastructure to handle real hospital traffic."
  },
  experience: {
    keywords: ['experience', 'background', 'journey', 'career', 'history', 'resume'],
    response: "Building production systems. Leading technical development. Designing user experiences for complex healthcare workflows. I focus on execution, not credentials."
  },
  queuefree: {
    keywords: ['queuefree', 'queue free', 'startup', 'company', 'venture', 'business'],
    response: "QueueFree is solving OPD queue chaos in Indian hospitals. Real-time queue visibility. Waiting time estimation. Reduced crowding. Better doctor workflow. We are incubated and in validation stage."
  },
  mission: {
    keywords: ['mission', 'vision', 'goal', 'why', 'purpose', 'problem', 'solving'],
    response: "Indian hospitals have broken queue systems. Patients wait hours without knowing their position. QueueFree gives them real-time visibility and gives doctors a better workflow. That is the mission."
  },
  stage: {
    keywords: ['stage', 'funding', 'status', 'progress', 'traction', 'incubat'],
    response: "Incubated. Validation-first approach. Running doctor surveys. Pre-pilot stage. I believe in proving the system works before scaling it."
  },
  approach: {
    keywords: ['approach', 'philosophy', 'how', 'method', 'process', 'think'],
    response: "Validation before vanity. Build, test, iterate. I do not ship features that have not been validated. Every decision is data-informed and execution-focused."
  },
  role: {
    keywords: ['role', 'ceo', 'founder', 'co-founder', 'position', 'title', 'what do you do'],
    response: "CEO & Co-Founder. But the title is secondary. I am the one writing the code, designing the interfaces, talking to doctors, and making sure the product actually works."
  },
  contact: {
    keywords: ['contact', 'reach', 'connect', 'email', 'social', 'linkedin', 'twitter'],
    response: "Not public yet. If you are a potential collaborator or investor, the right channels will find you."
  },
  team: {
    keywords: ['team', 'cofound', 'partner', 'people', 'hiring'],
    response: "Small and focused. We move fast because we stay lean. Every team member earns their seat through output, not titles."
  },
  tech: {
    keywords: ['technology', 'architecture', 'stack', 'infrastructure', 'system design', 'technical'],
    response: "Real-time systems built for hospital-scale traffic. Queue state management. Predictive wait-time algorithms. Clean API architecture. Built to handle thousands of concurrent patient sessions."
  },
  design: {
    keywords: ['design', 'ui', 'ux', 'interface', 'user experience', 'aesthetic'],
    response: "I design interfaces that hospital staff can use under pressure. Clean, focused, zero learning curve. Premium does not mean complex. It means considered."
  }
}

/* Find best matching response */
function getResponse(input) {
  const lowerInput = input.toLowerCase().trim()

  // Direct greeting
  if (/^(hi|hello|hey|sup|yo|greetings)[\s!?.]*$/i.test(lowerInput)) {
    return "Ask me anything about what I build, my skills, or QueueFree."
  }

  // Thanks
  if (/^(thanks|thank you|thx|ty)[\s!?.]*$/i.test(lowerInput)) {
    return "Anytime. Ask more if you need to."
  }

  // Score each category
  let bestMatch = null
  let bestScore = 0

  for (const [, data] of Object.entries(KNOWLEDGE)) {
    let score = 0
    for (const keyword of data.keywords) {
      if (lowerInput.includes(keyword)) {
        score += keyword.split(' ').length // Multi-word matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = data
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.response
  }

  // Fallback for unknown queries
  const fallbacks = [
    "I building systems that solve real problems. Ask me about my skills, what I have built, or QueueFree.",
    "That is outside what I can share right now. Try asking about my work, skills, or QueueFree.",
    "I focus on execution, not speculation. Ask me about what I am building or my technical approach."
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

/* ============================================
   STARTER QUESTIONS
   ============================================ */
const STARTERS = [
  { text: "What are your skills?", icon: "⚡" },
  { text: "What have you built?", icon: "🔧" },
  { text: "What are you working on?", icon: "🎯" },
  { text: "Do you have experience?", icon: "📋" },
]

/* ============================================
   SVG Icons
   ============================================ */
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

/* ============================================
   APP COMPONENT
   ============================================ */
function App() {
  const [isEntered, setIsEntered] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showGreeting, setShowGreeting] = useState(true)
  const [inputFocused, setInputFocused] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatContentRef = useRef(null)

  /* Auto-scroll to bottom */
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  /* Send message handler */
  const handleSend = useCallback((text, exactResponse = null) => {
    const messageText = text || inputValue.trim()
    if (!messageText || isTyping) return

    // Hide greeting after first message
    if (showGreeting) {
      setShowGreeting(false)
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response with typing delay
    const responseDelay = 600 + Math.random() * 800
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: exactResponse !== null ? exactResponse : getResponse(messageText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, responseDelay)
  }, [inputValue, isTyping, showGreeting])

  /* Key handler */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  /* Starter card click */
  const handleStarterClick = useCallback((text) => {
    if (text === "What have you built?") {
      handleSend(text, KNOWLEDGE.built.response)
    } else {
      handleSend(text)
    }
  }, [handleSend])

  const handlePrimaryAction = useCallback(() => {
    handleSend("Tell me about Nifail")
  }, [handleSend])

  if (!isEntered) {
    return <SplineSceneBasic onEnter={() => setIsEntered(true)} />
  }

  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="bg-gradient">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-orb">
            <div className="header-orb-inner">
              <div className="header-orb-dot" />
            </div>
          </div>
          <div className="header-info">
            <span className="header-name">Nifail AI</span>
            <span className="header-status">
              <span className="status-dot" />
              Online
            </span>
          </div>
        </header>

        {/* Chat Content */}
        <div className="chat-content" ref={chatContentRef}>
          {/* Greeting Section */}
          {showGreeting && (
            <div className="greeting-section">
              <h1 className="greeting-title">Ask my AI</h1>
              <p className="greeting-subtitle">Get to know me, my work, and what I'm building</p>

              {/* Primary Action Card */}
              <button
                className="primary-action"
                onClick={handlePrimaryAction}
                id="primary-action-btn"
                type="button"
              >
                <span className="primary-action-label">Tell me about Nifail</span>
              </button>

              {/* Starter Cards */}
              <div className="starter-cards">
                {STARTERS.map((starter, idx) => (
                  <button
                    key={idx}
                    className="starter-card"
                    onClick={() => handleStarterClick(starter.text)}
                    id={`starter-card-${idx}`}
                    type="button"
                  >
                    <span className="starter-card-icon">{starter.icon}</span>
                    <span className="starter-card-text">{starter.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.type}`}>
                <span className="message-label">
                  {msg.type === 'user' ? 'You' : 'Nifail AI'}
                </span>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator">
                <div className="ai-pulse" />
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          <div className="scroll-anchor" ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="input-container">
          <div className={`input-bar ${inputFocused ? 'focused' : ''}`}>
            <input
              ref={inputRef}
              className="input-field"
              type="text"
              placeholder="Ask anything about me..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              id="chat-input"
              autoComplete="off"
            />
            <button
              className="send-button"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              id="send-btn"
              type="button"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="chat-footer">
          Nifail AI · CEO & Co-Founder, QueueFree
        </div>
      </div>
    </div>
  )
}

export default App
