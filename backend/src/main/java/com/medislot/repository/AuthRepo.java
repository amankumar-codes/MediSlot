package com.medislot.repository;

import com.medislot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepo extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
}
