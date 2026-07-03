package com.harshada.eventbooking.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String analyzeSentiment(String reviewText, int rating) {
        String prompt = """
                Analyze the following event review and provide:
                1. Sentiment: (respond with exactly one word: POSITIVE, NEGATIVE, or NEUTRAL)
                2. Summary: (one sentence summary of the review)
                
                Review: "%s"
                Rating: %d out of 5
                
                Respond in this exact format:
                SENTIMENT: <POSITIVE/NEGATIVE/NEUTRAL>
                SUMMARY: <one sentence summary>
                """.formatted(reviewText, rating);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        try {
            String response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Gemini raw response: " + response);

            return extractText(response);

        } catch (Exception e) {
            System.err.println("Gemini API error: " + e.getMessage());
            e.printStackTrace();
            return "SENTIMENT: NEUTRAL\nSUMMARY: Unable to analyze review at this time.";
        }
    }

    private String extractText(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            System.out.println("Extracted text: " + text);
            return text;

        } catch (Exception e) {
            System.err.println("Parse error: " + e.getMessage());
            return "SENTIMENT: NEUTRAL\nSUMMARY: Could not parse response.";
        }
    }
}
