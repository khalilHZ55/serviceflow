import { Service } from '../types/index';
import servicesData from '../data/services.json';

let services = servicesData as Service[];

export function getAllServices(): Service[] {
  return services;
}

export function getServiceById(id: string): Service | null {
  return services.find(s => s.id === id) ?? null;
}

export function createService(data: Omit<Service, 'id'>): Service {
  const newService: Service = {
    ...data,
    id: `s${Date.now()}`,
  };
  services.push(newService);
  return newService;
}

export function updateService(
  id: string,
  data: Partial<Omit<Service, 'id'>>  // "Partial" = todos los campos son opcionales
): Service | null {
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return null;

  services[index] = { ...services[index], ...data };
  return services[index];
}

export function deleteService(id: string): boolean {
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return false;

  services.splice(index, 1);
  return true;
}