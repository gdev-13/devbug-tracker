package com.devbugtracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.dto.ProjectRequestDTO;
import com.devbugtracker.dto.ProjectResponseDTO;
import com.devbugtracker.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

	private final ProjectService projectService;
	
	@GetMapping
    public List<ProjectResponseDTO> findAll() {
        return projectService.findAll();
    }
	
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDTO create(@RequestBody @Valid ProjectRequestDTO requestDTO) {
        return projectService.create(requestDTO);
    }
}
