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

import com.devbugtracker.dto.BugRequestDTO;
import com.devbugtracker.dto.BugResponseDTO;
import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;
import com.devbugtracker.service.BugService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bugs")
@RequiredArgsConstructor
public class BugController {

    private final BugService bugService;

    @GetMapping
    public List<BugResponseDTO> findAll() {
        return bugService.findAll();
    }
    
    @GetMapping("/{id}")
    public BugResponseDTO findById(@PathVariable Long id) {
        return bugService.findById(id);
    }
    
    @GetMapping("/status/{status}")
    public List<BugResponseDTO> findByStatus(@PathVariable BugStatus status) {
        return bugService.findByStatus(status);
    }
    
    @GetMapping("/severity/{severity}")
    public List<BugResponseDTO> findBySeverity(@PathVariable BugSeverity severity) {
        return bugService.findBySeverity(severity);
    }
    
    @GetMapping("/technology")
    public List<BugResponseDTO> findByTechnology(@RequestParam String name) {
        return bugService.findByTechnology(name);
    }
    
    @GetMapping("/project/{projectId}")
    public List<BugResponseDTO> findByProject(@PathVariable Long projectId) {
        return bugService.findByProject(projectId);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BugResponseDTO create(@RequestBody @Valid BugRequestDTO requestDTO) {
        return bugService.create(requestDTO);
    }
    
    @PutMapping("/{id}")
    public BugResponseDTO update(
            @PathVariable Long id,
            @RequestBody @Valid BugRequestDTO requestDTO
    ) {
        return bugService.update(id, requestDTO);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bugService.delete(id);
    }
}