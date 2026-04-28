package com.tridp123.backend.repository;

import com.tridp123.backend.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserIdAndVocabularyId(Long userId, Long vocabularyId);
    List<UserProgress> findByUserId(Long userId);
    List<UserProgress> findByUserIdAndNextReviewBefore(Long userId, LocalDateTime now);
}
