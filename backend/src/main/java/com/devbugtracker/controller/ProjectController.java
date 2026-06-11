package com.devbugtracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.devbugtracker.dto.ProjectRequestDTO;
import com.devbugtracker.dto.ProjectResponseDTO;
import com.devbugtracker.enums.ProjectStatus;
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
	
	@GetMapping("/{id}")
	public ProjectResponseDTO findById(@PathVariable Long id) {
	    return projectService.findById(id);
	}
	
	@GetMapping("/status/{status}")
	public List<ProjectResponseDTO> findByStatus(@PathVariable ProjectStatus status) {
	    return projectService.findByStatus(status);
	}
	
	@GetMapping("/technologies")
	public List<ProjectResponseDTO> findByTechnologies(@RequestParam List<String> names) {
	    return projectService.findByTechnologies(names);
	}
	
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDTO create(@RequestBody @Valid ProjectRequestDTO requestDTO) {
        return projectService.create(requestDTO);
    }
    
    @PutMapping("/{id}")
    public ProjectResponseDTO update(
            @PathVariable Long id,
            @RequestBody @Valid ProjectRequestDTO requestDTO
    ) {
        return projectService.update(id, requestDTO);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }
}
