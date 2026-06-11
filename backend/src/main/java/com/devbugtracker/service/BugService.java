package com.devbugtracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devbugtracker.dto.BugRequestDTO;
import com.devbugtracker.dto.BugResponseDTO;
import com.devbugtracker.entity.Bug;
import com.devbugtracker.entity.Project;
import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;
import com.devbugtracker.exception.ResourceNotFoundException;
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
    
    public BugResponseDTO findById(Long id) {
        Bug bug = findBugById(id);
        return toResponseDTO(bug);
    }
    
    private Bug findBugById(Long id) {
        return bugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bug não encontrado"));
    }
    
    public List<BugResponseDTO> findByStatus(BugStatus status) {
        return bugRepository.findByStatus(status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    public List<BugResponseDTO> findBySeverity(BugSeverity severity) {
        return bugRepository.findBySeverity(severity)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    public List<BugResponseDTO> findByTechnology(String technology) {
        return bugRepository.findByTechnologyIgnoreCase(technology)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    public BugResponseDTO create(BugRequestDTO requestDTO) {
        Project project = findProjectById(requestDTO.getProjectId());

        Bug bug = new Bug();

        bug.setTitle(requestDTO.getTitle());
        bug.setDescription(requestDTO.getDescription());
        bug.setErrorMessage(requestDTO.getErrorMessage());
        bug.setCodeSnippet(requestDTO.getCodeSnippet());
        bug.setTechnology(requestDTO.getTechnology());
        bug.setPossibleCause(requestDTO.getPossibleCause());
        bug.setSolution(requestDTO.getSolution());
        bug.setProject(project);

        if (requestDTO.getSeverity() != null) {
            bug.setSeverity(requestDTO.getSeverity());
        }

        if (requestDTO.getStatus() != null) {
            bug.setStatus(requestDTO.getStatus());
        }

        Bug savedBug = bugRepository.save(bug);

        return toResponseDTO(savedBug);
    }
    
    public List<BugResponseDTO> findByProject(Long projectId) {
        Project project = findProjectById(projectId);

        return bugRepository.findByProject(project)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
    }
    
    public BugResponseDTO update(Long id, BugRequestDTO requestDTO) {
        Bug bug = findBugById(id);
        Project project = findProjectById(requestDTO.getProjectId());

        bug.setTitle(requestDTO.getTitle());
        bug.setDescription(requestDTO.getDescription());
        bug.setErrorMessage(requestDTO.getErrorMessage());
        bug.setCodeSnippet(requestDTO.getCodeSnippet());
        bug.setTechnology(requestDTO.getTechnology());
        bug.setPossibleCause(requestDTO.getPossibleCause());
        bug.setSolution(requestDTO.getSolution());
        bug.setProject(project);

        if (requestDTO.getSeverity() != null) {
            bug.setSeverity(requestDTO.getSeverity());
        }

        if (requestDTO.getStatus() != null) {
            bug.setStatus(requestDTO.getStatus());
        }

        Bug updatedBug = bugRepository.save(bug);

        return toResponseDTO(updatedBug);
    }
    
    public void delete(Long id) {
        Bug bug = findBugById(id);
        bugRepository.delete(bug);
    }
}