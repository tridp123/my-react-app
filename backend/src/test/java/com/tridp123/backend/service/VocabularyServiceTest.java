package com.tridp123.backend.service;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.repository.VocabularyRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

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
