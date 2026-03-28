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
