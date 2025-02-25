export function Sidebar() {
    return (
      <div className="w-64 bg-white shadow-lg min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Ecme</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100">
                🛒 Ecommerce
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100">
                📊 Analytics
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100">
                📦 Products
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100">
                📃 Orders
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded-lg hover:bg-gray-100">
                ⚙️ Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
  