package com.tridp123.backend.service;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutoVocabularyJob {
    private final VocabularyRepository repository;
    private final RestTemplate restTemplate;
    private final TopicService topicService;
    
    private boolean isEnabled = false;

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        this.isEnabled = enabled;
        log.info("AutoVocabularyJob enabled state changed to: {}", enabled);
    }

    @Scheduled(fixedDelay = 5000)
    public void fetchVocabularyTask() {
        if (!isEnabled) return;
        
        try {
            // 1. Get random word
            String randomWordUrl = "https://random-word-api.herokuapp.com/word";
            String[] words = restTemplate.getForObject(randomWordUrl, String[].class);
            if (words == null || words.length == 0) return;
            
            String word = words[0];

            // 2. Check if it already exists
            if (repository.existsByWord(word)) {
                log.info("Word '{}' already exists, skipping.", word);
                return;
            }

            // 3. Get definition
            String dictUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
            
            try {
                Object[] dictResponse = restTemplate.getForObject(dictUrl, Object[].class);
                if (dictResponse != null && dictResponse.length > 0) {
                    Map<String, Object> entry = (Map<String, Object>) dictResponse[0];
                    
                    Vocabulary vocab = new Vocabulary();
                    vocab.setWord(word);
                    vocab.setTopic(topicService.getOrCreateTopic("Ngẫu nhiên"));
                    
                    // Phonetic
                    if (entry.containsKey("phonetic")) {
                        vocab.setIpa((String) entry.get("phonetic"));
                    }
                    
                    List<Map<String, Object>> meanings = (List<Map<String, Object>>) entry.get("meanings");
                    if (meanings != null && !meanings.isEmpty()) {
                        List<Map<String, Object>> definitions = (List<Map<String, Object>>) meanings.get(0).get("definitions");
                        if (definitions != null && !definitions.isEmpty()) {
                            String originalMeaning = (String) definitions.get(0).get("definition");
                            vocab.setMeaning(translateToVietnamese(originalMeaning));
                            
                            if (definitions.get(0).containsKey("example")) {
                                vocab.setExample((String) definitions.get(0).get("example"));
                            }
                        }
                    }
                    
                    if (vocab.getMeaning() != null) {
                        repository.save(vocab);
                        log.info("Successfully added auto-fetched word: {}", word);
                    } else {
                        log.info("Word '{}' found, but no definition available.", word);
                    }
                }
            } catch (Exception e) {
                // Ignore 404 from dictionary API if word not found
                log.info("Dictionary meaning not found for word: {}", word);
            }

        } catch (Exception e) {
            log.error("Error occurred while fetching random word: {}", e.getMessage());
        }
    }

    private String translateToVietnamese(String text) {
        if (text == null || text.trim().isEmpty()) return text;
        try {
            String encodedText = java.net.URLEncoder.encode(text, java.nio.charset.StandardCharsets.UTF_8.toString());
            String url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" + encodedText;
            
            List<?> response = restTemplate.getForObject(url, List.class);
            if (response != null && !response.isEmpty()) {
                List<?> firstItem = (List<?>) response.get(0);
                if (firstItem != null && !firstItem.isEmpty()) {
                    List<?> translationParts = (List<?>) firstItem.get(0);
                    if (translationParts != null && !translationParts.isEmpty()) {
                        return (String) translationParts.get(0);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Translation failed for text '{}': {}", text, e.getMessage());
        }
        return text; // Fallback to English original text
    }
}
