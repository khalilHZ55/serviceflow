import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Dashboard from '../pages/Dashboard';
import Services from '../pages/Services';
import Appointments from '../pages/Appointments';
import { useAuth } from '../context/AuthContext';


type Page = 'dashboard' | 'services' | 'appointments';

function Layout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors">
      {/* Sidebar */}
      <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            ServiceFlow
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Panel profesional</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

            <button
  onClick={logout}
  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
>
  <span>→</span>
  Cerrar sesión
</button>


            
        {/* Botón modo oscuro en la parte inferior del sidebar */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span>{isDark ? '☀️' : '🌙'}</span>
            {isDark ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default Layout;