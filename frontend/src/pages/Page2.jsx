function Page2() {
  return (
    <div className="bg-primary p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-secondary-dark mb-4">Welcome to Page 2</h2>
      <p className="text-secondary-dark mb-4">
        This is the content of page 2. You can modify this text in the Page2.jsx file.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-primary-dark p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold text-secondary-dark">Card Title 1</h3>
          <p className="text-secondary">This is a sample card with some content.</p>
        </div>
        
        <div className="bg-primary-dark p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold text-secondary-dark">Card Title 2</h3>
          <p className="text-secondary">Another sample card with different content.</p>
        </div>
      </div>
    </div>
  )
}

export default Page2
