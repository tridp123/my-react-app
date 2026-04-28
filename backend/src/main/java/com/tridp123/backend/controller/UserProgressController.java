package com.tridp123.backend.controller;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserProgressController {

    private final UserProgressService service;

    @GetMapping("/due")
    public List<Vocabulary> getDueFlashcards(@RequestParam(defaultValue = "1") Long userId) {
        return service.getDueFlashcards(userId);
    }

    @PostMapping("/review")
    public ResponseEntity<Void> recordReview(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody Map<String, String> payload) {
        
        Long vocabId = Long.parseLong(payload.get("vocabId"));
        String performance = payload.get("performance"); // HARD, GOOD, EASY

        service.recordReview(userId, vocabId, performance);
        return ResponseEntity.ok().build();
    }
}
