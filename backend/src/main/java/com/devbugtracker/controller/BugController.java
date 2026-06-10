package com.devbugtracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devbugtracker.dto.BugResponseDTO;
import com.devbugtracker.service.BugService;

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
}