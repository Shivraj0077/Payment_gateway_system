export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-xl font-semibold tracking-tight">Vortex</div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#capabilities" className="text-gray-600 hover:text-gray-900 transition-colors">Capabilities</a>
            <a href="#developers" className="text-gray-600 hover:text-gray-900 transition-colors">Developers</a>
            <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a>
            <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
            Sign In
          </button>
          <button className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
