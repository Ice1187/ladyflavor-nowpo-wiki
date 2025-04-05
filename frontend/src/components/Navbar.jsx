function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-primary w-full p-3 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="container flex flex-row justify-start items-center space-x-4">
          <h1 className="text-secondary-dark text-2xl font-bold">好味腦波弱百科</h1>
          <button
            className={`px-3 py-2 rounded text-secondary-dark ${
              currentPage === 'TimecodePage'
                ? 'bg-primary font-bold'
                : 'hover:bg-secondary-dark hover:text-primary-light'
            }`}
            onClick={() => setCurrentPage('TimecodePage')}
          >
            ⏳ Podcast Timecode
          </button>
          <button
            className={`px-3 py-2 rounded text-secondary-dark ${
              currentPage === 'RiddlePage'
                ? 'bg-primary font-bold'
                : 'hover:bg-secondary-dark hover:text-primary-light'
            }`}
            onClick={() => setCurrentPage('RiddlePage')}
          >
            🤔 哼猜學堂
          </button>
          <button
            className={`px-3 py-2 rounded text-secondary-dark ${
              currentPage === 'PeeAwardPage'
                ? 'bg-primary font-bold'
                : 'hover:bg-secondary-dark hover:text-primary-light'
            }`}
            onClick={() => setCurrentPage('PeeAwardPage')}
          >
            💦 小解獎
          </button>
          <button
            className={`px-3 py-2 rounded text-secondary-dark ${
              currentPage === 'TranscriptPage'
                ? 'bg-primary font-bold'
                : 'hover:bg-secondary-dark hover:text-primary-light'
            }`}
            onClick={() => setCurrentPage('TranscriptPage')}
          >
            📝 逐字稿
          </button>
          <button
            className={`px-3 py-2 rounded text-secondary-dark ${
              currentPage === 'DevNotePage'
                ? 'bg-primary font-bold'
                : 'hover:bg-secondary-dark hover:text-primary-light'
            }`}
            onClick={() => setCurrentPage('DevNotePage')}
          >
            👾 開發筆記
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
