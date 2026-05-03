import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, Mail } from 'lucide-react'

const Github = (p: { size?: number }) => (
  <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
  </svg>
)
const Linkedin = (p: { size?: number }) => (
  <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0z"/>
  </svg>
)
const Instagram = (p: { size?: number }) => (
  <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
import { personal } from '../data'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio contact from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const instagram = (personal.socials as Record<string, string>).instagram
    || 'https://instagram.com/jaisgurnoor'

  return (
    <main className="contact-page">
      <Link to="/" className="contact-back">
        <ArrowLeft size={14} strokeWidth={2.4} />
        <span>Back</span>
      </Link>

      <div className="contact-wrap">
        <header className="contact-hd">
          <span className="contact-eyebrow">A message from Jais</span>
          <h1 className="contact-title">Let's<br/>connect.</h1>
          <p className="contact-sub">
            I'm open to internships, collaborations, and conversations
            about AI, design, and building things on the web.
          </p>
        </header>

        <section className="contact-grid">
          <div className="contact-socials">
            <span className="contact-label">Find me</span>
            <a href={personal.socials.github} target="_blank" rel="noopener noreferrer" className="contact-social">
              <Github size={16} />
              <span>GitHub</span>
              <span className="contact-handle">@jaisgurnoor</span>
            </a>
            <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="contact-social">
              <Linkedin size={16} />
              <span>LinkedIn</span>
              <span className="contact-handle">/in/jaisgurnoor</span>
            </a>
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="contact-social">
              <Instagram size={16} />
              <span>Instagram</span>
              <span className="contact-handle">@jaisgurnoor</span>
            </a>
            <a href={`mailto:${personal.email}`} className="contact-social">
              <Mail size={16} />
              <span>Email</span>
              <span className="contact-handle">{personal.email}</span>
            </a>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <span className="contact-label">Connect with me</span>

            <label className="contact-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="contact-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="contact-field">
              <span>Message</span>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                required
              />
            </label>

            <button type="submit" className="contact-submit">
              <Send size={14} strokeWidth={2.4} />
              <span>{sent ? 'Sent — thanks!' : 'Send message'}</span>
            </button>
            <p className="contact-fineprint">
              Opens your mail app. Direct: <a href={`mailto:${personal.email}`}>{personal.email}</a>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
