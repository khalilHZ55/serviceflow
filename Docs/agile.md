# ServiceFlow — Gestión Ágil del Proyecto

## Metodología

Se ha seguido una metodología ágil inspirada en Scrum, adaptada al contexto
de un proyecto individual. El desarrollo se organizó en fases que equivalen
a sprints de un día cada uno.

## Fases de desarrollo

**Fase 1 — Investigación y diseño**
Definición del problema, usuario objetivo y alcance del MVP.
Diseño de los tipos TypeScript como contrato entre frontend y backend.

**Fase 2 — Backend**
Implementación del servidor Express con arquitectura por capas.
Creación de endpoints REST para servicios y citas.
Datos de prueba en JSON como capa de persistencia temporal.

**Fase 3 — Frontend base**
Configuración de Vite + React + Tailwind.
Implementación del apiClient tipado y el hook useFetch.

**Fase 4 — Componentes y páginas**
Dashboard con estadísticas en tiempo real.
CRUD de servicios con formulario.
Gestión de citas con cambio de estado.

**Fase 5 — Contexto y calidad**
Sistema de notificaciones toast con Context API.
Filtrado y búsqueda de citas con useMemo.
Mejora del useFetch con protección contra memory leaks.

**Fase 6 — Documentación y despliegue**
Documentación técnica y de decisiones de diseño.
Despliegue en Vercel (frontend) y Railway (backend).

## Tareas técnicas destacadas

- Implementar middleware de validación en POST /api/appointments
- Crear hook genérico useFetch<T> con estados loading/error/data
- Diseñar componente StatusBadge con variantes por AppointmentStatus
- Implementar filtrado con useMemo para evitar renders innecesarios
- Configurar variables de entorno VITE_API_URL para despliegue

## Control de versiones

El proyecto usa Git con commits atómicos por funcionalidad.
Cada fase corresponde a un conjunto de commits relacionados.