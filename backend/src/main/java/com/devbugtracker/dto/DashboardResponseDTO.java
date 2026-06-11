package com.devbugtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponseDTO {

    private long totalProjects;
    private long projectsInProgress;
    private long projectsCompleted;
    private long projectsPaused;

    private long totalBugs;
    private long openBugs;
    private long inProgressBugs;
    private long resolvedBugs;

    private long lowSeverityBugs;
    private long mediumSeverityBugs;
    private long highSeverityBugs;
    private long criticalSeverityBugs;
}