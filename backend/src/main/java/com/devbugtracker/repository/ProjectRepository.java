package com.devbugtracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devbugtracker.entity.AppUser;
import com.devbugtracker.entity.Project;
import com.devbugtracker.enums.ProjectStatus;

public interface ProjectRepository extends JpaRepository <Project, Long> {

    List<Project> findByUser(AppUser user);

    Optional<Project> findByIdAndUser(Long id, AppUser user);

    List<Project> findByUserAndStatus(AppUser user, ProjectStatus status);
}
