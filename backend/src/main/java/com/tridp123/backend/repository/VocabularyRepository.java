package com.tridp123.backend.repository;

import com.tridp123.backend.model.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    boolean existsByWord(String word);
}
