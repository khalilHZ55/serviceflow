import { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import Services from '../pages/Services';
import Appointments from '../pages/Appointments';

// Las páginas posibles de la app
type Page = 'dashboard' | 'services' | 'appointments';

function Layout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'dashboard',    label: 'Dashboard',  icon: '▤' },
    { id: 'services',     label: 'Servicios',  icon: '◈' },
    { id: 'appointments', label: 'Citas',      icon: '◷' },
  ];

  function renderPage() {
    switch (currentPage) {
      case 'dashboard':    return <Dashboard />;
      case 'services':     return <Services />;
      case 'appointments': return <Appointments />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-800">ServiceFlow</h1>
          <p className="text-xs text-gray-400 mt-0.5">Panel profesional</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default Layout;