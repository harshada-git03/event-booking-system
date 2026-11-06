package com.eventbooking.qa.api;

import com.eventbooking.qa.base.BaseApiTest;
import com.eventbooking.qa.utils.AuthClient;
import com.eventbooking.qa.utils.TestData;
import io.restassured.response.Response;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class AuthRegisterTest extends BaseApiTest {

    @Test(groups = {"smoke", "regression", "auth"},
            description = "Register a new user with valid data")
    public void registerNewUser_returns200() {
        Response r = AuthClient.register("QA User", TestData.uniqueEmail(), TestData.PASSWORD, null);

        assertThat(r.statusCode()).isEqualTo(200);
        assertThat(r.asString()).contains("registered successfully");
    }

    @Test(groups = {"regression", "auth"},
            description = "Registering the same email twice is rejected")
    public void registerDuplicateEmail_returns400() {
        String email = TestData.uniqueEmail();
        AuthClient.register("QA User", email, TestData.PASSWORD, null).then().statusCode(200);

        Response second = AuthClient.register("QA User", email, TestData.PASSWORD, null);

        assertThat(second.statusCode()).isEqualTo(400);
        assertThat(second.asString()).contains("already registered");
    }

    @DataProvider(name = "invalidRegisterPayloads")
    public Object[][] invalidRegisterPayloads() {
        return new Object[][]{
                {"missing email", "{\"name\":\"QA User\",\"password\":\"Test@12345\"}"},
                {"missing password", "{\"name\":\"QA User\",\"email\":\"%s\"}".formatted(TestData.uniqueEmail())},
                {"blank name", "{\"name\":\"\",\"email\":\"%s\",\"password\":\"Test@12345\"}".formatted(TestData.uniqueEmail())},
                {"invalid email format", "{\"name\":\"QA User\",\"email\":\"not-an-email\",\"password\":\"Test@12345\"}"},
                {"empty object", "{}"}
        };
    }

    @Test(dataProvider = "invalidRegisterPayloads", groups = {"regression", "auth"},
            description = "Invalid register payloads are rejected with 400")
    public void registerWithInvalidPayload_returns400(String caseName, String body) {
        Response r = AuthClient.postJson("/auth/register", body);

        assertThat(r.statusCode()).as(caseName).isEqualTo(400);
    }

    @Test(groups = {"known-issues", "auth", "security"},
            description = "An anonymous user must not be able to create an ADMIN account")
    public void anonymousUserCannotSelfRegisterAsAdmin() {
        String email = TestData.uniqueEmail();
        AuthClient.register("QA Admin Attempt", email, TestData.PASSWORD, "ADMIN");

        Response login = AuthClient.login(email, TestData.PASSWORD);
        String role = login.statusCode() == 200 ? login.jsonPath().getString("role") : "NO_ACCOUNT";

        assertThat(role).as("role granted to a self-registered account").isNotEqualTo("ADMIN");
    }
}