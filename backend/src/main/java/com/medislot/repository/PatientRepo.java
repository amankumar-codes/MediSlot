package com.medislot.repository;

import com.medislot.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient, Integer> {

    Optional<Patient> findByUser_Email(String email);

    boolean existsByUser_Email(String email);
}
