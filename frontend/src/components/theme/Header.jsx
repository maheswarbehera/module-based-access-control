export function Header() {
    return (
      <header className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            🔍
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            🇺🇸
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            👤
          </div>
        </div>
      </header>
    );
  }
  