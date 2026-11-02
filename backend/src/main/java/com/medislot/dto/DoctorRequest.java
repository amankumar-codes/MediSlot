package com.medislot.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DoctorRequest {

    private String specialization;
    private String availability;
}
