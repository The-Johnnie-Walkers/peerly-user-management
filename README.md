# Peerly User Management

Backend microservice for user management in the Peerly application. Provides CRUD operations for users, interests, and free time schedules.

## Description

This microservice handles all user-related functionality including:

- User account management (create, read, update, delete)
- User interests management
- Free time schedule management
- Role-based access control

## Developers

- Daniel Patiño Mejia
- Nestor David Lopez Castañeda
- Diego Fernando Chavarro Castillo
- David Santiago Palacios Pinzón

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Messaging**: RabbitMQ (AMQP)
- **Language**: TypeScript

## Project Structure

```
src/
├── contexts/
│   └── user/
│       ├── domain/           # Core business logic
│       │   ├── entities/     # Domain entities
│       │   ├── enums/        # Domain enumerations
│       │   └── ports/        # Port interfaces
│       ├── application/      # Application services & use cases
│       │   ├── service/
│       │   └── use-cases/
│       └── infrastructure/   # External adapters
│           └── adapters/
│               ├── in/       # Input adapters (HTTP)
│               └── out/      # Output adapters (Persistence)
├── app.module.ts
└── main.ts
```

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm (recommended) or npm
- MongoDB instance
- RabbitMQ instance (default: `amqp://localhost:5672`, queue: `user_queue`)

### Installation

```bash
# Clone the repository
$ git clone https://github.com/The-Johnnie-Walkers/peerly-user-management.git
$ cd peerly-user-management

# Install dependencies
$ pnpm install
```

### Configuration

Create a `.env` file in the root directory (use `.env.example` as reference):

```env
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/peerly

# Application
PORT=3000

# CORS — allowed origins (comma-separated for multiple)
CORS_ORIGIN=http://localhost:8080
```

> `CORS_ORIGIN` supports multiple origins: `http://localhost:8080,http://localhost:4200`

### Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## API Endpoints

### Users

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | `/users`     | Get all users   |
| GET    | `/users/:id` | Get user by ID  |
| POST   | `/users`     | Create new user |
| PUT    | `/users/:id` | Update user     |
| DELETE | `/users/:id` | Delete user     |

**POST `/users` — Request body:**

```json
{
  "id": "optional-auth-service-id",
  "username": "jdoe123",
  "name": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "birthDate": "2000-05-15",
  "semester": 5,
  "status": "ACTIVE",
  "programs": ["SYSTEMS_ENGINEERING"],
  "role": "USER",
  "description": "optional",
  "profilePicURL": "optional",
  "interests": [],
  "freeTimeSchedule": []
}
```

> The `id` field is optional. If provided, the document will be saved with that ID — useful for syncing with the Auth microservice so both share the same user ID.

**Enum values:**
- `status`: `ACTIVE` | `INACTIVE` | `SUSPENDED` | `BLOCKED`
- `role`: `USER` | `ADMIN`
- `programs` (max 2): `SYSTEMS_ENGINEERING`, `CIVIL_ENGINEERING`, `INDUSTRIAL_ENGINEERING`, `CYBERSECURITY_ENGINEERING`, `MECHANICAL_ENGINEERING`, `ELECTRICAL_ENGINEERING`, `BIOMEDICAL_ENGINEERING`, `AI_ENGINEERING`, `ELECTRONICAL_ENGINEERING`, `ENVIRONMENTAL_ENGINEERING`, `BIOTECHNOLOGY_ENGINEERING`, `STATISTIC_ENGINEERING`, `ECONOMY`, `MATHEMATICS`, `ENTERPRISE_ADMINISTRATION`
- `interests[].category` (max 5): `SPORTS` | `VIDEOGAMES` | `MUSIC` | `MOVIES` | `BOOKS` | `TECHNOLOGY` | `OTHER`
- `freeTimeSchedule[].dayOfTheWeek`: `MONDAY` | `TUESDAY` | `WEDNESDAY` | `THURSDAY` | `FRIDAY` | `SATURDAY`

### Interests

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/interests`     | Get all interests   |
| GET    | `/interests/:id` | Get interest by ID  |
| POST   | `/interests`     | Create new interest |
| PUT    | `/interests/:id` | Update interest     |
| DELETE | `/interests/:id` | Delete interest     |


## Testing

```bash
# Run all tests
$ pnpm run test

# Run tests with coverage
$ pnpm run test:cov

# Run end-to-end tests
$ pnpm run test:e2e
```

## System Architecture & Design

### Context Diagram
![contextDiagram](./img/context-diagram.jpg)


### Class Diagram
![classDiagram](./img/class-diagram.jpg)

### Database Diagram
![DataBaseDiagram](./img/db-diagram.jpg)

