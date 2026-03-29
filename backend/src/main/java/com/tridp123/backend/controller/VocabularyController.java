package com.tridp123.backend.controller;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.service.VocabularyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/vocabularies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/bulk")
    public ResponseEntity<List<Vocabulary>> createBulk(@RequestBody List<Vocabulary> vocabs) {
        return ResponseEntity.ok(service.createAll(vocabs));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a CSV file to upload.");
        }

        try {
            service.importFromCsv(file.getInputStream());
            return ResponseEntity.ok("File imported successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
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
