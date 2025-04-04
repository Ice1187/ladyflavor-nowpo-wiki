import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { devNotes } from "../../../dev-notes/devnotes";

const DevNotePage = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  // Load notes from external file
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        let processedNotes = [...devNotes];

        // Sort notes by date (newest first)
        processedNotes = processedNotes.map(note => ({
          ...note,
          parsedDate: new Date(note.date)
        }));
        processedNotes.sort((a, b) => b.parsedDate - a.parsedDate);
        processedNotes = processedNotes.map(({ parsedDate, ...note }) => note);

        setNotes(processedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, []);
  
  // Filter notes based on search term and active tab
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && note.tags.includes(activeTab);
  });
  
  // Get unique tags for the filter tabs
  const uniqueTags = [...new Set(notes.flatMap(note => note.tags))];
  
  // Function to open the note modal
  const openNoteModal = (note) => {
    setSelectedNote(note);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };
  
  // Function to close the note modal
  const closeNoteModal = () => {
    setSelectedNote(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  const markdownComponents = {
    h1: ({...props}) => (
      <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
    ),
    h2: ({...props}) => (
      <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
    ),
    h3: ({...props}) => (
      <h3 className="text-lg font-bold mt-3 mb-1" {...props} />
    ),
    p: ({...props}) => (
      <p className="my-1" {...props} />
    ),
    a: ({...props}) => (
      <a
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    li: ({...props}) => (
      <li className="ml-5" {...props} />
    ),
    ol: ({...props}) => (
      <ol className="my-2 pl-2 list-decimal" {...props} />
    ),
    ul: ({...props}) => (
      <ul className="my-2 pl-2 list-disc" {...props} />
    ),
    code: ({node, ...props}) => {
      // Check if this code is inside a pre tag (block code)
      const isInPre = node.parentNode?.tagName === 'pre';

      if (!isInPre) {
        return (
          <code
            className="px-1 py-0.5 bg-gray-200 text-gray-800 rounded text-sm inline"
            {...props}
          />
        );
      }

      return <code {...props} />;
    },
    pre: ({...props}) => (
      <div className="my-4 rounded-md bg-gray-700 overflow-x-auto">
        <pre className="p-4 text-white text-sm" {...props} />
      </div>
    ),
    blockquote: ({...props}) => (
      <blockquote
        className="border-l-4 border-secondary pl-4 py-2 my-2 bg-primary-light text-gray-700"
        {...props}
      />
    )
  };
  
  return (
    <div className="min-h-screen bg-primary-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-dark mb-2">開發筆記</h1>
          <p className="text-secondary flex items-center">
            <span>資深好味粉角的 murmur... </span>
            <a
              href="https://github.com/Ice1187/ladyflavor-nowpo-wiki"
              className="inline-flex items-center ml-4"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" 
                alt="GitHub" 
                className="h-4 w-4"
              />
            </a>
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="搜尋筆記..."
              className="w-full p-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex overflow-x-auto pb-2 space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md whitespace-nowrap ${
                activeTab === 'all' 
                  ? 'bg-secondary-dark text-white' 
                  : 'bg-primary text-secondary-dark hover:bg-primary-dark'
              }`}
            >
              全部
            </button>
            {uniqueTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTab(tag)}
                className={`px-3 py-1 rounded-md whitespace-nowrap ${
                  activeTab === tag 
                    ? 'bg-secondary-dark text-white' 
                    : 'bg-primary text-secondary-dark hover:bg-primary-dark'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">載入中...</span>
            </div>
            <p className="mt-2 text-secondary">載入筆記中...</p>
          </div>
        ) : (
          /* Notes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <div 
                  key={note.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openNoteModal(note)}
                >
                  <h3 className="text-lg font-semibold text-secondary-dark mb-2">{note.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{note.summary}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map(tag => (
                        <span key={tag} className="bg-primary px-2 py-1 rounded-md text-xs text-secondary-dark">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{note.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                沒有找到符合的筆記
              </div>
            )}
          </div>
        )}
        
        {/* Note Modal */}
        {selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-primary-light">
                <h2 className="text-2xl font-bold text-secondary-dark">{selectedNote.title}</h2>
                <button 
                  onClick={closeNoteModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-4 text-gray-500 flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map(tag => (
                      <span key={tag} className="bg-primary px-2 py-1 rounded-md text-xs text-secondary-dark">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm">{selectedNote.date}</span>
                </div>
                
                <div className="prose max-w-none">
                  <ReactMarkdown components={markdownComponents}>
                    {selectedNote.content}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* Modal Footer */}
              {/* <div className="border-t border-gray-200 p-4 flex justify-end">
                <button
                  onClick={closeNoteModal}
                  className="px-4 py-2 bg-secondary-dark text-white rounded-md hover:bg-secondary"
                >
                  關閉
                </button>
              </div>
              */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevNotePage;
