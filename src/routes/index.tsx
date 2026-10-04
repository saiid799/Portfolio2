import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Cursor, Preloader, ScrollProgress } from '../components/fx'
import { Hero } from '../components/Hero'
import { Journey } from '../components/Journey'
import { Nav } from '../components/Nav'
import { Projects } from '../components/Projects'
import { Skills } from '../components/Skills'
import { WhatsAppFab } from '../components/WhatsApp'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])
  return (
    <main className="grain">
      <Preloader onDone={done} />
      <Cursor />
      <ScrollProgress />
      <Nav show={ready} />
      <Hero start={ready} />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Contact />
      <WhatsAppFab show={ready} />
    </main>
  )
}
