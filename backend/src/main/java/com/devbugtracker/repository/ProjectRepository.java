package com.devbugtracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devbugtracker.entity.Project;
import com.devbugtracker.enums.ProjectStatus;

public interface ProjectRepository extends JpaRepository <Project, Long> {

	List<Project> findByStatus(ProjectStatus status);
}
