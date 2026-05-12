import { Request, Response } from 'express';
import * as appointmentService from '../services/appointmentService';
import { AppointmentStatus } from '../types/index';

export function getAll(req: Request, res: Response): void {
  res.json(appointmentService.getAllAppointments());
}

export function getStats(req: Request, res: Response): void {
  res.json(appointmentService.getDashboardStats());
}

export function create(req: Request, res: Response): void {
  const { service, clientName, clientEmail, date, notes } = req.body;

  if (!service || !clientName || !date) {
    res.status(400).json({ error: 'Faltan campos obligatorios: service, clientName, date' });
    return;
  }

  const newAppointment = appointmentService.createAppointment({
    service,
    clientName,
    clientEmail,
    date,
    notes,
    status: 'pending', // toda cita nueva empieza como pendiente
  });

  res.status(201).json(newAppointment);
}

export function updateStatus(req: Request<{ id: string }>, res: Response): void {
  const { status } = req.body;
  
  // Validamos que el estado recibido sea uno de los permitidos
  const validStatuses: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}` });
    return;
  }

  const updated = appointmentService.updateAppointmentStatus(req.params.id, status);
  
  if (!updated) {
    res.status(404).json({ error: 'Cita no encontrada' });
    return;
  }

  res.json(updated);
}


export function checkAvailability(req: Request, res: Response): void {
  const { date, duration } = req.query;

  if (!date || !duration) {
    res.status(400).json({ error: 'Faltan parámetros: date y duration' });
    return;
  }

  const available = appointmentService.isSlotAvailable(
    date as string,
    Number(duration)
  );

  res.json({ available });
}