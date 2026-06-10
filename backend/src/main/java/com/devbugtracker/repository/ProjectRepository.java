package com.devbugtracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devbugtracker.entity.Project;

public interface ProjectRepository extends JpaRepository <Project, Long> {

}
