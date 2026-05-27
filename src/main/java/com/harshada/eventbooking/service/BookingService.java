package com.harshada.eventbooking.service;

import com.harshada.eventbooking.dto.BookingDTO;
import com.harshada.eventbooking.entity.Booking;

import java.util.List;

public interface BookingService {

    Booking createBooking(BookingDTO bookingDTO);

    List<Booking> getAllBookings();

    Booking getBookingById(Long id);

    void cancelBooking(Long id);
}
