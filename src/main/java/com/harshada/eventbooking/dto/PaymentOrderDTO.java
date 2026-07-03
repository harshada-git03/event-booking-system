package com.harshada.eventbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderDTO {

    private String orderId;
    private Double amount;
    private String currency;
    private String keyId;
}