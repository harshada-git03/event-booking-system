package com.eventbooking.qa.utils;

import java.util.UUID;

public final class TestData {

    public static final String PASSWORD = "Test@12345";

    private TestData() {
    }

    public static String uniqueEmail() {
        return "qa_" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }
}