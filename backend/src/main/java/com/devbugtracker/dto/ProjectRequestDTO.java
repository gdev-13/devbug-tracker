package com.devbugtracker.dto;

import com.devbugtracker.enums.ProjectStatus;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectRequestDTO {

    @NotBlank(message = "O nome do projeto é obrigatório")
    private String name;
    private String description;
    @NotBlank(message = "As tecnologias do projeto são obrigatórias")
    private String technologies;
    private ProjectStatus status;
}