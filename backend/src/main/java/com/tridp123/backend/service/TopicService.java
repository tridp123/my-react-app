package com.tridp123.backend.service;

import com.tridp123.backend.model.Topic;
import com.tridp123.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    public Topic getOrCreateTopic(String name) {
        if (name == null || name.trim().isEmpty()) {
            return null;
        }
        String trimmedName = name.trim();
        return topicRepository.findByName(trimmedName)
                .orElseGet(() -> {
                    Topic newTopic = new Topic();
                    newTopic.setName(trimmedName);
                    return topicRepository.save(newTopic);
                });
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }
}
