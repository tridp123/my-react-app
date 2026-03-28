---
name: Backend Skill
description: Guide for setting up and developing a Java Spring Boot backend for the my‑react‑app project.
---

# Backend Skill (Spring Boot)

## Overview
This skill documents how to create, configure, and run a **Spring Boot** backend service that can be used alongside the React frontend (`my‑react‑app`). It includes project scaffolding, common patterns, REST API design, data persistence, and testing.

## Prerequisites
- **Java Development Kit (JDK) 21** (or newer) installed.
- **Maven 3.9+** (or Gradle, but Maven is used in examples).
- **IDE** such as IntelliJ IDEA, VS Code with Java extensions, or Eclipse.
- Basic knowledge of Java, Spring framework, and REST principles.

## 1. Project Bootstrap
```bash
# Create a new Spring Boot project using the Spring Initializr
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,mysql,validation,lombok \
  -d javaVersion=21 \
  -d packaging=jar \
  -d groupId=com.tridp123 \
  -d artifactId=backend \
  -d name=backend \
  -o backend.zip

unzip backend.zip -d backend
cd backend
```
> The generated project contains a `pom.xml` with the selected dependencies and a basic `Application` class.

## 2. Directory Layout
```
backend/
├─ src/main/java/com/tridp123/backend/
│  ├─ controller/          # REST controllers
│  ├─ model/               # JPA entity classes
│  ├─ repository/          # Spring Data JPA repositories
│  ├─ service/             # Business logic services
│  └─ BackendApplication.java
├─ src/main/resources/
│  ├─ application.yml      # Configuration (DB, server, etc.)
│  └─ static/              # Optional static assets
└─ pom.xml
```

## 3. Core Files
### 3.1 `BackendApplication.java`
```java
package com.tridp123.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
```
### 3.2 `application.yml`
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/myreactapp
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```
> Adjust DB credentials as needed.

## 4. Example Feature – Vocabulary Management
### 4.1 Entity (`Vocabulary.java`)
```java
package com.tridp123.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "vocabulary")
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;

    private String meaning;
    private String example;
}
```
### 4.2 Repository (`VocabularyRepository.java`)
```java
package com.tridp123.backend.repository;

import com.tridp123.backend.model.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    // Spring Data JPA provides CRUD methods automatically
}
```
### 4.3 Service (`VocabularyService.java`)
```java
package com.tridp123.backend.service;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VocabularyService {
    private final VocabularyRepository repo;

    public List<Vocabulary> getAll() { return repo.findAll(); }
    public Vocabulary get(Long id) { return repo.findById(id).orElseThrow(); }
    public Vocabulary create(Vocabulary vocab) { return repo.save(vocab); }
    public Vocabulary update(Long id, Vocabulary vocab) {
        Vocabulary existing = get(id);
        existing.setWord(vocab.getWord());
        existing.setMeaning(vocab.getMeaning());
        existing.setExample(vocab.getExample());
        return repo.save(existing);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
```
### 4.4 Controller (`VocabularyController.java`)
```java
package com.tridp123.backend.controller;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.service.VocabularyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabularies")
@RequiredArgsConstructor
public class VocabularyController {
    private final VocabularyService service;

    @GetMapping
    public List<Vocabulary> all() { return service.getAll(); }

    @GetMapping("/{id}")
    public Vocabulary get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public ResponseEntity<Vocabulary> create(@Valid @RequestBody Vocabulary vocab) {
        Vocabulary created = service.create(vocab);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public Vocabulary update(@PathVariable Long id, @Valid @RequestBody Vocabulary vocab) {
        return service.update(id, vocab);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```
> The controller exposes a typical CRUD REST API that the React frontend can consume (`/api/vocabularies`).

## 5. Testing
- **Unit Tests** – Use JUnit 5 and Spring Boot Test.
- **Integration Tests** – Load the full context with `@SpringBootTest` and use `TestRestTemplate`.

### Sample Unit Test (`VocabularyServiceTest.java`)
```java
package com.tridp123.backend.service;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.repository.VocabularyRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class VocabularyServiceTest {
    @Mock VocabularyRepository repo;
    @InjectMocks VocabularyService service;

    @Test
    void shouldCreateVocabulary() {
        Vocabulary vocab = new Vocabulary(null, "hello", "greeting", "Hello world");
        when(repo.save(any())).thenReturn(new Vocabulary(1L, "hello", "greeting", "Hello world"));
        Vocabulary saved = service.create(vocab);
        assertEquals(1L, saved.getId());
        verify(repo).save(vocab);
    }
}
```

## 6. Running the Application
```bash
# From the backend directory
mvn spring-boot:run   # or ./mvnw spring-boot:run if wrapper is present
```
The API will be reachable at `http://localhost:8080/api/vocabularies`.

## 7. Deployment Checklist
1. **Build an executable JAR**: `mvn clean package -DskipTests`
2. **Configure environment variables** for DB credentials and any secret keys.
3. **Run in a container** (Docker) – optional but recommended for production.
4. **Enable CORS** for the React origin (`http://localhost:3000` during dev) in a `WebMvcConfigurer` bean.
5. **Health endpoint** – Spring Actuator provides `/actuator/health`.

---
*This skill file can be referenced by other agents or developers to quickly spin up a Spring Boot backend for the project.*
