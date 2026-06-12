package com.devbugtracker.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.devbugtracker.dto.AppUserResponseDTO;
import com.devbugtracker.dto.AuthResponseDTO;
import com.devbugtracker.dto.LoginRequestDTO;
import com.devbugtracker.dto.RegisterRequestDTO;
import com.devbugtracker.dto.UpdatePasswordRequestDTO;
import com.devbugtracker.dto.UpdateUserRequestDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.entity.Bug;
import com.devbugtracker.entity.Project;
import com.devbugtracker.exception.BadRequestException;
import com.devbugtracker.exception.ResourceNotFoundException;
import com.devbugtracker.repository.AppUserRepository;
import com.devbugtracker.repository.BugRepository;
import com.devbugtracker.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final ProfileImageService profileImageService;
    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;

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
                appUser.getProfileImageUrl(),
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
    
    public void updatePassword(AppUser authenticatedUser, UpdatePasswordRequestDTO requestDTO) {
        AppUser appUser = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(requestDTO.getCurrentPassword(), appUser.getPassword())) {
            throw new BadRequestException("Senha atual inválida");
        }

        if (!requestDTO.getNewPassword().equals(requestDTO.getConfirmPassword())) {
            throw new BadRequestException("A nova senha e a confirmação não correspondem");
        }

        appUser.setPassword(passwordEncoder.encode(requestDTO.getNewPassword()));

        appUserRepository.save(appUser);
    }
    
    public AppUserResponseDTO updateProfileImage(AppUser authenticatedUser, MultipartFile file) {
        AppUser appUser = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        String oldProfileImageUrl = appUser.getProfileImageUrl();

        String profileImageUrl = profileImageService.saveProfileImage(file);

        appUser.setProfileImageUrl(profileImageUrl);

        AppUser updatedUser = appUserRepository.save(appUser);

        profileImageService.deleteProfileImage(oldProfileImageUrl);

        return toResponseDTO(updatedUser);
    }
    
    public AppUserResponseDTO deleteProfileImage(AppUser authenticatedUser) {
        AppUser appUser = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        String profileImageUrl = appUser.getProfileImageUrl();

        if (profileImageUrl == null || profileImageUrl.isBlank()) {
            throw new BadRequestException("Usuário não possui foto de perfil");
        }

        appUser.setProfileImageUrl(null);

        AppUser updatedUser = appUserRepository.save(appUser);

        profileImageService.deleteProfileImage(profileImageUrl);

        return toResponseDTO(updatedUser);
    }
    
    @Transactional
    public void deleteAuthenticatedUser(AppUser authenticatedUser) {
        AppUser appUser = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        String profileImageUrl = appUser.getProfileImageUrl();

        List<Bug> bugs = bugRepository.findByProject_User(appUser);
        bugRepository.deleteAll(bugs);

        List<Project> projects = projectRepository.findByUser(appUser);
        projectRepository.deleteAll(projects);

        appUserRepository.delete(appUser);

        profileImageService.deleteProfileImage(profileImageUrl);
    }
}