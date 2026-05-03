import { Request, Response } from 'express';
import * as serviceService from '../services/serviceService';

export function getAll(req: Request, res: Response): void {
  const services = serviceService.getAllServices();
  res.json(services);
}

export function getById(req: Request<{ id: string }>, res: Response): void {
  const service = serviceService.getServiceById(req.params.id);
  
  if (!service) {
    res.status(404).json({ error: 'Servicio no encontrado' });
    return;
  }
  
  res.json(service);
}

export function create(req: Request, res: Response): void {
  const { name, duration, price, description } = req.body;
  
  // Validación básica: los campos obligatorios deben existir
  if (!name || !duration || !price) {
    res.status(400).json({ error: 'Faltan campos obligatorios: name, duration, price' });
    return;
  }
  
  const newService = serviceService.createService({ name, duration, price, description });
  res.status(201).json(newService); // 201 = Created
}

export function update(req: Request<{ id: string }>, res: Response): void {
  const updated = serviceService.updateService(req.params.id, req.body);
  
  if (!updated) {
    res.status(404).json({ error: 'Servicio no encontrado' });
    return;
  }
  
  res.json(updated);
}

export function remove(req: Request<{ id: string }>, res: Response): void {
  const deleted = serviceService.deleteService(req.params.id);
  
  if (!deleted) {
    res.status(404).json({ error: 'Servicio no encontrado' });
    return;
  }
  
  res.status(204).send(); // 204 = No Content (borrado exitoso)
}