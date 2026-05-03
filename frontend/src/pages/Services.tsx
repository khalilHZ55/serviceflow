import { useState } from 'react';
import { servicesApi } from '../api/apiclient';
import useFetch from '../hooks/useFetch';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Service } from '../types/index';
import { useToast } from '../context/ToastContext';

function Services() {
  const { showToast } = useToast();
  const { data: services, loading, error, refetch } = useFetch(servicesApi.getAll);

  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', duration: '', price: '', description: '' });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
  await servicesApi.create({
    name: form.name,
    duration: Number(form.duration),
    price: Number(form.price),
    description: form.description || undefined,
  });
  setForm({ name: '', duration: '', price: '', description: '' });
  setShowForm(false);
  refetch();
  showToast('Servicio creado correctamente');  // ← añadir
} catch (err) {
  showToast(                                   // ← reemplaza el alert
    err instanceof Error ? err.message : 'Error al guardar',
    'error'
  );
}
  }

  async function handleDelete(id: string) {
  if (!confirm('¿Eliminar este servicio?')) return;
  try {
    await servicesApi.remove(id);
    refetch();
    showToast('Servicio eliminado');           // ← añadir
  } catch (err) {
    showToast('Error al eliminar', 'error');   // ← añadir
  }
}

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Servicios</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona tu catálogo de servicios</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nuevo servicio'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4"
        >
          <h2 className="font-medium text-gray-700">Nuevo servicio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Nombre *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sesión de fisioterapia"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Duración (minutos) *</label>
              <input
                required
                type="number"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Precio (€) *</label>
              <input
                required
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Descripción</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción opcional"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar servicio'}
          </button>
        </form>
      )}

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services?.map((service: Service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-gray-800">{service.name}</h3>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
            {service.description && (
              <p className="text-sm text-gray-500">{service.description}</p>
            )}
            <div className="flex gap-4 text-sm">
              <span className="text-gray-600">
                ⏱ {service.duration} min
              </span>
              <span className="font-medium text-gray-800">
                {service.price}€
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;