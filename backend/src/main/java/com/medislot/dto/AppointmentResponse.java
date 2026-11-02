package com.medislot.dto;

import com.medislot.enums.AppointmentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class AppointmentResponse {

    private Integer id;
    private String patientName;
    private String doctorName;
    private AppointmentStatus status;

    private LocalDate meetingTime;

    private Long totalAppointment;
}
