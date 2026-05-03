import { useState, useMemo } from 'react';
import { appointmentsApi, servicesApi } from '../api/apiclient';
import useFetch from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Appointment, AppointmentStatus } from '../types/index';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = {
  serviceId: '',
  clientName: '',
  clientEmail: '',
  date: '',
  time: '',
  notes: '',
};

// Estado inicial de los filtros como constante
// igual que con el formulario, así es fácil resetearlos
const EMPTY_FILTERS = {
  search: '',       // busca en nombre y email
  status: '',       // filtra por estado
  date: '',         // filtra por día exacto
  serviceId: '',    // filtra por servicio
};

function Appointments() {
  const { showToast } = useToast();

  const { data: appointments, loading, error, refetch } = useFetch(appointmentsApi.getAll);
  const { data: services } = useFetch(servicesApi.getAll);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // ─── Lógica de filtrado ────────────────────────────────────────────────
  // useMemo recalcula la lista filtrada SOLO cuando cambian
  // appointments o filters, no en cada render
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments.filter(apt => {
      // Filtro de búsqueda: nombre o email contienen el texto buscado
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesName  = apt.clientName.toLowerCase().includes(search);
        const matchesEmail = apt.clientEmail?.toLowerCase().includes(search) ?? false;
        if (!matchesName && !matchesEmail) return false;
      }

      // Filtro por estado
      if (filters.status && apt.status !== filters.status) return false;

      // Filtro por día: comparamos solo la parte de la fecha (sin la hora)
      if (filters.date && !apt.date.startsWith(filters.date)) return false;

      // Filtro por servicio
      if (filters.serviceId && apt.service.id !== filters.serviceId) return false;

      return true;
    });
  }, [appointments, filters]);

  // Cuenta cuántos filtros están activos para mostrar el botón de limpiar
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  // Helper para actualizar un solo campo del filtro sin perder los demás
  function setFilter(key: keyof typeof EMPTY_FILTERS, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selectedService = services?.find(s => s.id === form.serviceId);
    if (!selectedService) {
      showToast('Selecciona un servicio válido', 'error');
      return;
    }
    const dateTime = `${form.date}T${form.time}:00`;
    setSaving(true);
    try {
      await appointmentsApi.create({
        service: selectedService,
        clientName: form.clientName,
        clientEmail: form.clientEmail || undefined,
        date: dateTime,
        notes: form.notes || undefined,
        status: 'pending',
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      refetch();
      showToast('Cita creada correctamente');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Error al crear la cita',
        'error'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    try {
      await appointmentsApi.updateStatus(id, status);
      refetch();
      showToast('Estado actualizado correctamente');
    } catch (err) {
      showToast('Error al actualizar el estado', 'error');
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">

      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Citas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona y actualiza el estado de tus citas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nueva cita'}
        </button>
      </div>

      {/* Formulario nueva cita */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4"
        >
          <h2 className="font-medium text-gray-700">Nueva cita</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 block mb-1">Servicio *</label>
              <select
                required
                value={form.serviceId}
                onChange={e => setForm({ ...form, serviceId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un servicio</option>
                {services?.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.duration} min · {s.price}€
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Nombre del cliente *</label>
              <input
                required
                value={form.clientName}
                onChange={e => setForm({ ...form, clientName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="María García"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Email del cliente</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={e => setForm({ ...form, clientEmail: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="maria@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Fecha *</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Hora *</label>
              <input
                required
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 block mb-1">Notas</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Observaciones opcionales..."
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : 'Crear cita'}
          </button>
        </form>
      )}

      {/* ─── Barra de filtros ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        
        {/* Fila 1: buscador */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fila 2: filtros en línea */}
        <div className="flex flex-wrap gap-3">

          {/* Filtro por fecha */}
          <input
            type="date"
            value={filters.date}
            onChange={e => setFilter('date', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Filtro por estado */}
          <select
            value={filters.status}
            onChange={e => setFilter('status', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>

          {/* Filtro por servicio */}
          <select
            value={filters.serviceId}
            onChange={e => setFilter('serviceId', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los servicios</option>
            {services?.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Botón limpiar — solo aparece si hay algún filtro activo */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Resultado del filtrado */}
        <p className="text-xs text-gray-400">
          {filteredAppointments.length} de {appointments?.length ?? 0} citas
        </p>
      </div>

      {/* ─── Tabla de citas ───────────────────────────────────────────── */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg mb-1">Sin resultados</p>
          <p className="text-sm">
            {activeFilterCount > 0
              ? 'Prueba a cambiar o limpiar los filtros'
              : 'No hay citas registradas'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Servicio</th>
                <th className="px-6 py-3 text-left">Fecha y hora</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Cambiar estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.map((apt: Appointment) => (
                <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{apt.clientName}</p>
                    {apt.clientEmail && (
                      <p className="text-gray-400 text-xs">{apt.clientEmail}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <p>{apt.service.name}</p>
                    <p className="text-gray-400 text-xs">
                      {apt.service.duration} min · {apt.service.price}€
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(apt.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                    <br />
                    <span className="text-gray-400 text-xs">
                      {new Date(apt.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={apt.status}
                      onChange={e =>
                        handleStatusChange(apt.id, e.target.value as AppointmentStatus)
                      }
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Appointments;