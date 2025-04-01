import { useState } from 'react'
import Navbar from './components/Navbar'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'

function App() {
  const [currentPage, setCurrentPage] = useState('page1')

  const renderPage = () => {
    switch (currentPage) {
      case 'page1':
        return <Page1 />
      case 'page2':
        return <Page2 />
      default:
        return <Page1 />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow p-4">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
