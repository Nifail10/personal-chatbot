import { useState, useRef, useEffect, useCallback } from 'react'
import { SplineSceneBasic } from "./components/ui/demo"
import './App.css'

/* ============================================
   INTENT-BASED RESPONSE SYSTEM
   Each intent has:
     - phrases: natural-language triggers (matched via includes)
     - response: the exact JSX/string returned to the user
   ============================================ */
const INTENTS = [
  {
    id: 'about',
    phrases: [
      'tell me about you', 'tell me about yourself', 'tell me about nifail',
      'who are you', 'who is nifail', 'about you', 'about nifail',
      'introduce yourself', 'introduce you', 'who r u', 'about yourself'
    ],
    response: (
      <>
        I'm currently a 3rd-year Artificial Intelligence & Data Science student at Hindustan University, Chennai.<br /><br />
        Alongside that, I'm the CEO & Co-Founder of QueueFree, where I'm building India's real-time healthcare queue infrastructure.<br /><br />
        I design, build, and ship systems that focus on solving real-world problems rather than just theoretical projects.
      </>
    )
  },
  {
    id: 'skills',
    phrases: [
      'what are your skills', 'your skills', 'what can you do',
      'tech stack', 'what do you know', 'skills', 'strengths',
      'capabilities', 'technologies', 'good at'
    ],
    response: "Full-stack development. UI/UX design. System architecture. Healthcare technology. Product development. Technical leadership. I build end-to-end, from database to pixel."
  },
  {
    id: 'projects',
    phrases: [
      'what have you built', 'what did you build', 'your projects',
      'show your projects', 'projects', 'portfolio', 'your work',
      'what did you make', 'what have you made', 'what did you create',
      'built', 'developed', 'shipped'
    ],
    response: (
      <>
        I build real systems, not just demos.<br /><br />
        • AI Gesture Virtual keyboard — <a href="https://github.com/Nifail10/AI-Gesture-Virtual-Keyboard" target="_blank" rel="noopener noreferrer">https://github.com/Nifail10/AI-Gesture-Virtual-Keyboard</a><br />
        AI-based virtual keyboard using gestures<br /><br />
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
  {
    id: 'experience',
    phrases: [
      'do you have experience', 'your experience', 'work experience',
      'have you worked before', 'experience', 'background',
      'career', 'resume', 'journey'
    ],
    response: (
      <>
        I don't have formal industry experience yet, but I've been consistently building real-world systems and projects.<br /><br />
        I've developed multiple applications, including AI-based tools, and I'm currently building my startup, QueueFree.<br /><br />
        This has given me hands-on experience in solving real problems, designing systems, and shipping products from scratch.
      </>
    )
  },
  {
    id: 'working',
    phrases: [
      'what are you working on', 'current work', 'what are you building',
      'what are you doing now', 'working on', 'right now',
      'building now', 'current project', 'focus'
    ],
    response: "Scaling QueueFree. Conducting doctor surveys for validation. Preparing for pilot launch. Refining the healthcare queue infrastructure to handle real hospital traffic."
  },
  {
    id: 'credentials',
    phrases: [
      'courses', 'certifications', 'certification', 'what course',
      'what did you study', 'what have you studied', 'your education',
      'education', 'linkedin', 'profile', 'credentials', 'studied'
    ],
    response: (
      <>
        I've completed coursework and certifications in Artificial Intelligence and Data Science, with a focus on practical, real-world applications.<br /><br />
        You can view my certifications and professional profile here:<br />
        <a href="https://www.linkedin.com/in/nifail-s-75bbb2319" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/nifail-s-75bbb2319</a>
      </>
    )
  },
  {
    id: 'queuefree',
    phrases: [
      'queuefree', 'queue free', 'startup', 'company',
      'venture', 'business', 'your startup'
    ],
    response: "QueueFree is solving OPD queue chaos in Indian hospitals. Real-time queue visibility. Waiting time estimation. Reduced crowding. Better doctor workflow. We are incubated and in validation stage."
  },
  {
    id: 'mission',
    phrases: [
      'mission', 'vision', 'goal', 'why', 'purpose',
      'what problem', 'solving'
    ],
    response: "Indian hospitals have broken queue systems. Patients wait hours without knowing their position. QueueFree gives them real-time visibility and gives doctors a better workflow. That is the mission."
  },
  {
    id: 'stage',
    phrases: [
      'stage', 'funding', 'status', 'progress',
      'traction', 'incubat'
    ],
    response: "Incubated. Validation-first approach. Running doctor surveys. Pre-pilot stage. I believe in proving the system works before scaling it."
  },
  {
    id: 'approach',
    phrases: [
      'approach', 'philosophy', 'method', 'process',
      'how do you work', 'how do you think'
    ],
    response: "Validation before vanity. Build, test, iterate. I do not ship features that have not been validated. Every decision is data-informed and execution-focused."
  },
  {
    id: 'role',
    phrases: [
      'role', 'ceo', 'founder', 'co-founder', 'position',
      'title', 'what do you do', 'what is your role'
    ],
    response: "CEO & Co-Founder. But the title is secondary. I am the one writing the code, designing the interfaces, talking to doctors, and making sure the product actually works."
  },
  {
    id: 'contact',
    phrases: [
      'contact', 'reach', 'connect', 'email',
      'social', 'twitter'
    ],
    response: "Not public yet. If you are a potential collaborator or investor, the right channels will find you."
  },
  {
    id: 'team',
    phrases: [
      'team', 'cofounder', 'partner', 'people',
      'hiring', 'cofound'
    ],
    response: "Small and focused. We move fast because we stay lean. Every team member earns their seat through output, not titles."
  },
  {
    id: 'tech',
    phrases: [
      'technology', 'architecture', 'infrastructure',
      'system design', 'technical'
    ],
    response: "Real-time systems built for hospital-scale traffic. Queue state management. Predictive wait-time algorithms. Clean API architecture. Built to handle thousands of concurrent patient sessions."
  },
  {
    id: 'design',
    phrases: [
      'design', 'ui', 'ux', 'interface',
      'user experience', 'aesthetic'
    ],
    response: "I design interfaces that hospital staff can use under pressure. Clean, focused, zero learning curve. Premium does not mean complex. It means considered."
  }
]

/* Build a lookup map for quick access by intent id (used by button clicks) */
const INTENT_MAP = Object.fromEntries(INTENTS.map(intent => [intent.id, intent]))

/* ============================================
   FOLLOW-UP RESPONSES (context-aware)
   Keyed by intent id → triggered when user asks
   a vague follow-up after that intent was last matched.
   ============================================ */
const FOLLOW_UPS = {
  projects: {
    phrases: [
      'which one is best', 'tell me more', 'how does it work', 'is it finished',
      'which is your favorite', 'best project', 'more about it', 'explain',
      'what does it do', 'how did you build', 'any more', 'more details'
    ],
    response: "Tourist Planner is the most polished — it is a live AI-based travel planning tool. QueueFree is my current focus and biggest project. The AI Meeting Assistant is in active development. Each one solves a different real problem."
  },
  skills: {
    phrases: [
      'which is strongest', 'what do you use most', 'strongest skill',
      'preferred stack', 'what do you enjoy', 'best at', 'favorite',
      'tell me more', 'more about it', 'explain', 'more details'
    ],
    response: "System architecture and full-stack development are my strongest areas. I primarily work with React, Next.js, Node.js, and Python. I enjoy building end-to-end products where I control every layer from the database to the interface."
  },
  about: {
    phrases: [
      'tell me more', 'more about you', 'anything else', 'what else',
      'more details', 'explain', 'elaborate'
    ],
    response: "Beyond academics and QueueFree, I spend time building side projects, experimenting with AI tools, and refining my design thinking. I believe in learning by shipping — every project I build teaches me something new."
  },
  experience: {
    phrases: [
      'tell me more', 'what kind', 'like what', 'examples',
      'more about it', 'explain', 'more details', 'elaborate'
    ],
    response: "My experience comes from building real products — AI tools, full-stack web apps, and now a healthcare startup. I have designed UIs under real constraints, written backend APIs, and handled user-facing deployments. It is all hands-on, not theoretical."
  },
  working: {
    phrases: [
      'tell me more', 'how is it going', 'when will it launch',
      'more about it', 'explain', 'more details', 'progress'
    ],
    response: "QueueFree is in validation stage. I am running doctor surveys, refining the queue algorithms, and preparing for a pilot deployment. The goal is to prove the system works in a real hospital before scaling."
  },
  queuefree: {
    phrases: [
      'how does it work', 'what problem does it solve', 'tell me more',
      'more about it', 'explain', 'more details', 'how', 'why'
    ],
    response: "QueueFree gives patients real-time visibility into their OPD queue position and estimated wait time. For doctors, it streamlines patient flow. The system uses real-time state management and predictive algorithms to reduce chaos in hospital waiting areas."
  },
  credentials: {
    phrases: [
      'tell me more', 'which courses', 'what certifications',
      'more about it', 'explain', 'more details'
    ],
    response: "I have completed coursework in AI, data science, and machine learning. My certifications focus on practical applications rather than just theory. You can see the full list on my LinkedIn profile."
  }
}

/* ============================================
   FOLLOW-UP DETECTION
   Short/vague inputs that likely refer to the last topic.
   ============================================ */
const GENERIC_FOLLOWUP_PHRASES = [
  'tell me more', 'more', 'explain', 'elaborate', 'go on',
  'more about it', 'more details', 'what else', 'anything else',
  'like what', 'how', 'why', 'really', 'interesting',
  'which one', 'which is best', 'best one', 'favorite'
]

function isFollowUp(input) {
  const lower = input.toLowerCase().trim()
  // Short inputs (3 words or fewer) are likely follow-ups
  if (lower.split(/\s+/).length <= 3) return true
  // Check against known generic follow-up phrases
  return GENERIC_FOLLOWUP_PHRASES.some(phrase => lower.includes(phrase))
}

/* ============================================
   INTENT MATCHER (context-aware)
   - Longer phrase matches score higher (more specific)
   - Falls back to follow-up responses if lastIntent is set
   - Returns { response, intentId } so caller can track context
   ============================================ */
function getResponse(input, lastIntent = null) {
  const lowerInput = input.toLowerCase().trim()

  // Direct greeting
  if (/^(hi|hello|hey|sup|yo|greetings)[\s!?.]*$/i.test(lowerInput)) {
    return { response: "Ask me anything about what I build, my skills, or QueueFree.", intentId: null }
  }

  // Thanks
  if (/^(thanks|thank you|thx|ty)[\s!?.]*$/i.test(lowerInput)) {
    return { response: "Anytime. Ask more if you need to.", intentId: null }
  }

  // Score each intent — longer phrase matches score higher
  let bestIntent = null
  let bestScore = 0

  for (const intent of INTENTS) {
    let score = 0
    for (const phrase of intent.phrases) {
      if (lowerInput.includes(phrase)) {
        score += phrase.split(' ').length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestIntent = intent
    }
  }

  // Direct intent match found
  if (bestIntent && bestScore > 0) {
    return { response: bestIntent.response, intentId: bestIntent.id }
  }

  // No direct match — try follow-up using lastIntent context
  if (lastIntent && isFollowUp(lowerInput)) {
    const followUp = FOLLOW_UPS[lastIntent]
    if (followUp) {
      // Check if input matches any context-specific follow-up phrase
      const matchesContext = followUp.phrases.some(p => lowerInput.includes(p))
      if (matchesContext) {
        return { response: followUp.response, intentId: lastIntent }
      }
      // Generic follow-up — still use context
      return { response: followUp.response, intentId: lastIntent }
    }
  }

  // Deterministic fallback
  return {
    response: "I'm here to answer about my work, skills, projects, and startup. Try asking something like 'What have you built?' or 'Tell me about you.",
    intentId: null
  }
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
  const [hasInteracted, setHasInteracted] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  /* Conversation memory — tracks last detected intent for follow-ups */
  const lastIntentRef = useRef(null)

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
  const handleSend = useCallback((text, exactResponse = null, intentOverride = null) => {
    const messageText = text || inputValue.trim()
    if (!messageText || isTyping) return

    // Hide greeting & mark interacted after first message
    if (showGreeting) {
      setShowGreeting(false)
    }
    if (!hasInteracted) {
      setHasInteracted(true)
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
      let responseText
      let detectedIntentId = intentOverride

      if (exactResponse !== null) {
        // Button click — use exact response, track intent
        responseText = exactResponse
      } else {
        // Typed input — run context-aware matcher
        const result = getResponse(messageText, lastIntentRef.current)
        responseText = result.response
        detectedIntentId = result.intentId
      }

      // Update conversation memory
      if (detectedIntentId) {
        lastIntentRef.current = detectedIntentId
      }

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, responseDelay)
  }, [inputValue, isTyping, showGreeting, hasInteracted])

  /* Key handler */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  /* Starter card click — always pass exact response to bypass scorer */
  const STARTER_INTENT_MAP = {
    "What have you built?": 'projects',
    "Do you have experience?": 'experience',
    "What are your skills?": 'skills',
    "What are you working on?": 'working',
  }

  const handleStarterClick = useCallback((text) => {
    const intentId = STARTER_INTENT_MAP[text]
    if (intentId && INTENT_MAP[intentId]) {
      handleSend(text, INTENT_MAP[intentId].response, intentId)
    } else {
      handleSend(text)
    }
  }, [handleSend])

  const handlePrimaryAction = useCallback(() => {
    handleSend("Tell me about Nifail", INTENT_MAP.about.response, 'about')
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
          {/* Greeting Section — shown before first interaction */}
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

              {/* Starter Cards — large grid layout */}
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
          {/* Compact suggestion chips — shown after first interaction */}
          {hasInteracted && (
            <div className="suggestion-chips">
              <button
                className="suggestion-chip"
                onClick={handlePrimaryAction}
                id="chip-primary"
                type="button"
              >
                Tell me about Nifail
              </button>
              {STARTERS.map((starter, idx) => (
                <button
                  key={idx}
                  className="suggestion-chip"
                  onClick={() => handleStarterClick(starter.text)}
                  id={`chip-${idx}`}
                  type="button"
                >
                  {starter.icon} {starter.text}
                </button>
              ))}
            </div>
          )}

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
