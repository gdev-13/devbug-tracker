package com.devbugtracker.service;

import org.springframework.stereotype.Service;

import com.devbugtracker.dto.DashboardResponseDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;
import com.devbugtracker.enums.ProjectStatus;
import com.devbugtracker.repository.BugRepository;
import com.devbugtracker.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final BugRepository bugRepository;

    public DashboardResponseDTO getDashboard(AppUser appUser) {
        return new DashboardResponseDTO(
                projectRepository.countByUser(appUser),
                projectRepository.countByUserAndStatus(appUser, ProjectStatus.IN_PROGRESS),
                projectRepository.countByUserAndStatus(appUser, ProjectStatus.COMPLETED),
                projectRepository.countByUserAndStatus(appUser, ProjectStatus.PAUSED),

                bugRepository.countByProject_User(appUser),
                bugRepository.countByProject_UserAndStatus(appUser, BugStatus.OPEN),
                bugRepository.countByProject_UserAndStatus(appUser, BugStatus.IN_PROGRESS),
                bugRepository.countByProject_UserAndStatus(appUser, BugStatus.RESOLVED),

                bugRepository.countByProject_UserAndSeverity(appUser, BugSeverity.LOW),
                bugRepository.countByProject_UserAndSeverity(appUser, BugSeverity.MEDIUM),
                bugRepository.countByProject_UserAndSeverity(appUser, BugSeverity.HIGH),
                bugRepository.countByProject_UserAndSeverity(appUser, BugSeverity.CRITICAL)
        );
    }
}