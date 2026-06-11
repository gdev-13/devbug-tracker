package com.devbugtracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devbugtracker.dto.ProjectRequestDTO;
import com.devbugtracker.dto.ProjectResponseDTO;
import com.devbugtracker.entity.Project;
import com.devbugtracker.enums.ProjectStatus;
import com.devbugtracker.exception.BadRequestException;
import com.devbugtracker.exception.ResourceNotFoundException;
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
    
    public ProjectResponseDTO findById(Long id) {
        Project project = findProjectById(id);
        return toResponseDTO(project);
    }
    
    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
    }
    
    public List<ProjectResponseDTO> findByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }
    
    public List<ProjectResponseDTO> findByTechnologies(List<String> technologies) {
        if (technologies == null || technologies.isEmpty() || technologies.stream().allMatch(String::isBlank)) {
            throw new BadRequestException("Informe pelo menos uma tecnologia para filtrar os projetos");
        }

        return projectRepository.findAll()
                .stream()
                .filter(project -> containsAllTechnologies(project.getTechnologies(), technologies))
                .map(this::toResponseDTO)
                .toList();
    }
    
    private boolean containsAllTechnologies(String projectTechnologies, List<String> selectedTechnologies) {
        if (projectTechnologies == null || projectTechnologies.isBlank()) {
            return false;
        }

        List<String> projectTechnologyList = List.of(projectTechnologies.split(","))
                .stream()
                .map(technology -> technology.trim().toLowerCase())
                .toList();

        return selectedTechnologies.stream()
                .map(technology -> technology.trim().toLowerCase())
                .allMatch(projectTechnologyList::contains);
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
    
    public ProjectResponseDTO update(Long id, ProjectRequestDTO requestDTO) {
        Project project = findProjectById(id);

        project.setName(requestDTO.getName());
        project.setDescription(requestDTO.getDescription());
        project.setTechnologies(requestDTO.getTechnologies());

        if (requestDTO.getStatus() != null) {
            project.setStatus(requestDTO.getStatus());
        }

        Project updatedProject = projectRepository.save(project);

        return toResponseDTO(updatedProject);
    }
    
    public void delete(Long id) {
        Project project = findProjectById(id);
        projectRepository.delete(project);
    }
}
