package com.medislot.controller;

import com.medislot.dto.LoginRequest;
import com.medislot.dto.LoginResponse;
import com.medislot.entity.User;
import com.medislot.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> userRegister(@Valid @RequestBody User user){
        User savedUser = authService.userRegistation(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> userLogin(@Valid @RequestBody LoginRequest loginRequest){
        LoginResponse savedUser = authService.userLogin(loginRequest);
        return ResponseEntity.ok(savedUser);

    }
}
