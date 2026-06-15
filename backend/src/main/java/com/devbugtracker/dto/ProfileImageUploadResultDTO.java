package com.devbugtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileImageUploadResultDTO {

    private String imageUrl;
    private String publicId;
}