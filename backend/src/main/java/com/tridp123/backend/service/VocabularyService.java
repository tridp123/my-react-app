package com.tridp123.backend.service;

import com.tridp123.backend.model.Vocabulary;
import com.tridp123.backend.model.VocabularyDto;
import com.tridp123.backend.model.Topic;
import com.tridp123.backend.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class VocabularyService {
    private final VocabularyRepository repo;
    private final TopicService topicService;

    public List<Vocabulary> getAll() { return repo.findAll(); }
    public Vocabulary get(Long id) { return repo.findById(id).orElseThrow(); }
    public Vocabulary create(VocabularyDto dto) { 
        Vocabulary vocab = new Vocabulary();
        return updateFieldsFromDto(vocab, dto);
    }
    public Vocabulary update(Long id, VocabularyDto dto) {
        Vocabulary existing = get(id);
        return updateFieldsFromDto(existing, dto);
    }
    
    private Vocabulary updateFieldsFromDto(Vocabulary vocab, VocabularyDto dto) {
        vocab.setWord(dto.getWord());
        vocab.setMeaning(dto.getMeaning());
        vocab.setExample(dto.getExample());
        vocab.setIpa(dto.getIpa());
        vocab.setImage(dto.getImage());
        vocab.setLevel(dto.getLevel());
        vocab.setPartOfSpeech(dto.getPartOfSpeech());
        
        Topic topic = topicService.getOrCreateTopic(dto.getTopic());
        vocab.setTopic(topic);
        
        return repo.save(vocab);
    }

    public List<Vocabulary> createAll(List<VocabularyDto> dtos) { 
        List<Vocabulary> list = new ArrayList<>();
        for (VocabularyDto dto : dtos) {
            Vocabulary vocab = new Vocabulary();
            updateFieldsFromDto(vocab, dto);
            list.add(vocab);
        }
        return list;
    }
    
    public void importFromCsv(InputStream is) {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader,
                     CSVFormat.DEFAULT.builder()
                             .setHeader()
                             .setSkipHeaderRecord(true)
                             .setIgnoreHeaderCase(true)
                             .setTrim(true)
                             .build())) {

            List<Vocabulary> vocabs = new ArrayList<>();
            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                Vocabulary vocab = new Vocabulary();
                vocab.setWord(csvRecord.get("word"));
                vocab.setMeaning(csvRecord.get("meaning"));
                
                // Optional fields
                if (csvRecord.isMapped("example")) vocab.setExample(csvRecord.get("example"));
                if (csvRecord.isMapped("ipa")) vocab.setIpa(csvRecord.get("ipa"));
                if (csvRecord.isMapped("image")) vocab.setImage(csvRecord.get("image"));
                if (csvRecord.isMapped("topic")) {
                    Topic t = topicService.getOrCreateTopic(csvRecord.get("topic"));
                    vocab.setTopic(t);
                }
                
                vocabs.add(vocab);
            }

            repo.saveAll(vocabs);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
        }
    }

    public void delete(Long id) { repo.deleteById(id); }
}
