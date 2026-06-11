package com.devbugtracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.dto.AppUserResponseDTO;
import com.devbugtracker.dto.AuthResponseDTO;
import com.devbugtracker.dto.LoginRequestDTO;
import com.devbugtracker.dto.RegisterRequestDTO;
import com.devbugtracker.dto.UpdateUserRequestDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.exception.UnauthorizedException;
import com.devbugtracker.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponseDTO register(@RequestBody @Valid RegisterRequestDTO requestDTO) {
        return authService.register(requestDTO);
    }
    
    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody @Valid LoginRequestDTO requestDTO) {
        return authService.login(requestDTO);
    }
    
    @GetMapping("/me")
    public AppUserResponseDTO me(Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return authService.getAuthenticatedUser(appUser);
    }
    
    @PutMapping("/me")
    public AppUserResponseDTO updateMe(
            @RequestBody @Valid UpdateUserRequestDTO requestDTO,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return authService.updateAuthenticatedUser(appUser, requestDTO);
    }
    
    private AppUser getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser appUser)) {
            throw new UnauthorizedException("Usuário não autenticado");
        }

        return appUser;
    }
}