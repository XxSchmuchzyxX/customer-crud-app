# Customer CRUD Application

A full-stack Customer Management System built with Laravel, Angular 20, MySQL, and Elasticsearch.

## 🏗️ Architecture

**Microservices Architecture with Docker Compose:**
- **API Service**: Laravel 10 backend with RESTful API
- **Controller Service**: Nginx load balancer and reverse proxy
- **Database Service**: MySQL 8.0 for data persistence
- **Searcher Service**: Elasticsearch 8.8 for full-text search

**Frontend**: Angular 20 with Bootstrap 5 for modern, responsive UI

## 🚀 Features

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete customers
- ✅ **Real-time Search**: Full-text search across name and email fields
- ✅ **Form Validation**: Client and server-side validation
- ✅ **Responsive Design**: Mobile-friendly Bootstrap interface
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Auto-sync**: Changes automatically synced to Elasticsearch
- ✅ **Modal Forms**: Clean UX for add/edit operations
- ✅ **Delete Confirmation**: Prevents accidental deletions

## 📋 Requirements

- Docker & Docker Compose
- Node.js 18+ (for Angular development)
- Git

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd customer-crud-app
```

### 2. Start Backend Services
```bash
# Start all Docker services
docker-compose up -d

# Wait 60 seconds for Elasticsearch to initialize
# Run database migrations
docker-compose exec api php artisan migrate

# Create Elasticsearch index
docker-compose exec api php artisan tinker
# In tinker: $es = new App\Services\ElasticsearchService(); $es->createIndex(); exit
```

### 3. Start Frontend
```bash
cd frontend/customer-crud-frontend
npm install
ng serve
```

### 4. Access Application
- **Frontend**: http://localhost:4200
- **API**: http://localhost:8080/api/customers
- **Elasticsearch**: http://localhost:9200

## 🧪 Testing

### Backend Tests
```bash
# Run all Laravel tests
docker-compose exec api php artisan test

# Run specific test suite
docker-compose exec api php artisan test --filter=CustomerApiTest
```

### Frontend Tests
```bash
cd frontend/customer-crud-frontend
npm test
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create new customer |
| GET | `/api/customers/{id}` | Get specific customer |
| PUT | `/api/customers/{id}` | Update customer |
| DELETE | `/api/customers/{id}` | Delete customer |
| GET | `/api/customers/search?q={query}` | Search customers |

### Example API Usage

**Create Customer:**
```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john@example.com",
    "contact_number": "1234567890"
  }'
```

**Search Customers:**
```bash
curl "http://localhost:8080/api/customers/search?q=John"
```

## 🗄️ Database Schema

**Customer Table:**
```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔍 Elasticsearch Integration

- **Auto-sync**: Customer changes automatically indexed in Elasticsearch
- **Search Fields**: first_name, last_name, email
- **Index**: `customers`
- **Mapping**: Optimized for text search and exact matches

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| nginx (controller) | 8080 | Load balancer & reverse proxy |
| api | 9000 | Laravel PHP-FPM |
| database | 3307 | MySQL database |
| searcher | 9200 | Elasticsearch |

## 🛠️ Development

### Starting Development Environment
```bash
# Start backend services
docker-compose up -d

# Start frontend development server
cd frontend/customer-crud-frontend
ng serve

# View logs
docker-compose logs -f api
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ destroys data)
docker-compose down -v
```

## 📝 Project Structure

```
customer-crud-app/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Services/          # Business Logic
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── factories/         # Test Data Factories
│   ├── routes/api.php         # API Routes
│   ├── tests/Feature/         # Integration Tests
│   └── Dockerfile
├── frontend/customer-crud-frontend/  # Angular 20 App
│   ├── src/app/
│   │   ├── components/        # UI Components
│   │   ├── services/          # HTTP Services
│   │   └── app.ts            # Main App Component
│   └── src/styles.css        # Global Styles
├── docker-compose.yml         # Docker orchestration
├── nginx.conf                 # Nginx configuration
└── README.md                 # This file
```
