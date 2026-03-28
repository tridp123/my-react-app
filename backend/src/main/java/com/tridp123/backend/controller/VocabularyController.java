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
