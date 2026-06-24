package com.harshada.eventbooking.service;

import com.harshada.eventbooking.entity.Event;
import com.harshada.eventbooking.exception.ResourceNotFoundException;
import com.harshada.eventbooking.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Page<Event> getAllEventsPaged(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }

    public Page<Event> getEventsByCategory(String category, Pageable pageable) {
        return eventRepository.findByCategoryIgnoreCase(category, pageable);
    }

    public Event createEvent(Event event) {
        event.setAvailableSeats(event.getTotalSeats());
        return eventRepository.save(event);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        existing.setTitle(updatedEvent.getTitle());
        existing.setDescription(updatedEvent.getDescription());
        existing.setVenue(updatedEvent.getVenue());
        existing.setEventDate(updatedEvent.getEventDate());
        existing.setPrice(updatedEvent.getPrice());
        existing.setCategory(updatedEvent.getCategory());

        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found");
        }
        eventRepository.deleteById(id);
    }
}
