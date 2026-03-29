package com.tridp123.backend.service;

import com.tridp123.backend.model.Vocabulary;
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

    public List<Vocabulary> getAll() { return repo.findAll(); }
    public Vocabulary get(Long id) { return repo.findById(id).orElseThrow(); }
    public Vocabulary create(Vocabulary vocab) { return repo.save(vocab); }
    public Vocabulary update(Long id, Vocabulary vocab) {
        Vocabulary existing = get(id);
        existing.setWord(vocab.getWord());
        existing.setMeaning(vocab.getMeaning());
        existing.setExample(vocab.getExample());
        existing.setIpa(vocab.getIpa());
        existing.setImage(vocab.getImage());
        return repo.save(existing);
    }
    public List<Vocabulary> createAll(List<Vocabulary> vocabs) { return repo.saveAll(vocabs); }
    
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
                
                vocabs.add(vocab);
            }

            repo.saveAll(vocabs);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
        }
    }

    public void delete(Long id) { repo.deleteById(id); }
}
