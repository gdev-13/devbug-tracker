package com.devbugtracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devbugtracker.entity.Bug;
import com.devbugtracker.entity.Project;
import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;

public interface BugRepository extends JpaRepository<Bug, Long> {

    List<Bug> findByProject(Project project);

    List<Bug> findByStatus(BugStatus status);

    List<Bug> findBySeverity(BugSeverity severity);

    List<Bug> findByTechnologyIgnoreCase(String technology);
}