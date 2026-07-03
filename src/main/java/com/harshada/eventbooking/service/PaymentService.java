package com.harshada.eventbooking.service;

import com.harshada.eventbooking.dto.PaymentOrderDTO;
import com.harshada.eventbooking.dto.PaymentVerificationDTO;
import com.harshada.eventbooking.entity.Booking;
import com.harshada.eventbooking.exception.ResourceNotFoundException;
import com.harshada.eventbooking.repository.BookingRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private BookingRepository bookingRepository;

    public PaymentOrderDTO createOrder(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            
            orderRequest.put("amount", (int)(booking.getTotalAmount() * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + bookingId);

            Order order = client.orders.create(orderRequest);

            return new PaymentOrderDTO(
                    order.get("id"),
                    booking.getTotalAmount(),
                    "INR",
                    keyId
            );

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        }
    }

    public String verifyPayment(PaymentVerificationDTO dto) {
        try {
            String data = dto.getRazorpayOrderId() + "|" + dto.getRazorpayPaymentId();

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);

            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            String generatedSignature = hexString.toString();

            if (generatedSignature.equals(dto.getRazorpaySignature())) {
                
                Booking booking = bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

                booking.setStatus("PAID");
                bookingRepository.save(booking);

                return "Payment verified successfully";
            } else {
                throw new RuntimeException("Payment verification failed - invalid signature");
            }

        } catch (Exception e) {
            throw new RuntimeException("Payment verification error: " + e.getMessage());
        }
    }
}
