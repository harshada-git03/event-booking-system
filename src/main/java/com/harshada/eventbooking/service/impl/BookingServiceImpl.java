package com.harshada.eventbooking.service.impl;

import com.harshada.eventbooking.dto.BookingDTO;
import com.harshada.eventbooking.entity.Booking;
import com.harshada.eventbooking.entity.Event;
import com.harshada.eventbooking.entity.User;
import com.harshada.eventbooking.exception.ResourceNotFoundException;
import com.harshada.eventbooking.repository.BookingRepository;
import com.harshada.eventbooking.repository.EventRepository;
import com.harshada.eventbooking.repository.UserRepository;
import com.harshada.eventbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Booking createBooking(BookingDTO bookingDTO) {

        // Fetch User
        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Fetch Event
        Event event = eventRepository.findById(bookingDTO.getEventId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found"));

        // Check seat availability
        if (event.getAvailableSeats() < bookingDTO.getQuantity()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Reduce available seats
        event.setAvailableSeats(
                event.getAvailableSeats() - bookingDTO.getQuantity()
        );

        // Save updated event
        eventRepository.save(event);

        // Create Booking
        Booking booking = new Booking();

        booking.setUser(user);
        booking.setEvent(event);

        booking.setQuantity(bookingDTO.getQuantity());

        booking.setBookingTime(LocalDateTime.now());

        booking.setStatus("CONFIRMED");

        // Generate booking code
        booking.setBookingCode(UUID.randomUUID().toString());

        // Calculate total amount
        booking.setTotalAmount(
                bookingDTO.getQuantity() * event.getPrice()
        );

        // Save booking
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));
    }

    @Override
    public void cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        bookingRepository.delete(booking);
    }
}
