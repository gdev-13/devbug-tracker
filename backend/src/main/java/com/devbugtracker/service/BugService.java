package com.devbugtracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devbugtracker.dto.BugRequestDTO;
import com.devbugtracker.dto.BugResponseDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.entity.Bug;
import com.devbugtracker.entity.Project;
import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;
import com.devbugtracker.exception.BadRequestException;
import com.devbugtracker.exception.ResourceNotFoundException;
import com.devbugtracker.repository.BugRepository;
import com.devbugtracker.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BugService {

    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;
    
    public List<BugResponseDTO> findAll(AppUser appUser) {
        return bugRepository.findByProject_User(appUser)
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
    
    public BugResponseDTO findById(Long id, AppUser appUser) {
        Bug bug = findBugByIdAndUser(id, appUser);
        return toResponseDTO(bug);
    }
    
    private Bug findBugByIdAndUser(Long id, AppUser appUser) {
        return bugRepository.findByIdAndProject_User(id, appUser)
                .orElseThrow(() -> new ResourceNotFoundException("Bug não encontrado"));
    }
    
    public List<BugResponseDTO> findByStatus(BugStatus status, AppUser appUser) {
        return bugRepository.findByProject_UserAndStatus(appUser, status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    public List<BugResponseDTO> findBySeverity(BugSeverity severity, AppUser appUser) {
        return bugRepository.findByProject_UserAndSeverity(appUser, severity)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    public List<BugResponseDTO> findByTechnology(String technology, AppUser appUser) {
        if (technology == null || technology.isBlank()) {
            throw new BadRequestException("Informe uma tecnologia para filtrar os bugs");
        }

        return bugRepository.findByProject_UserAndTechnologyIgnoreCase(appUser, technology)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    public BugResponseDTO create(BugRequestDTO requestDTO, AppUser appUser) {
        Project project = findProjectByIdAndUser(requestDTO.getProjectId(), appUser);

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
    
    public List<BugResponseDTO> findByProject(Long projectId, AppUser appUser) {
        Project project = findProjectByIdAndUser(projectId, appUser);

        return bugRepository.findByProject(project)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    private Project findProjectByIdAndUser(Long id, AppUser appUser) {
        return projectRepository.findByIdAndUser(id, appUser)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
    }
    
    public BugResponseDTO update(Long id, BugRequestDTO requestDTO, AppUser appUser) {
        Bug bug = findBugByIdAndUser(id, appUser);
        Project project = findProjectByIdAndUser(requestDTO.getProjectId(), appUser);

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
    
    public void delete(Long id, AppUser appUser) {
        Bug bug = findBugByIdAndUser(id, appUser);
        bugRepository.delete(bug);
    }
}