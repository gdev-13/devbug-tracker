package com.devbugtracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.dto.ProjectResponseDTO;
import com.devbugtracker.service.ProjectService;

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
}
