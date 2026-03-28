package com.tridp123.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "vocabulary")
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;

    private String meaning;
    private String example;
    
    private String ipa;
    
    @Column(columnDefinition = "LONGTEXT")
    private String image;
}
