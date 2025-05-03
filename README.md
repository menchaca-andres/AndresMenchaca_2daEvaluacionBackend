# Microservicio en GraphQL para la gestión de usuarios

Microservicio GraphQL que permite a los administradores de la página web de Testimonios consultar usuarios desde la API auth, manejando la autenticación, verificación en dos factores y consultas a través de este endpoint.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)

## Configuración del Entorno

1. Clona el repositorio:

```bash
git clone https://github.com/menchaca-andres/AndresMenchaca_2daEvaluacionBackend.git
cd AndresMenchaca_2daEvaluacionBackend
```

2. Instala las dependencias:

````bash
# Instalar todas las dependencias
npm install

# O si prefieres instalar las dependencias principales manualmente:
npm install graphql graphql-yoga @graphql-tools/schema axios dotenv
npm install -D typescript ts-node @types/node @types/graphql
````

## Crear un archivo .env

```env
PORT=4001
API_URL=http://localhost:4000
JWT_SECRET=microservicio-secret-key
````

## Estructura del Proyecto

```
├── src/
│   ├── apiClient.ts     # Cliente Axios para comunicación con API REST
│   ├── config.ts        # Configuración del servidor
│   ├── resolvers.ts     # Resolvers de GraphQL
│   ├── schema.graphql   # Schema de GraphQL
│   ├── server.ts        # Configuración del servidor GraphQL
│   └── types/          # Definiciones de tipos TypeScript
|       └── graphql.d.ts
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts
└── tsconfig.json      # Configuración de TypeScript
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con ts-node
- `npm run build`: Compila el código TypeScript
- `npm start`: Inicia el servidor en modo producción
- `npm run watch`: Inicia el servidor en modo desarrollo con nodemon

## Endpoints GraphQL

### Queries

- `users`: Obtiene la lista de usuarios (requiere autenticación)

### Mutations

- `login(email: String!, password: String!)`: Inicia sesión
- `verify2FA(token: String!, tempToken: String!)`: Verifica el código 2FA

## Desarrollo Local

1. El servicio API REST tiene que estar corriendo en `http://localhost:4000`

2. Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

3. Accede a GraphQL en `http://localhost:4001/graphql` en Potsman con la petición POST para los tres endpoints.

## Ejemplo de Uso

### Login

```graphql
mutation {
  login(email: "4mrvro@gmail.com", password: "amr2641$") {
    accessToken
    refreshToken
    user {
      id
      email
    }
    requires2FA
    tempToken
  }
}
```

### Verificación 2FA

```graphql
mutation {
      verify2FA(token: "701926", tempToken: "eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.
      eyJpZF91c3VhcmlvIjozLCJwZW5kaW5nMkZBIjp0cnVILCJpYXQi0jE3NDYXOTE3NjEsImV4c
      CI6MTc0NjE5MjA2MX0.
      m1kjhfAyciRZ1teyI-dMVkSPowPSPY7WgmMZIpIHLyU") {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

### Consulta de Usuarios

```graphql
query {
  users {
    id
    email
    nombre
    role
  }
}
```

Nota: Para la consulta de usuarios, incluye el token JWT en los headers:

```txt
  Authorization   Bearer tu_token
```

## Notas Importantes

- El servidor GraphQL corre en el puerto 4001 por defecto
- Se requiere que el servicio API REST esté corriendo en el puerto 4000
- Las peticiones a `/users` requieren un token JWT válido
- El sistema soporta autenticación de dos factores (2FA)