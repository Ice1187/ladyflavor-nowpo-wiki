function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-secondary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-primary-light text-2xl font-bold">My Website</h1>
        
        <div className="space-x-4">
          <button
            className={`px-3 py-2 rounded ${
              currentPage === 'page1'
                ? 'bg-primary text-secondary-dark font-bold'
                : 'text-primary-light hover:bg-secondary-dark hover:text-primary-light'
            }`}
            onClick={() => setCurrentPage('page1')}
          >
            Page 1
          </button>
          
          <button
            className={`px-3 py-2 rounded ${
              currentPage === 'page2'
                ? 'bg-primary text-secondary-dark font-bold'
                : 'text-primary-light hover:bg-secondary-dark hover:text-primary-light'
            }`}
            onClick={() => setCurrentPage('page2')}
          >
            Page 2
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
