import type { AppointmentStatus } from '../types/index';

// Mapeamos cada estado a colores de Tailwind
const styles: Record<AppointmentStatus, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const labels: Record<AppointmentStatus, string> = {
  pending:   'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

interface Props {
  status: AppointmentStatus;
}

function StatusBadge({ status }: Props) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default StatusBadge;