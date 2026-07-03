package com.harshada.eventbooking.service;

import com.harshada.eventbooking.dto.ReviewDTO;
import com.harshada.eventbooking.entity.Event;
import com.harshada.eventbooking.entity.Review;
import com.harshada.eventbooking.entity.User;
import com.harshada.eventbooking.exception.ResourceNotFoundException;
import com.harshada.eventbooking.repository.EventRepository;
import com.harshada.eventbooking.repository.ReviewRepository;
import com.harshada.eventbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private GeminiService geminiService;

    public Review createReview(ReviewDTO reviewDTO) {

        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(reviewDTO.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        
        String aiResponse = geminiService.analyzeSentiment(
                reviewDTO.getComment(),
                reviewDTO.getRating()
        );

        
        String sentiment = "NEUTRAL";
        String aiSummary = "";

        for (String line : aiResponse.split("\n")) {
            if (line.startsWith("SENTIMENT:")) {
                sentiment = line.replace("SENTIMENT:", "").trim();
            } else if (line.startsWith("SUMMARY:")) {
                aiSummary = line.replace("SUMMARY:", "").trim();
            }
        }

        Review review = new Review();
        review.setUser(user);
        review.setEvent(event);
        review.setComment(reviewDTO.getComment());
        review.setRating(reviewDTO.getRating());
        review.setSentiment(sentiment);
        review.setAiSummary(aiSummary);
        review.setReviewTime(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByEvent(Long eventId) {
        return reviewRepository.findByEventId(eventId);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Map<String, Object> getEventSentimentSummary(Long eventId) {
        List<Review> reviews = reviewRepository.findByEventId(eventId);

        long positive = reviews.stream().filter(r -> "POSITIVE".equals(r.getSentiment())).count();
        long negative = reviews.stream().filter(r -> "NEGATIVE".equals(r.getSentiment())).count();
        long neutral = reviews.stream().filter(r -> "NEUTRAL".equals(r.getSentiment())).count();

        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalReviews", reviews.size());
        summary.put("positiveCount", positive);
        summary.put("negativeCount", negative);
        summary.put("neutralCount", neutral);
        summary.put("averageRating", Math.round(avgRating * 10.0) / 10.0);
        summary.put("overallSentiment", positive > negative ? "POSITIVE" : negative > positive ? "NEGATIVE" : "NEUTRAL");

        return summary;
    }
}
