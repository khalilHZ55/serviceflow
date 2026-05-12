import type { Appointment, AppointmentStatus, DashboardStats, Service } from '../types/index';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Lee el token guardado en localStorage
function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // Si hay token lo añadimos al header Authorization
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  // Si el servidor devuelve 401, el token expiró o no existe
  // Limpiamos localStorage y recargamos para ir al login
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) return null as T;

  return response.json() as Promise<T>;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// ─── Servicios ─────────────────────────────────────────────────────────────
export const servicesApi = {
  getAll: () => request<Service[]>('/api/services'),
  create: (data: Omit<Service, 'id'>) =>
    request<Service>('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Omit<Service, 'id'>>) =>
    request<Service>(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<null>(`/api/services/${id}`, { method: 'DELETE' }),
};

// ─── Citas ─────────────────────────────────────────────────────────────────
export const appointmentsApi = {
  getAll: () => request<Appointment[]>('/api/appointments'),
  getStats: () => request<DashboardStats>('/api/appointments/stats'),
  create: (data: Omit<Appointment, 'id'>) =>
    request<Appointment>('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: AppointmentStatus) =>
    request<Appointment>(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};