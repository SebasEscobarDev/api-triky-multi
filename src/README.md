# Arquitectura y Metodología del Proyecto API Triky Multi

## Arquitectura Técnica

El proyecto utiliza una **Arquitectura de Capas** siguiendo el patrón **MVC (Modelo-Vista-Controlador)** con algunas variaciones específicas para APIs RESTful:

### 1. Capa de Modelo (ORM)
- Utiliza Sequelize como ORM para la abstracción de la base de datos
- La carpeta `ORM` contiene modelos, asociaciones y configuración de conexión

### 2. Capa de Controlador
- Directorio `controllers` que maneja la lógica de negocio
- Implementa operaciones CRUD para cada entidad

### 3. Capa de Rutas
- Directorio `routes` que define los endpoints de la API
- Implementa una API RESTful con rutas para cada recurso

### 4. Middlewares
- Componentes intermediarios para procesar solicitudes

## Metodología de Trabajo

La metodología implementada es un enfoque **Factory-Operations** o **Repository Pattern** con las siguientes características:

### 1. Flujo de trabajo modular
- Creación de rutas (`routes/finance-records.js`)
- Definición de controladores (`controllers/finance-records.js`)
- Implementación de factories (`FinanceRecord.js`)
- Operaciones específicas (`operations/FinanceRecord.js`)

### 2. Documentación API
- Integración de Swagger para documentación automática de la API

Esta arquitectura representa una implementación moderna de una API REST en Node.js con Express, siguiendo principios de separación de responsabilidades y modularidad, facilitando el mantenimiento y la escalabilidad del código.

## Flujo para implementar nuevas funcionalidades

Para implementar nuevos endpoints para un modelo (por ejemplo, FinanceRecord):

1. Crear el documento de rutas (ej: `routes/finance-records.js`)
2. Importar las rutas en `index.js`
3. Crear el controlador correspondiente (ej: `controllers/finance-records.js`)
4. Crear el factory para el modelo (ej: `FinanceRecord.js`)
5. Crear las operaciones específicas (ej: `operations/FinanceRecord.js`)
