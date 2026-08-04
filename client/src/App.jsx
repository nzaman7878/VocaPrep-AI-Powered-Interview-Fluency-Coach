function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">VocaPrep</h1>
        <p className="text-lg text-text-primary mb-6">AI-Powered Interview & Fluency Coach</p>
        <button className="bg-secondary text-background font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
