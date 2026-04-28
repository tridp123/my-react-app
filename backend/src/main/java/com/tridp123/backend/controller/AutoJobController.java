package com.tridp123.backend.controller;

import com.tridp123.backend.service.AutoVocabularyJob;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/autojob")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AutoJobController {

    private final AutoVocabularyJob job;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getStatus() {
        return ResponseEntity.ok(Collections.singletonMap("enabled", job.isEnabled()));
    }

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Boolean>> toggleJob(@RequestBody Map<String, Boolean> payload) {
        if (payload != null && payload.containsKey("enabled")) {
            job.setEnabled(payload.get("enabled"));
        } else {
            job.setEnabled(!job.isEnabled());
        }
        return ResponseEntity.ok(Collections.singletonMap("enabled", job.isEnabled()));
    }
}
