package com.devbugtracker.dto;

import java.time.LocalDateTime;

import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BugResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String errorMessage;
    private String codeSnippet;
    private String technology;
    private BugSeverity severity;
    private BugStatus status;
    private String possibleCause;
    private String solution;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    private Long projectId;
    private String projectName;
}