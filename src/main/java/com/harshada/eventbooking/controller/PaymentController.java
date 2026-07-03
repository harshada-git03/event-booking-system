package com.harshada.eventbooking.controller;

import com.harshada.eventbooking.dto.PaymentOrderDTO;
import com.harshada.eventbooking.dto.PaymentVerificationDTO;
import com.harshada.eventbooking.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<PaymentOrderDTO> createOrder(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.createOrder(bookingId));
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentVerificationDTO dto) {
        return ResponseEntity.ok(paymentService.verifyPayment(dto));
    }
}
