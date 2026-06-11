package com.devbugtracker.dto;

import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BugRequestDTO {

    @NotBlank(message = "O título do bug é obrigatório")
    private String title;
    private String description;
    private String errorMessage;
    private String codeSnippet;
    @NotBlank(message = "A tecnologia do bug é obrigatória")
    private String technology;
    private BugSeverity severity;
    private BugStatus status;
    private String possibleCause;
    private String solution;
    @NotNull(message = "O projeto relacionado ao bug é obrigatório")
    private Long projectId;
}