====================================================
NORTHWIND MANAGEMENT SYSTEM
Node.js API + Next.js Frontend + ASP.NET Identity
====================================================

Overview
========
Northwind Management System is a full-stack business management application built using:

- Next.js Frontend
- Node.js/Express REST API
- Microsoft SQL Server (Northwind Database)
- ASP.NET Identity Authentication
- Entity Framework Identity Database
- JWT-based Authentication Integration

The project demonstrates enterprise application architecture using the classic Northwind database while integrating modern web technologies and authentication services.

Features
========

Authentication & Authorization
------------------------------
- ASP.NET Identity User Management
- User Registration
- User Login
- Secure Password Hashing
- JWT Token Authentication
- Protected API Endpoints

Northwind Modules
-----------------
- Dashboard Analytics
- Product Management
- Category Management
- Supplier Management
- Customer Management
- Employee Management
- Order Management
- Reports and Statistics
- Inventory Tracking

Technology Stack
================

Frontend
--------
- Next.js
- React
- TypeScript / JavaScript
- Axios
- Bootstrap / Tailwind CSS
- JWT Authentication

Backend
-------
- Node.js
- Express.js
- SQL Server
- Sequelize / MSSQL Driver
- JWT
- REST API Architecture

Authentication Service
----------------------
- ASP.NET Core Identity
- Entity Framework Core
- SQL Server Identity Database

Database
--------
- Microsoft SQL Server
- Northwind Sample Database

System Architecture
===================

+-------------------+
|    Next.js UI     |
+---------+---------+
          |
          | HTTP/JWT
          v
+-------------------+
|    Node.js API    |
+---------+---------+
          |
          |
          v
+-------------------+
| Northwind Database|
+-------------------+

          ^
          |
          |
+-------------------+
| ASP.NET Identity  |
| Authentication    |
+-------------------+

The frontend communicates with the Node.js API using JWT tokens.
Authentication is managed through ASP.NET Identity, while business data is stored in the Northwind database.

Project Structure
=================

Frontend
--------
frontend/
├── app/
├── pages/
├── components/
├── services/
├── hooks/
├── public/
├── styles/
└── package.json

Backend
-------
backend/
├── controllers/
├── routes/
├── services/
├── middleware/
├── models/
├── config/
├── utils/
├── package.json
└── server.js

Authentication Service
----------------------
IdentityServer/
├── Controllers/
├── Models/
├── Data/
├── Services/
├── DTOs/
├── Program.cs
└── appsettings.json

Installation
============

Prerequisites
-------------
- Node.js 18+
- SQL Server 2019+
- .NET 8 SDK
- Visual Studio 2022 or VS Code

1. Clone Repository
-------------------

git clone https://github.com/aamirabbas01/northwind-portfolio.git

cd northwind-management-system

2. Restore Northwind Database
-----------------------------
- Install SQL Server.
- Restore Northwind.bak in aamirabbas01/Database/northwindmvc.bak Repository URL.
- Verify database is available in SQL Server Management Studio.

3. Configure Backend
--------------------

cd backend

npm install

Create .env file:

PORT=5000

DB_SERVER=localhost
DB_DATABASE=northwindmvc
DB_USER=sa
DB_PASSWORD=yourpassword

JWT_SECRET=your_jwt_secret

IDENTITY_API_URL=https://localhost:7001

4. Configure ASP.NET Identity
-----------------------------


Update appsettings.json:

{
  "ConnectionStrings": {
    "DefaultConnection":
      "Server=localhost;Database=northwindmvc;Trusted_Connection=True;TrustServerCertificate=True"
  }
}


5. Configure Frontend
---------------------

cd frontend

npm install

Create .env.local

NEXT_PUBLIC_API_URL=http://localhost:3001/api

Run Application
===============

Identity Service

dotnet run

Backend API

npm run dev

Frontend

npm run dev

Application URLs
================

Frontend
http://localhost:3000

Node API
http://localhost:3001


API Endpoints
=============

Authentication
--------------
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh-token

Products
--------
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

Customers
---------
GET    /api/customers
POST   /api/customers

Orders
------
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id

Security Features
=================

- ASP.NET Identity Authentication
- JWT Access Tokens
- Password Hashing
- Role-Based Authorization
- Protected API Routes
- Secure HTTP Communication
- Token Validation Middleware

Deployment
==========

Frontend
---------
- Vercel

Backend
--------
- IIS

Database
---------
- SQL Server

Future Enhancements
===================

- Refresh Tokens
- Multi-Factor Authentication
- Audit Logging
- Redis Caching
- Docker Compose
- Automated CI/CD Pipeline
- GraphQL Gateway
- Real-Time Notifications

License
========

This project is intended for educational, portfolio, and enterprise application learning purposes using the Northwind sample database.

Author
======

Developed using:
- Next.js Frontend
- Node.js REST API
- ASP.NET Identity Authentication
- Microsoft SQL Server Northwind Database