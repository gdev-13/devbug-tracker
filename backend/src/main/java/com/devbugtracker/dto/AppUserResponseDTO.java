package com.devbugtracker.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AppUserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String profileImageUrl;
    private LocalDateTime createdAt;
}