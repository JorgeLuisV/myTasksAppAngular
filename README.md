# 📋MyTasksApp Angular

MyTasksApp es una aplicación de gestión de tareas diarias desarrollada con Angular y Angular Material.

## Funcionalidades

- **Vistas:**

  - **Login:** Permite a los usuarios iniciar sesión con su correo electrónico. Si el usuario no está registrado, puede crear una cuenta ingresando su correo.
  - **Home:** Proporciona una interfaz para que los usuarios gestionen sus tareas. Aquí pueden ver, crear, editar, marcar como completadas o eliminar tareas. Además, existe la opción de filtrar las tareas por estado: pendiente, completado o todas.

- **Protección de rutas:** La aplicación cuenta con protección de rutas para garantizar que solo los usuarios autenticados puedan acceder a la vista principal (home).

- **Seguridad de sesión:** Se utilizan JSON Web Tokens (JWT) para gestionar la seguridad de la sesión. El token del usuario autenticado se almacena de forma segura en una cookie.

- **Validación de formularios:** Los formularios de inicio de sesión, registro, creación y edición de tareas están validados para evitar la introducción de valores vacíos o inválidos.

## Tecnologías utilizadas

- Angular
- Angular Material
- Font Awesome
- JSON Web Tokens (JWT)

## Requisitos previos

- Node.js
- Angular CLI

## Instalación

Clona este repositorio:

```bash
git clone https://github.com/JorgeLuisV/myTasksAppAngular.git
```

Navega al directorio del proyecto:

```bash
cd myTasksAppAngular
```

Instala las dependencias:

```bash
npm install
```

## Uso

Inicia la aplicación:

```bash
ng serve
```

Abre tu navegador y ve a `http://localhost:4200`

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).
