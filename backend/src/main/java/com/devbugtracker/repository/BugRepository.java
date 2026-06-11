package com.devbugtracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devbugtracker.entity.AppUser;
import com.devbugtracker.entity.Bug;
import com.devbugtracker.entity.Project;
import com.devbugtracker.enums.BugSeverity;
import com.devbugtracker.enums.BugStatus;

public interface BugRepository extends JpaRepository<Bug, Long> {

    List<Bug> findByProject(Project project);

    List<Bug> findByProject_User(AppUser user);

    Optional<Bug> findByIdAndProject_User(Long id, AppUser user);

    List<Bug> findByProject_UserAndStatus(AppUser user, BugStatus status);

    List<Bug> findByProject_UserAndSeverity(AppUser user, BugSeverity severity);

    List<Bug> findByProject_UserAndTechnologyIgnoreCase(AppUser user, String technology);
}