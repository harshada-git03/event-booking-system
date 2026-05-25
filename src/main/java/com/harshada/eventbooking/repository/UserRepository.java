package com.harshada.eventbooking.repository;

import com.harshada.eventbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}