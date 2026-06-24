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
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public Booking createBooking(BookingDTO bookingDTO) {

        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(bookingDTO.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (event.getAvailableSeats() < bookingDTO.getQuantity()) {
            throw new RuntimeException("Not enough seats available");
        }

        
        event.setAvailableSeats(event.getAvailableSeats() - bookingDTO.getQuantity());
        eventRepository.save(event);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setQuantity(bookingDTO.getQuantity());
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        booking.setBookingCode(UUID.randomUUID().toString());
        booking.setTotalAmount(bookingDTO.getQuantity() * event.getPrice());

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    @Override
    @Transactional
    public void cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        
        Event event = booking.getEvent();
        event.setAvailableSeats(event.getAvailableSeats() + booking.getQuantity());
        eventRepository.save(event);

        bookingRepository.delete(booking);
    }
}
