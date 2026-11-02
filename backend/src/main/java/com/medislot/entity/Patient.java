package com.medislot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Size(min = 3, max = 50, message = "Enter Valid Name")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 120, message = "Age cannot exceed 120")
    private int age;

    @NotBlank
    @Size(min = 10,max = 10, message = "Please Enter Valid Phone Number")
    private String mobile;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}