package com.devbugtracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devbugtracker.dto.ProjectRequestDTO;
import com.devbugtracker.dto.ProjectResponseDTO;
import com.devbugtracker.entity.Project;
import com.devbugtracker.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

	private final ProjectRepository projectRepository;
	
    public List<ProjectResponseDTO> findAll() {
        return projectRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private ProjectResponseDTO toResponseDTO(Project project) {
        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getTechnologies(),
                project.getStatus(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
    
    public ProjectResponseDTO create(ProjectRequestDTO requestDTO) {
        Project project = new Project();

        project.setName(requestDTO.getName());
        project.setDescription(requestDTO.getDescription());
        project.setTechnologies(requestDTO.getTechnologies());

        if (requestDTO.getStatus() != null) {
            project.setStatus(requestDTO.getStatus());
        }

        Project savedProject = projectRepository.save(project);

        return toResponseDTO(savedProject);
    }
}
