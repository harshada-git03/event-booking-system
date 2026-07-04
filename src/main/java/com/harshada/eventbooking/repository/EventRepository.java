package com.harshada.eventbooking.repository;

import com.harshada.eventbooking.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findByCategoryIgnoreCase(String category, Pageable pageable);

    @Query(value = "SELECT * FROM events e WHERE " +
           "(:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:fromDate IS NULL OR e.event_date >= CAST(:fromDate AS date)) AND " +
           "(:toDate IS NULL OR e.event_date <= CAST(:toDate AS date))",
           countQuery = "SELECT COUNT(*) FROM events e WHERE " +
           "(:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:fromDate IS NULL OR e.event_date >= CAST(:fromDate AS date)) AND " +
           "(:toDate IS NULL OR e.event_date <= CAST(:toDate AS date))",
           nativeQuery = true)
    Page<Event> searchEvents(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("fromDate") String fromDate,
            @Param("toDate") String toDate,
            Pageable pageable);
}
