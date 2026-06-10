package com.devbugtracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.dto.BugRequestDTO;
import com.devbugtracker.dto.BugResponseDTO;
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
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BugResponseDTO create(@RequestBody @Valid BugRequestDTO requestDTO) {
        return bugService.create(requestDTO);
    }
}