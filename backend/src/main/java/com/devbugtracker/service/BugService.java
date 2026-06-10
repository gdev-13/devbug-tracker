package com.devbugtracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devbugtracker.dto.BugResponseDTO;
import com.devbugtracker.entity.Bug;
import com.devbugtracker.repository.BugRepository;
import com.devbugtracker.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BugService {

    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;
    
    public List<BugResponseDTO> findAll() {
        return bugRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private BugResponseDTO toResponseDTO(Bug bug) {
        return new BugResponseDTO(
                bug.getId(),
                bug.getTitle(),
                bug.getDescription(),
                bug.getErrorMessage(),
                bug.getCodeSnippet(),
                bug.getTechnology(),
                bug.getSeverity(),
                bug.getStatus(),
                bug.getPossibleCause(),
                bug.getSolution(),
                bug.getCreatedAt(),
                bug.getUpdatedAt(),
                bug.getResolvedAt(),
                bug.getProject().getId(),
                bug.getProject().getName()
        );
    }
}