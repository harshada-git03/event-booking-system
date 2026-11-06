package com.eventbooking.qa.api;

import com.eventbooking.qa.base.BaseApiTest;
import io.restassured.RestAssured;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class SmokeTest extends BaseApiTest {

    @Test(groups = "smoke")
    public void applicationIsReachable() {
        int status = RestAssured.get("/events").statusCode();
        
        assertThat(status).isIn(200, 401, 403);
    }
}