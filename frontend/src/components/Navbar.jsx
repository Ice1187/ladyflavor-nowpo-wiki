function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-primary p-4 shadow-md">
      <div className="container mx-full flex flex-row justify-start items-center space-x-4">
        <h1 className="text-secondary-dark text-2xl font-bold">好味腦波弱百科</h1>
        <button
          className={`px-3 py-2 rounded text-secondary-dark ${
            currentPage === 'page1'
              ? 'bg-primary font-bold'
              : 'hover:bg-secondary-dark hover:text-primary-light'
          }`}
          onClick={() => setCurrentPage('page1')}
        >
          哼猜學堂
        </button>

        <button
          className={`px-3 py-2 rounded text-secondary-dark ${
            currentPage === 'page2'
              ? 'bg-primary font-bold'
              : 'hover:bg-secondary-dark hover:text-primary-light'
          }`}
          onClick={() => setCurrentPage('page2')}
        >
          Podcast Timecode
        </button>
      </div>
    </nav>
  )
}

export default Navbar
