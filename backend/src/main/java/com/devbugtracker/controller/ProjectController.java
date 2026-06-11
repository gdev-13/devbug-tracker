package com.devbugtracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.dto.ProjectRequestDTO;
import com.devbugtracker.dto.ProjectResponseDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.enums.ProjectStatus;
import com.devbugtracker.exception.UnauthorizedException;
import com.devbugtracker.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectResponseDTO> findAll(Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return projectService.findAll(appUser);
    }

    @GetMapping("/{id}")
    public ProjectResponseDTO findById(@PathVariable Long id, Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return projectService.findById(id, appUser);
    }

    @GetMapping("/status/{status}")
    public List<ProjectResponseDTO> findByStatus(
            @PathVariable ProjectStatus status,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return projectService.findByStatus(status, appUser);
    }

    @GetMapping("/technologies")
    public List<ProjectResponseDTO> findByTechnologies(
            @RequestParam List<String> names,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return projectService.findByTechnologies(names, appUser);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDTO create(
            @RequestBody @Valid ProjectRequestDTO requestDTO,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return projectService.create(requestDTO, appUser);
    }

    @PutMapping("/{id}")
    public ProjectResponseDTO update(
            @PathVariable Long id,
            @RequestBody @Valid ProjectRequestDTO requestDTO,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return projectService.update(id, requestDTO, appUser);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        projectService.delete(id, appUser);
    }

    private AppUser getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser appUser)) {
            throw new UnauthorizedException("Usuário não autenticado");
        }

        return appUser;
    }
}