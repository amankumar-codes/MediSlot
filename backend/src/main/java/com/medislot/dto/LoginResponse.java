package com.medislot.dto;

import com.medislot.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginResponse {

    private String name;
    private String token;
    private Role role;
}
