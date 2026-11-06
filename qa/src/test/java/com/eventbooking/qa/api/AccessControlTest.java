package com.eventbooking.qa.api;

import com.eventbooking.qa.base.BaseApiTest;
import com.eventbooking.qa.utils.AuthClient;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

public class AccessControlTest extends BaseApiTest {

    private String userToken;
    private String adminToken;

    @BeforeClass(alwaysRun = true)
    public void createTokens() {
        userToken = AuthClient.userToken();
        adminToken = AuthClient.adminToken();
    }

    private Response get(String path, String token) {
        var request = given();
        if (token != null) {
            request = request.header("Authorization", "Bearer " + token);
        }
        return request.when().get(path);
    }

    private Response send(String method, String path, String token, String body) {
        var request = given().contentType("application/json");
        if (token != null) {
            request = request.header("Authorization", "Bearer " + token);
        }
        if (body != null) {
            request = request.body(body);
        }
        return request.when().request(method, path);
    }

    @Test(groups = {"smoke", "regression", "security"},
            description = "Protected endpoint without a token is rejected")
    public void noToken_isRejected() {
        assertThat(get("/events", null).statusCode()).isIn(401, 403);
    }

    @Test(groups = {"regression", "security"},
            description = "Garbage token is rejected")
    public void invalidToken_isRejected() {
        assertThat(get("/events", "not.a.token").statusCode()).isIn(401, 403);
    }

    @Test(groups = {"regression", "security"},
            description = "A token with a modified payload fails signature checking")
    public void tamperedToken_isRejected() {
        String[] parts = userToken.split("\\.");
        char original = parts[1].charAt(5);
        char changed = original == 'A' ? 'B' : 'A';
        parts[1] = parts[1].substring(0, 5) + changed + parts[1].substring(6);
        String tampered = String.join(".", parts);

        assertThat(get("/events", tampered).statusCode()).isIn(401, 403);
    }

    @Test(groups = {"regression", "security"},
            description = "A valid USER token can read events")
    public void userToken_canReadEvents() {
        assertThat(get("/events", userToken).statusCode()).isEqualTo(200);
    }

    @Test(groups = {"regression", "security"},
            description = "USER cannot create events")
    public void user_cannotCreateEvent() {
        assertThat(send("POST", "/events", userToken, "{}").statusCode()).isEqualTo(403);
    }

    @Test(groups = {"regression", "security"},
            description = "USER cannot delete events")
    public void user_cannotDeleteEvent() {
        assertThat(send("DELETE", "/events/1", userToken, null).statusCode()).isEqualTo(403);
    }

    @Test(groups = {"regression", "security"},
            description = "USER cannot delete users")
    public void user_cannotDeleteUser() {
        assertThat(send("DELETE", "/users/1", userToken, null).statusCode()).isEqualTo(403);
    }

    @Test(groups = {"regression", "security"},
            description = "ADMIN passes authorization on event creation (an empty body then fails validation, not security)")
    public void admin_passesAuthorizationOnCreateEvent() {
        assertThat(send("POST", "/events", adminToken, "{}").statusCode()).isNotIn(401, 403);
    }
}