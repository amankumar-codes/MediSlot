package com.medislot.service;

import com.medislot.dto.AppointmentResponse;
import com.medislot.dto.PatientRequest;
import com.medislot.entity.Appointment;
import com.medislot.entity.Doctor;
import com.medislot.entity.Patient;
import com.medislot.entity.User;
import com.medislot.exception.ResourceNotFoundException;
import com.medislot.repository.AppointmentRepo;
import com.medislot.repository.AuthRepo;
import com.medislot.repository.DoctorRepo;
import com.medislot.repository.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PatientService {

    @Autowired
    PatientRepo patientRepo;

    @Autowired
    AuthRepo authRepo;

    @Autowired
    AppointmentRepo appointmentRepo;

    @Autowired
    AppointmentService appointmentService;

    @Autowired
    DoctorRepo doctorRepo;


    public List<Patient> allPatient(){

        return patientRepo.findAll();
    }

    public Patient registerPatient(String email, PatientRequest patientRequest){

        User user = authRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setName(user.getName());
        patient.setAge(patientRequest.getAge());
        patient.setMobile(patientRequest.getMobile());

        return patientRepo.save(patient);

    }

    public List<AppointmentResponse> getMyAppointments(String email){

        List<Appointment> appointments = appointmentRepo.findByPatient_User_Email(email);

        List<AppointmentResponse> appointmentResponses = new ArrayList<>();

        for (Appointment appointment : appointments){

            AppointmentResponse response = new AppointmentResponse();

            response.setDoctorName(appointment.getDoctor().getName());
            response.setMeetingTime(appointment.getMeetingTime());
            response.setStatus(appointment.getStatus());
            response.setPatientName(appointment.getPatient().getName());
            response.setTotalAppointment(appointmentService.countMyAppointments(email));
            response.setId(appointment.getId());


            appointmentResponses.add(response);
        }



        return appointmentResponses;
    }

    public Appointment createAppointment(String email, Integer doctorId) {

        Patient patient = patientRepo.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        return appointmentRepo.save(appointment);
    }
}
