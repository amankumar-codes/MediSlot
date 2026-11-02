package com.medislot.service;

import com.medislot.dto.AppointmentResponse;
import com.medislot.entity.Appointment;
import com.medislot.entity.Doctor;
import com.medislot.entity.Patient;
import com.medislot.entity.User;
import com.medislot.repository.AuthRepo;
import com.medislot.repository.AppointmentRepo;
import com.medislot.repository.DoctorRepo;
import com.medislot.repository.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    @Autowired
    AppointmentRepo appointmentRepo;

    public long countMyAppointments(String email) {
        return appointmentRepo.countByDoctor_User_Email(email);
    }
}