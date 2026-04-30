# Architecture Guidelines

This project follows a decoupled architecture with a clear separation of concerns.

## Backend (Layered Architecture)
- **Controller Layer**: Handles HTTP requests/responses. No business logic here.
- **Service Layer**: Contains the core business logic. Interacts with the Repository layer.
- **Repository Layer**: Handles data persistence using Spring Data JPA.
- **Model Layer**: Defines JPA entities and DTOs.

## Frontend (Modular Architecture)
- **Components**: Reusable UI units (Buttons, Cards, Modals).
- **Pages**: Top-level views that compose components.
- **Services/Utils**: Logic for API calls and helper functions.
- **Assets**: Static resources like images and icons.

## API Design
- Follow RESTful principles.
- Use plural nouns for resources (e.g., `/api/vocabularies`).
- Use standard HTTP status codes (200, 201, 204, 400, 404, 500).
- Wrap responses in a consistent JSON format.
