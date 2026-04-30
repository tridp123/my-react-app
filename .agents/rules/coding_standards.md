# Coding Standards

This document defines the coding standards for the project to ensure consistency and quality.

## General Rules
- **Language**: Use English for all code entities (variables, functions, classes, comments).
- **Naming**: 
  - Variables and functions: `camelCase`.
  - Classes and Components: `PascalCase`.
  - Constants: `UPPER_SNAKE_CASE`.
- **Comments**: Write clear, concise comments for complex logic. Use Javadoc for Java methods and JSDoc for complex JS functions.

## Frontend (React)
- **Components**: One component per file. Use functional components with hooks.
- **Props**: Always use descriptive prop names.
- **State**: Keep state as local as possible. Use context only for global data.
- **File Extensions**: Use `.jsx` for components and `.js` for logic.

## Backend (Java/Spring Boot)
- **Packages**: Follow standard Spring Boot package naming (`com.tridp123.backend.*`).
- **Lombok**: Use Lombok annotations (`@Getter`, `@Setter`, `@RequiredArgsConstructor`) to reduce boilerplate.
- **Error Handling**: Use `@ControllerAdvice` for global exception handling.
- **Validation**: Use `jakarta.validation` for request body validation.
