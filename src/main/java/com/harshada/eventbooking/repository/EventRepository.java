package com.harshada.eventbooking.repository;

import com.harshada.eventbooking.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findByCategoryIgnoreCase(String category, Pageable pageable);
}
