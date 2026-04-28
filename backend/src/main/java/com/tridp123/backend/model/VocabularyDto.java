package com.tridp123.backend.model;

import lombok.Data;

@Data
public class VocabularyDto {
    private String word;
    private String meaning;
    private String example;
    private String ipa;
    private String topic;
    private String level;
    private String partOfSpeech;
    private String image;
}
