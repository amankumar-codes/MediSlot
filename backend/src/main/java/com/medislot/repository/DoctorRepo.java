package com.medislot.repository;

import com.medislot.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepo extends JpaRepository<Doctor, Integer> {
    boolean existsByUser_Email(String email);
}
