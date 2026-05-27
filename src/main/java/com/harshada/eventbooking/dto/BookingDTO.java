package com.harshada.eventbooking.dto;

public class BookingDTO {

    private Long userId;
    private Long eventId;
    private Integer quantity;

    public BookingDTO() {
    }

    public BookingDTO(Long userId, Long eventId, Integer quantity) {
        this.userId = userId;
        this.eventId = eventId;
        this.quantity = quantity;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
