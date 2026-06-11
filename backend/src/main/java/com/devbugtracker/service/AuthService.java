package com.devbugtracker.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devbugtracker.dto.AppUserResponseDTO;
import com.devbugtracker.dto.AuthResponseDTO;
import com.devbugtracker.dto.LoginRequestDTO;
import com.devbugtracker.dto.RegisterRequestDTO;
import com.devbugtracker.dto.UpdateUserRequestDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.exception.BadRequestException;
import com.devbugtracker.exception.ResourceNotFoundException;
import com.devbugtracker.repository.AppUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthResponseDTO register(RegisterRequestDTO requestDTO) {
        if (appUserRepository.existsByEmail(requestDTO.getEmail())) {
            throw new BadRequestException("Email já cadastrado");
        }

        AppUser appUser = new AppUser();

        appUser.setName(requestDTO.getName());
        appUser.setEmail(requestDTO.getEmail());
        appUser.setPassword(passwordEncoder.encode(requestDTO.getPassword()));

        AppUser savedUser = appUserRepository.save(appUser);

        String token = tokenService.generateToken(savedUser);

        return new AuthResponseDTO(
                token,
                "Bearer",
                toResponseDTO(savedUser)
        );
    }

    private AppUserResponseDTO toResponseDTO(AppUser appUser) {
        return new AppUserResponseDTO(
                appUser.getId(),
                appUser.getName(),
                appUser.getEmail(),
                appUser.getCreatedAt()
        );
    }
    
    public AuthResponseDTO login(LoginRequestDTO requestDTO) {
        AppUser appUser = appUserRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(() -> new BadRequestException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(requestDTO.getPassword(), appUser.getPassword())) {
            throw new BadRequestException("Email ou senha inválidos");
        }

        String token = tokenService.generateToken(appUser);

        return new AuthResponseDTO(
                token,
                "Bearer",
                toResponseDTO(appUser)
        );
    }
    
    public AppUserResponseDTO getAuthenticatedUser(AppUser appUser) {
        return toResponseDTO(appUser);
    }
    
    public AppUserResponseDTO updateAuthenticatedUser(AppUser authenticatedUser, UpdateUserRequestDTO requestDTO) {
        AppUser appUser = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        appUser.setName(requestDTO.getName());

        AppUser updatedUser = appUserRepository.save(appUser);

        return toResponseDTO(updatedUser);
    }
}