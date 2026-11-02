package com.medislot.controller;

import com.medislot.dto.AppointmentResponse;
import com.medislot.dto.DoctorRequest;
import com.medislot.dto.PatientDetails;
import com.medislot.entity.Appointment;
import com.medislot.entity.Doctor;
import com.medislot.repository.DoctorRepo;
import com.medislot.service.DoctorService;
import com.medislot.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    DoctorRepo doctorRepo;

    @Autowired
    DoctorService doctorService;

    @PostMapping("/doctors")
    public ResponseEntity<Doctor> registerDoctor(@Valid Authentication auth, @RequestBody DoctorRequest doctor){

         return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.registerDoctor(auth.getName(), doctor));
    }


    @GetMapping("/appointments/{appointmentId}/patient")
    public PatientDetails getAppointmentPatient(@PathVariable Integer appointmentId, Authentication auth){

       return doctorService.getAppointmentPatient(appointmentId, auth.getName());

    }

    @PutMapping("/appointments/{appointmentId}/approval")
    public AppointmentResponse approveAppointment(@Valid @PathVariable Integer appointmentId, Authentication auth, @RequestBody AppointmentResponse response) {
        return doctorService.approveAppointment(appointmentId, auth.getName(), response.getMeetingTime());
    }

    @PutMapping("/appointments/{appointmentId}/rejection")
    public Appointment rejectAppointment(@PathVariable Integer appointmentId, Authentication auth) {
        return doctorService.rejectAppointment(appointmentId, auth.getName());
    }

    @GetMapping("/appointments/me")
    public List<AppointmentResponse> getMyAppointments(Authentication auth){
        return doctorService.getMyAppointments(auth.getName());

    }

    @GetMapping("/is-doctor")
    public boolean isPatient(Authentication authentication) {
        return doctorRepo.existsByUser_Email(authentication.getName());
    }



}
