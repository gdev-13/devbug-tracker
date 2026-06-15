package com.devbugtracker.service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.devbugtracker.dto.ProfileImageUploadResultDTO;
import com.devbugtracker.exception.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileImageService {

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;

    private final Cloudinary cloudinary;

    public ProfileImageUploadResultDTO saveProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("A imagem de perfil é obrigatória");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("A imagem deve ter no máximo 2MB");
        }

        validateContentType(file.getContentType());

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "devbug-tracker/profile-images",
                            "public_id", UUID.randomUUID().toString(),
                            "resource_type", "image",
                            "overwrite", false
                    )
            );

            String imageUrl = String.valueOf(uploadResult.get("secure_url"));
            String publicId = String.valueOf(uploadResult.get("public_id"));

            return new ProfileImageUploadResultDTO(imageUrl, publicId);
        } catch (IOException exception) {
            throw new BadRequestException("Erro ao enviar imagem de perfil");
        }
    }

    public void deleteProfileImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        try {
            cloudinary.uploader().destroy(
                    publicId,
                    Map.of("resource_type", "image")
            );
        } catch (IOException exception) {
            // Se não conseguir apagar a imagem antiga, não bloqueia a operação do usuário.
        }
    }

    private void validateContentType(String contentType) {
        if (
                !"image/jpeg".equals(contentType)
                && !"image/png".equals(contentType)
                && !"image/webp".equals(contentType)
        ) {
            throw new BadRequestException("Formato de imagem inválido. Use JPG, PNG ou WEBP");
        }
    }
}