package com.medislot.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DoctorList {

    private Integer id;
    private String name;
    private String specialization;
    private String availability;
}
