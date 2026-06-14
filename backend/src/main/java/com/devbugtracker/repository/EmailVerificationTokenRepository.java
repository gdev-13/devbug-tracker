package com.devbugtracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devbugtracker.entity.AppUser;
import com.devbugtracker.entity.EmailVerificationToken;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByUser(AppUser user);
}