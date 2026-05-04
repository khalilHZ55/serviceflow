# ServiceFlow — Decisiones de Diseño Técnico

## Arquitectura general

El proyecto sigue una arquitectura cliente-servidor clásica con separación
total entre frontend y backend. Esta separación permite que en el futuro
cualquiera de las dos partes pueda evolucionar de forma independiente.

## Backend: Arquitectura por capas

El backend está organizado en cuatro capas con responsabilidades bien definidas:

**Routes** — Definen qué URLs acepta la API y las conectan con su controlador.
No contienen ninguna lógica.

**Controllers** — Reciben la petición HTTP, validan que los datos de entrada
sean correctos y devuelven la respuesta. Su única responsabilidad es la
comunicación HTTP.

**Services** — Contienen toda la lógica de negocio: calcular ingresos del mes,
filtrar citas por fecha, gestionar los estados. Esta separación es deliberada:
si mañana se reemplaza el almacenamiento JSON por una base de datos real,
solo hay que modificar los services, sin tocar controllers ni routes.

**Types** — Interfaces TypeScript que definen la forma exacta de los datos.
Al estar centralizados, cualquier cambio en un tipo se detecta inmediatamente
en todos los archivos que lo usan.

### ¿Por qué esta separación?

Cada capa tiene una única responsabilidad (principio SRP — Single Responsibility
Principle). Esto facilita el mantenimiento, las pruebas y la incorporación de
nuevos desarrolladores al proyecto.

## Frontend: Decisiones clave

### apiClient.ts con genéricos TypeScript

En lugar de hacer llamadas fetch dispersas por los componentes, todas las
llamadas a la API pasan por un único archivo tipado. El uso de genéricos
(`request<T>`) garantiza que TypeScript conoce el tipo exacto de cada respuesta,
detectando errores en tiempo de compilación en lugar de en tiempo de ejecución.

### useFetch personalizado

Se creó un hook genérico que encapsula los tres estados de cualquier llamada
asíncrona: loading, error y data. Esto evita duplicar ese código en cada
componente e incluye protección contra memory leaks mediante useRef para
detectar si el componente sigue montado cuando la petición termina.

### Context API para notificaciones

El sistema de toasts se implementó con Context API porque es un estado
verdaderamente global: cualquier componente del árbol puede necesitar mostrar
una notificación independientemente de su posición. Usar props para esto
hubiera requerido prop drilling a través de múltiples niveles.

### useMemo para el filtrado

El filtrado de citas utiliza useMemo para evitar recalcular la lista filtrada
en cada render. Solo se recalcula cuando cambian los datos o los filtros,
lo que mejora el rendimiento especialmente con listas largas.

## TypeScript: tipos compartidos

Los tipos se definen en ambos proyectos (backend y frontend) de forma
idéntica. En un proyecto de producción se gestionarían como un paquete
compartido, pero para un MVP esta solución es más sencilla y igualmente
efectiva. La ventaja principal es el tipado end-to-end: si el backend
cambia la forma de un objeto, TypeScript lo detecta en el frontend.