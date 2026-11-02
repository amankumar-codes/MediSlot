package com.medislot.service;

import com.medislot.dto.*;
import com.medislot.enums.AppointmentStatus;
import com.medislot.entity.Appointment;
import com.medislot.entity.Doctor;
import com.medislot.entity.User;
import com.medislot.exception.ResourceNotFoundException;
import com.medislot.repository.AppointmentRepo;
import com.medislot.repository.AuthRepo;
import com.medislot.repository.DoctorRepo;
import com.medislot.repository.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    DoctorRepo doctorRepo;

    @Autowired
    PatientRepo patientRepo;

    @Autowired
    AppointmentRepo appointmentRepo;

    @Autowired
    AuthRepo authRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AppointmentService appointmentService;

    public List<DoctorList> allPatient(){

       List <Doctor> doctors = doctorRepo.findAll();



       List<DoctorList> doctorLists = new ArrayList<>();

       for (Doctor doctor : doctors){
           DoctorList doctorList = new DoctorList();
           doctorList.setName(doctor.getName());
           doctorList.setSpecialization(doctor.getSpecialization());
           doctorList.setAvailability(doctor.getAvailability());
           doctorList.setId(doctor.getId());

           doctorLists.add(doctorList);
       }

        return doctorLists;
    }

    public AppointmentResponse approveAppointment(Integer id, String email, LocalDate meetingTime) {

        Appointment appointment = appointmentRepo.findByIdAndDoctor_User_Email(id, email)
                .orElseThrow(()-> new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.APPROVED);
        appointment.setMeetingTime(meetingTime);

        AppointmentResponse appointmentResponse = new AppointmentResponse();

        appointmentResponse.setPatientName(appointment.getPatient().getName());
        appointmentResponse.setDoctorName(appointment.getDoctor().getName());
        appointmentResponse.setStatus(appointment.getStatus());
        appointmentResponse.setMeetingTime(appointment.getMeetingTime());
        appointmentRepo.save(appointment);

        return appointmentResponse;
    }

    public Appointment rejectAppointment(Integer id, String email) {

        Appointment appointment = appointmentRepo.findByIdAndDoctor_User_Email(id,email)
                .orElseThrow(()-> new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.REJECTED);

       return appointmentRepo.save(appointment);

    }

    public Doctor registerDoctor(String email, DoctorRequest doctorRequest){

        User user = authRepo.findByEmail(email).orElseThrow();

        Doctor doctor = new Doctor();

        doctor.setUser(user);
        doctor.setName(user.getName());
        doctor.setAvailability(doctorRequest.getAvailability());
        doctor.setSpecialization(doctorRequest.getSpecialization());

        return doctorRepo.save(doctor);

    }

    public PatientDetails getAppointmentPatient(Integer appointmentId, String email){

        Appointment appointment = appointmentRepo.findByIdAndDoctor_User_Email(appointmentId, email).orElseThrow(()-> new ResourceNotFoundException("Appointment not found"));

        PatientDetails patientDetails = new PatientDetails();

        patientDetails.setName(appointment.getPatient().getName());
        patientDetails.setAge(appointment.getPatient().getAge());
        patientDetails.setMobile(appointment.getPatient().getMobile());

        return patientDetails;
    }

    public List<AppointmentResponse> getMyAppointments(String email) {

        List<Appointment> appointments =
                appointmentRepo.findByDoctor_User_Email(email);

        List<AppointmentResponse> responses = new ArrayList<>();

        for (Appointment appointment : appointments) {

            AppointmentResponse response = new AppointmentResponse();

            response.setPatientName(appointment.getPatient().getName());

            response.setStatus(appointment.getStatus());

            response.setMeetingTime(appointment.getMeetingTime());
            response.setDoctorName(appointment.getDoctor().getName());
            response.setTotalAppointment(appointmentService.countMyAppointments(email));
            response.setId(appointment.getId());

            responses.add(response);
        }

        return responses;
    }


}
