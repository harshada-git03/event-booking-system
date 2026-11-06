package com.eventbooking.qa.utils;

import io.restassured.http.ContentType;
import io.restassured.response.Response;

import static io.restassured.RestAssured.given;

public final class AuthClient {

    private AuthClient() {
    }

    public static Response register(String name, String email, String password, String role) {
        String roleField = role == null ? "" : ", \"role\": \"" + role + "\"";
        String body = """
                {"name": "%s", "email": "%s", "password": "%s"%s}
                """.formatted(name, email, password, roleField);
        return postJson("/auth/register", body);
    }

    public static Response login(String email, String password) {
        String body = """
                {"email": "%s", "password": "%s"}
                """.formatted(email, password);
        return postJson("/auth/login", body);
    }

    public static Response postJson(String path, String body) {
        return given().contentType(ContentType.JSON).body(body).when().post(path);
    }

    public static String tokenFor(String role) {
        String email = TestData.uniqueEmail();
        int registerStatus = register("QA User", email, TestData.PASSWORD, role).statusCode();
        if (registerStatus != 200) {
            throw new IllegalStateException("Test setup failed: register returned " + registerStatus);
        }
        Response login = login(email, TestData.PASSWORD);
        if (login.statusCode() != 200) {
            throw new IllegalStateException("Test setup failed: login returned " + login.statusCode());
        }
        return login.jsonPath().getString("token");
    }

    public static String userToken() {
        return tokenFor(null);
    }

    public static String adminToken() {
        return tokenFor("ADMIN");
    }
}