# ServiceFlow — Documentación de la API

Base URL (desarrollo): `http://localhost:3000`

---

## Servicios

### GET /api/services
Devuelve todos los servicios disponibles.

**Respuesta 200:**
```json
[
  {
    "id": "s1",
    "name": "Sesión de fisioterapia",
    "duration": 60,
    "price": 50,
    "description": "Evaluación y tratamiento personalizado"
  }
]
```

### POST /api/services
Crea un nuevo servicio.

**Body:**
```json
{
  "name": "Masaje deportivo",
  "duration": 45,
  "price": 35,
  "description": "Opcional"
}
```
**Respuesta 201:** el objeto Service creado.
**Respuesta 400:** si faltan campos obligatorios.

### PUT /api/services/:id
Actualiza un servicio existente. Todos los campos son opcionales.

**Respuesta 200:** el objeto Service actualizado.
**Respuesta 404:** si el ID no existe.

### DELETE /api/services/:id
Elimina un servicio.

**Respuesta 204:** borrado exitoso, sin body.
**Respuesta 404:** si el ID no existe.

---

## Citas

### GET /api/appointments
Devuelve todas las citas.

### GET /api/appointments/stats
Devuelve las estadísticas para el dashboard.

**Respuesta 200:**
```json
{
  "todayAppointments": 2,
  "monthlyRevenue": 150,
  "pendingAppointments": 3,
  "completedThisMonth": 5
}
```

### POST /api/appointments
Crea una nueva cita. El estado inicial siempre es `pending`.

**Body:**
```json
{
  "service": { "id": "s1", "name": "...", "duration": 60, "price": 50 },
  "clientName": "María García",
  "clientEmail": "maria@email.com",
  "date": "2025-01-15T10:00:00",
  "notes": "Opcional"
}
```

### PATCH /api/appointments/:id/status
Cambia el estado de una cita.

**Body:**
```json
{ "status": "confirmed" }
```
**Valores válidos:** `pending`, `confirmed`, `completed`, `cancelled`.
**Respuesta 400:** si el estado no es válido.