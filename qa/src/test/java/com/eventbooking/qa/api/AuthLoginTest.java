package com.eventbooking.qa.api;

import com.eventbooking.qa.base.BaseApiTest;
import com.eventbooking.qa.utils.AuthClient;
import com.eventbooking.qa.utils.TestData;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class AuthLoginTest extends BaseApiTest {

    private String email;

    @BeforeClass(alwaysRun = true)
    public void createUser() {
        email = TestData.uniqueEmail();
        AuthClient.register("QA Login User", email, TestData.PASSWORD, null).then().statusCode(200);
    }

    @Test(groups = {"smoke", "regression", "auth"},
            description = "Valid credentials return a JWT, role and email")
    public void validLogin_returnsToken() {
        Response r = AuthClient.login(email, TestData.PASSWORD);

        assertThat(r.statusCode()).isEqualTo(200);
        assertThat(r.jsonPath().getString("token")).isNotBlank();
        assertThat(r.jsonPath().getString("role")).isEqualTo("USER");
        assertThat(r.jsonPath().getString("email")).isEqualTo(email);
    }

    @Test(groups = {"regression", "auth"},
            description = "The token has the three-part JWT structure")
    public void validLogin_tokenLooksLikeJwt() {
        String token = AuthClient.login(email, TestData.PASSWORD).jsonPath().getString("token");

        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test(groups = {"regression", "auth", "security"},
            description = "The login response never echoes the password")
    public void validLogin_doesNotExposePassword() {
        Response r = AuthClient.login(email, TestData.PASSWORD);

        assertThat(r.asString()).doesNotContain(TestData.PASSWORD);
    }

    @Test(groups = {"regression", "auth"},
            description = "Wrong password is rejected")
    public void wrongPassword_isRejected() {
        Response r = AuthClient.login(email, "WrongPassword@1");

        assertThat(r.statusCode()).isIn(400, 401);
        assertThat(r.asString()).doesNotContain("token");
    }

    @Test(groups = {"regression", "auth"},
            description = "Missing password is rejected")
    public void missingPassword_returns400() {
        Response r = AuthClient.postJson("/auth/login", "{\"email\":\"" + email + "\"}");

        assertThat(r.statusCode()).isEqualTo(400);
    }

    @Test(groups = {"regression", "auth"},
            description = "Empty body is rejected")
    public void emptyBody_returns400() {
        Response r = AuthClient.postJson("/auth/login", "{}");

        assertThat(r.statusCode()).isEqualTo(400);
    }

    @Test(groups = {"known-issues", "auth", "security"},
            description = "Unknown email should be handled like a wrong password, not crash")
    public void unknownEmail_isRejectedCleanly() {
        Response r = AuthClient.login(TestData.uniqueEmail(), TestData.PASSWORD);

        assertThat(r.statusCode()).isIn(400, 401);
    }
}