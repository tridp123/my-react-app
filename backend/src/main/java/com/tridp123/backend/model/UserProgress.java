npackage com.tridp123.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // For now, assume a dummy user id since there's no User entity yet
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vocab_id")
    private Vocabulary vocabulary;

    private String status; // NEW, LEARNING, REVIEWING, MASTERED
    
    private int consecutiveCorrectAnswers; // Often referred to as "box" in SRS
    
    private LocalDateTime lastReview;
    private LocalDateTime nextReview;
}
