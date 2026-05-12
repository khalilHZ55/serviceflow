import { Appointment, AppointmentStatus, DashboardStats } from '../types/index';

// Importamos los datos JSON directamente
import appointmentsData from '../data/appointments.json';
import servicesData from '../data/services.json';

// Casteamos los datos JSON a nuestros tipos TypeScript
// "as Appointment[]" le dice a TS: "confía en mí, esto tiene esa forma"
let appointments = appointmentsData as Appointment[];

// ─── Obtener todas las citas ───────────────────────────────────────────────
export function getAllAppointments(): Appointment[] {
  return appointments;
}

// ─── Obtener citas de hoy ──────────────────────────────────────────────────
export function getTodayAppointments(): Appointment[] {
  const today = new Date().toISOString().split('T')[0]; // "2025-01-15"
  return appointments.filter(a => a.date.startsWith(today));
}

// ─── Cambiar el estado de una cita ────────────────────────────────────────
// Esta es lógica de negocio pura: valida que el ID exista y cambia el estado
export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Appointment | null {
  const index = appointments.findIndex(a => a.id === id);
  
  if (index === -1) return null; // no encontrada
  
  appointments[index] = { ...appointments[index], status };
  return appointments[index];
}

// Comprueba si un nuevo horario se solapa con alguna cita existente
// Solo comprueba citas que no estén canceladas
export function isSlotAvailable(date: string, durationMinutes: number): boolean {
  const newStart = new Date(date).getTime();
  const newEnd   = newStart + durationMinutes * 60 * 1000;

  return !appointments.some(apt => {
    // Las citas canceladas no bloquean hueco
    if (apt.status === 'cancelled') return false;

    const existingStart = new Date(apt.date).getTime();
    const existingEnd   = existingStart + apt.service.duration * 60 * 1000;

    // Solapamiento: la nueva empieza antes de que termine la existente
    // Y la nueva termina después de que empiece la existente
    return newStart < existingEnd && newEnd > existingStart;
  });
}
// ─── Crear una nueva cita ──────────────────────────────────────────────────
export function createAppointment(
  data: Omit<Appointment, 'id'>
): Appointment {
  // Comprobamos disponibilidad antes de crear
  const available = isSlotAvailable(data.date, data.service.duration);

  if (!available) {
    // Lanzamos un error con un mensaje claro
    throw new Error('Ese horario ya está ocupado por otra cita');
  }

  const newAppointment: Appointment = {
    ...data,
    id: `a${Date.now()}`,
  };
  appointments.push(newAppointment);
  return newAppointment;
}

// ─── Estadísticas para el Dashboard ───────────────────────────────────────
// Aquí está la lógica de negocio más compleja: cálculos sobre los datos
export function getDashboardStats(): DashboardStats {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Citas completadas este mes
  const completedThisMonth = appointments.filter(a => {
    const appointmentDate = new Date(a.date);
    return (
      a.status === 'completed' &&
      appointmentDate.getMonth() === currentMonth &&
      appointmentDate.getFullYear() === currentYear
    );
  });

  // Ingresos del mes = suma de precios de citas completadas
  const monthlyRevenue = completedThisMonth.reduce(
    (total, a) => total + a.service.price,
    0  // valor inicial del acumulador
  );

  return {
    todayAppointments: getTodayAppointments().length,
    monthlyRevenue,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    completedThisMonth: completedThisMonth.length,
  };
}