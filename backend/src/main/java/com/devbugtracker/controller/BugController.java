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

import com.devbugtracker.dto.BugRequestDTO;
import com.devbugtracker.dto.BugResponseDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;
import com.devbugtracker.exception.UnauthorizedException;
import com.devbugtracker.service.BugService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bugs")
@RequiredArgsConstructor
public class BugController {

    private final BugService bugService;

    @GetMapping
    public List<BugResponseDTO> findAll(Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.findAll(appUser);
    }
    
    @GetMapping("/{id}")
    public BugResponseDTO findById(@PathVariable Long id, Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.findById(id, appUser);
    }
    
    @GetMapping("/status/{status}")
    public List<BugResponseDTO> findByStatus(
            @PathVariable BugStatus status,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.findByStatus(status, appUser);
    }
    
    @GetMapping("/severity/{severity}")
    public List<BugResponseDTO> findBySeverity(
            @PathVariable BugSeverity severity,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.findBySeverity(severity, appUser);
    }
    
    @GetMapping("/technology")
    public List<BugResponseDTO> findByTechnology(
            @RequestParam String name,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.findByTechnology(name, appUser);
    }
    
    @GetMapping("/project/{projectId}")
    public List<BugResponseDTO> findByProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.findByProject(projectId, appUser);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BugResponseDTO create(
            @RequestBody @Valid BugRequestDTO requestDTO,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.create(requestDTO, appUser);
    }
    
    @PutMapping("/{id}")
    public BugResponseDTO update(
            @PathVariable Long id,
            @RequestBody @Valid BugRequestDTO requestDTO,
            Authentication authentication
    ) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return bugService.update(id, requestDTO, appUser);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        bugService.delete(id, appUser);
    }
    
    private AppUser getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser appUser)) {
            throw new UnauthorizedException("Usuário não autenticado");
        }

        return appUser;
    }
}