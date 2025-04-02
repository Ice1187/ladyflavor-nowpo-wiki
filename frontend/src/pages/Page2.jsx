function Page2() {
  return (
    <div className="bg-primary p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-secondary-dark mb-4">Podcast Timecode</h2>
      <p className="text-secondary-dark">
        This is the content of page 1. You can modify this text in the Page1.jsx file.
      </p>
      <div className="mt-4 p-4 bg-primary-light rounded-md border border-secondary-light">
        <h3 className="text-lg font-semibold text-secondary-dark mb-2">Features</h3>
        <ul className="list-disc list-inside text-secondary">
          <li>React with Vite for fast development</li>
          <li>Tailwind CSS for easy styling</li>
          <li>Custom wheat and brown theme</li>
          <li>Simple navigation between pages</li>
        </ul>
      </div>
    </div>
  )
}

export default Page2
