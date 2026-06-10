package com.devbugtracker.dto;

import java.time.LocalDateTime;

import com.devbugtracker.enums.ProjectStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProjectResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String technologies;
    private ProjectStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}