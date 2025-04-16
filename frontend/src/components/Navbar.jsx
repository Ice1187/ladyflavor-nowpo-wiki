import { useState } from 'react';

function Navbar({ currentPage, setCurrentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { id: 'TimecodePage', label: '⏳ Podcast Timecode' },
    { id: 'RiddlePage', label: '🤔 哼猜學堂' },
    { id: 'PeeAwardPage', label: '💦 小解獎' },
    { id: 'TranscriptPage', label: '📝 逐字稿' },
    { id: 'BirthdayPage', label: '🎂 生日表' },
    { id: 'DevNotePage', label: '👾 開發筆記' },
  ];

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-primary w-full p-3 shadow-md relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          {/* Logo/Title */}
          <h1 className="text-secondary-dark text-xl md:text-2xl font-bold">好味腦波弱百科</h1>
          
          {/* Hamburger button - only visible on mobile */}
          <button 
            className="md:hidden text-secondary-dark hover:text-primary-light p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              // X icon when menu is open
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Navigation Links - hidden on mobile unless menu is open */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0 md:space-x-4 space-y-2 md:space-y-0`}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`px-3 py-2 rounded text-secondary-dark transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-primary font-bold'
                    : 'hover:bg-secondary-dark hover:text-primary-light'
                }`}
                onClick={() => handlePageChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
