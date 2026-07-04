#  Event Booking System

A full-featured **Event Booking System** built with **Java Spring Boot**, featuring JWT authentication, email notifications, PDF ticket generation, Razorpay payment integration, and AI-powered sentiment analysis using Google Gemini.

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4.0.6 |
| Database | PostgreSQL |
| Security | Spring Security + JWT |
| Email | JavaMail (Gmail SMTP) |
| PDF | iText 5 |
| Payment | Razorpay |
| AI | Google Gemini API |
| Documentation | Swagger / OpenAPI |
| Build Tool | Maven |

---

##  Features

### Auth
- User Registration & Login
- JWT Token-based Authentication
- Role-based Authorization (USER / ADMIN)
- BCrypt Password Hashing

### Events
- Create, Read, Update, Delete Events (Admin only)
- Pagination & Sorting
- Search by keyword, category, and date range
- Category filtering

### Bookings
- Book tickets with seat availability check
- Cancel booking with automatic seat restore
- Booking confirmation email with PDF ticket attached
- Cancellation email notification

### Payments
- Razorpay payment order creation
- Payment signature verification

### AI Sentiment Analysis
- Users can post reviews for events
- Google Gemini AI analyzes sentiment (POSITIVE / NEGATIVE / NEUTRAL)
- AI-generated summary of each review
- Overall sentiment summary per event

### API Documentation
- Swagger UI at `/swagger-ui/index.html`

---
---

##  Setup & Installation

### Prerequisites
- Java 21
- Maven
- PostgreSQL
- Gmail account (for email notifications)
- Razorpay account (test mode)
- Google Gemini API key

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/harshada-git03/event-booking-system.git
cd event-booking-system
```

2. **Create PostgreSQL database**
```sql
CREATE DATABASE event_booking;
```

3. **Create `application.properties`**

Copy `application.properties.example` to `application.properties` and fill in your values:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/event_booking
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

app.jwt.secret=your-secret-key-min-256-bits
app.jwt.expiration=86400000

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_gmail@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret

gemini.api.key=your_gemini_api_key
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

server.port=8080
```

4. **Run the application**
```bash
mvn clean install -DskipTests
mvn spring-boot:run
```
---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |

### Events
| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | Get all events (paginated) |
| GET | `/events/all` | Get all events (no pagination) |
| GET | `/events/search` | Search events by keyword/category/date |
| GET | `/events/{id}` | Get event by ID |
| POST | `/events` | Create event (Admin only) |
| PUT | `/events/{id}` | Update event (Admin only) |
| DELETE | `/events/{id}` | Delete event (Admin only) |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/{id}` | Get booking by ID |
| POST | `/bookings` | Create a booking |
| DELETE | `/bookings/{id}` | Cancel a booking |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| POST | `/users` | Create user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user (Admin only) |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/payments/create-order/{bookingId}` | Create Razorpay order |
| POST | `/payments/verify` | Verify payment signature |

### Reviews (AI Sentiment)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/reviews` | Submit review (triggers AI analysis) |
| GET | `/reviews/event/{eventId}` | Get reviews for an event |
| GET | `/reviews/user/{userId}` | Get reviews by a user |
| GET | `/reviews/event/{eventId}/summary` | Get AI sentiment summary |

---

##  Author

**Harshada Patil**
[GitHub](https://github.com/harshada-git03)