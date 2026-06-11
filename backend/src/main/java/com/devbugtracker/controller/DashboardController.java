package com.devbugtracker.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.dto.DashboardResponseDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.exception.UnauthorizedException;
import com.devbugtracker.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public DashboardResponseDTO getDashboard(Authentication authentication) {
        AppUser appUser = getAuthenticatedUser(authentication);
        return dashboardService.getDashboard(appUser);
    }

    private AppUser getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser appUser)) {
            throw new UnauthorizedException("Usuário não autenticado");
        }

        return appUser;
    }
}