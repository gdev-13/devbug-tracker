package com.devbugtracker.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devbugtracker.dto.AppUserResponseDTO;
import com.devbugtracker.dto.RegisterRequestDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.exception.BadRequestException;
import com.devbugtracker.repository.AppUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserResponseDTO register(RegisterRequestDTO requestDTO) {
        if (appUserRepository.existsByEmail(requestDTO.getEmail())) {
            throw new BadRequestException("Email já cadastrado");
        }

        AppUser appUser = new AppUser();

        appUser.setName(requestDTO.getName());
        appUser.setEmail(requestDTO.getEmail());
        appUser.setPassword(passwordEncoder.encode(requestDTO.getPassword()));

        AppUser savedUser = appUserRepository.save(appUser);

        return toResponseDTO(savedUser);
    }

    private AppUserResponseDTO toResponseDTO(AppUser appUser) {
        return new AppUserResponseDTO(
                appUser.getId(),
                appUser.getName(),
                appUser.getEmail(),
                appUser.getCreatedAt()
        );
    }
}