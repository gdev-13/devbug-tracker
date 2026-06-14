package com.devbugtracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.service.EmailVerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @GetMapping("/auth/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        emailVerificationService.verifyEmail(token);

        return ResponseEntity.ok("Email confirmado com sucesso.");
    }
}