package com.eventbooking.qa.base;

import io.restassured.RestAssured;
import org.testng.annotations.BeforeClass;

public class BaseApiTest {

    @BeforeClass
    public void setUp() {
        String baseUrl = System.getProperty("base.url", "http://localhost:8080");
        RestAssured.baseURI = baseUrl;
    }
}