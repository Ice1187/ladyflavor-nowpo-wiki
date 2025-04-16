import { useState } from 'react'
import Navbar from './components/Navbar'
import TimecodePage from './pages/TimecodePage'
import RiddlePage from './pages/RiddlePage'
import PeeAwardPage from './pages/PeeAwardPage'
import TranscriptPage from './pages/TranscriptPage'
import BirthdayPage from './pages/BirthdayPage'
import DevNotePage from './pages/DevNotePage'

function App() {
  const [currentPage, setCurrentPage] = useState('TimecodePage')

  const renderPage = () => {
    switch (currentPage) {
      case 'TimecodePage':
        return <TimecodePage />
      case 'RiddlePage':
        return <RiddlePage />
      case 'PeeAwardPage':
        return <PeeAwardPage />
      case 'TranscriptPage':
        return <TranscriptPage />
      case 'BirthdayPage':
        return <BirthdayPage />
      case 'DevNotePage':
        return <DevNotePage />
      default:
        return <TimecodePage />
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow p-4 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
