// ¿Qué es un Servicio que ofrece el profesional?
export interface Service {
  id: string;
  name: string;           // ej: "Sesión de fisioterapia"
  duration: number;       // en minutos, ej: 60
  price: number;          // en euros, ej: 45
  description?: string;   // opcional (el ? lo indica)
}

// Los 4 estados posibles de una cita
// Usar un "union type" en vez de string libre evita errores de escritura
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// ¿Qué es una Cita?
export interface Appointment {
  id: string;
  service: Service;           // contiene el objeto Service completo, no solo su id
  clientName: string;
  clientEmail?: string;
  date: string;               // formato ISO: "2025-01-15T10:00:00"
  status: AppointmentStatus;
  notes?: string;             // notas opcionales del profesional
}

// ¿Qué datos resume el Dashboard?
export interface DashboardStats {
  todayAppointments: number;
  monthlyRevenue: number;
  pendingAppointments: number;
  completedThisMonth: number;
}