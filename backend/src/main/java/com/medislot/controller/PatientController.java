package com.medislot.controller;

import com.medislot.dto.AppointmentResponse;
import com.medislot.dto.DoctorList;
import com.medislot.dto.PatientRequest;
import com.medislot.entity.Appointment;
import com.medislot.entity.Doctor;
import com.medislot.entity.Patient;
import com.medislot.repository.PatientRepo;
import com.medislot.service.AppointmentService;
import com.medislot.service.DoctorService;
import com.medislot.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {

    @Autowired
    PatientService patientService;

    @Autowired
    DoctorService doctorService;

    @Autowired
    AppointmentService appointmentService;

    @Autowired
    PatientRepo patientRepo;


    @GetMapping("/doctor")
    public List<DoctorList> doctorList(){

        return doctorService.allPatient();
    }

    @PostMapping("/patients")
    public ResponseEntity<Patient> registerPatient(Authentication auth, @RequestBody PatientRequest patientRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.registerPatient(auth.getName(), patientRequest));

    }

    @PostMapping("/appointments/{doctorId}")
    public ResponseEntity<Appointment> createAppointment(Authentication auth, @PathVariable Integer doctorId){

        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createAppointment(auth.getName(),doctorId));
    }

    @GetMapping("/appointments/me")
    public List<AppointmentResponse> getMyAppointments(Authentication auth){
        return patientService.getMyAppointments(auth.getName());
    }

    @GetMapping("/is-patient")
    public boolean isPatient(Authentication authentication) {
        return patientRepo
                .existsByUser_Email(authentication.getName());
    }


}
