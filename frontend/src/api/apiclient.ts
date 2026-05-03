import type { Appointment, AppointmentStatus, DashboardStats, Service } from '../types/index';

// Leemos la URL base del archivo .env
// Si no existe, usamos localhost como fallback
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ─── Función base tipada ───────────────────────────────────────────────────
// El <T> es un "genérico": le decimos qué tipo de dato esperamos recibir.
// Así TypeScript sabe exactamente qué forma tiene la respuesta de cada llamada.
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    // Intentamos leer el mensaje de error que devuelve el backend
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error ?? `HTTP ${response.status}`);
  }

  // 204 No Content (respuesta del DELETE) no tiene body
  if (response.status === 204) return null as T;

  return response.json() as Promise<T>;
}

// ─── API de Servicios ──────────────────────────────────────────────────────
export const servicesApi = {
  getAll: () =>
    request<Service[]>('/api/services'),

  create: (data: Omit<Service, 'id'>) =>
    request<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Service, 'id'>>) =>
    request<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<null>(`/api/services/${id}`, {
      method: 'DELETE',
    }),
};

// ─── API de Citas ──────────────────────────────────────────────────────────
export const appointmentsApi = {
  getAll: () =>
    request<Appointment[]>('/api/appointments'),

  getStats: () =>
    request<DashboardStats>('/api/appointments/stats'),

  create: (data: Omit<Appointment, 'id'>) =>
    request<Appointment>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: AppointmentStatus) =>
    request<Appointment>(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};