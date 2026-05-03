import { appointmentsApi } from '../api/apiclient';
import useFetch from '../hooks/useFetch';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Appointment } from '../types/index';

function Dashboard() {
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useFetch(appointmentsApi.getStats);

  const {
    data: appointments,
    loading: aptsLoading,
  } = useFetch(appointmentsApi.getAll);

  // Citas de hoy filtradas en el frontend
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments?.filter(a =>
    a.date.startsWith(today)
  ) ?? [];

  if (statsLoading) return <LoadingSpinner />;
  if (statsError) return <ErrorMessage message={statsError} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de tu actividad</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Citas hoy"
          value={stats?.todayAppointments ?? 0}
        />
        <StatCard
          label="Ingresos del mes"
          value={stats?.monthlyRevenue ?? 0}
          suffix="€"
        />
        <StatCard
          label="Pendientes"
          value={stats?.pendingAppointments ?? 0}
        />
        <StatCard
          label="Completadas este mes"
          value={stats?.completedThisMonth ?? 0}
        />
      </div>

      {/* Citas de hoy */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Citas de hoy
        </h2>

        {aptsLoading ? (
          <LoadingSpinner />
        ) : todayAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay citas para hoy.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Servicio</th>
                  <th className="px-6 py-3 text-left">Hora</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todayAppointments.map((apt: Appointment) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {apt.clientName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {apt.service.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(apt.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;