package com.tridp123.backend.service;

import com.tridp123.backend.model.UserProgress;
import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.repository.UserProgressRepository;
import com.tridp123.backend.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final VocabularyRepository vocabularyRepository;

    public List<Vocabulary> getDueFlashcards(Long userId) {
        // Fetch all progress items due for review
        List<UserProgress> dueProgress = progressRepository.findByUserIdAndNextReviewBefore(userId, LocalDateTime.now());
        
        // Return corresponding vocabularies
        return dueProgress.stream()
                .map(UserProgress::getVocabulary)
                .collect(Collectors.toList());
    }

    public void recordReview(Long userId, Long vocabId, String performance) {
        UserProgress progress = progressRepository.findByUserIdAndVocabularyId(userId, vocabId)
                .orElseGet(() -> {
                    UserProgress newProgress = new UserProgress();
                    newProgress.setUserId(userId);
                    newProgress.setVocabulary(vocabularyRepository.findById(vocabId).orElseThrow());
                    newProgress.setStatus("NEW");
                    newProgress.setConsecutiveCorrectAnswers(0);
                    return newProgress;
                });

        int box = progress.getConsecutiveCorrectAnswers();

        // Interpret performance: "EASY", "GOOD", "HARD"
        if ("HARD".equalsIgnoreCase(performance)) {
            box = 0;
            progress.setStatus("LEARNING");
        } else if ("GOOD".equalsIgnoreCase(performance)) {
            box += 1;
            progress.setStatus("REVIEWING");
        } else if ("EASY".equalsIgnoreCase(performance)) {
            box += 2;
            progress.setStatus("REVIEWING");
        }

        progress.setConsecutiveCorrectAnswers(box);
        progress.setLastReview(LocalDateTime.now());
        progress.setNextReview(calculateNextReview(box));
        
        if (box >= 5) {
            progress.setStatus("MASTERED");
        }

        progressRepository.save(progress);
    }

    private LocalDateTime calculateNextReview(int box) {
        LocalDateTime now = LocalDateTime.now();
        return switch (box) {
            case 0 -> now.plusMinutes(10); // Review again soon
            case 1 -> now.plusDays(1);
            case 2 -> now.plusDays(3);
            case 3 -> now.plusDays(7);
            case 4 -> now.plusDays(14);
            default -> now.plusDays(30);
        };
    }
}
