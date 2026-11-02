package com.medislot.repository;

import com.medislot.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepo extends JpaRepository <Appointment, Integer> {

    List<Appointment> findByPatient_User_Email(String email);
    List<Appointment> findByDoctor_User_Email(String email);

    long countByDoctor_User_Email(String email);

    Optional<Appointment> findByIdAndDoctor_User_Email(Integer id, String email);


}
