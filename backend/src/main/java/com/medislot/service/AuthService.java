package com.medislot.service;

import com.medislot.dto.LoginRequest;
import com.medislot.dto.LoginResponse;
import com.medislot.entity.User;
import com.medislot.repository.AuthRepo;
import com.medislot.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.medislot.enums.Role.PATIENT;

@Service
public class AuthService {

    @Autowired
    AuthRepo authRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;


    public User userRegistation(User user){

        user.setRole(PATIENT);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return authRepo.save(user);
    }

    public LoginResponse userLogin(LoginRequest loginRequest){

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail()
        , loginRequest.getPassword()));

        LoginResponse loginResponse = new LoginResponse();

        User user = authRepo.findByEmail(loginRequest.getEmail()).orElseThrow();

        loginResponse.setToken(jwtService.generateToken(authentication.getName()));
        loginResponse.setRole(user.getRole());
        loginResponse.setName(user.getName());

        return loginResponse;

    }
}
