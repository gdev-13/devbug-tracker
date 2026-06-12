package com.devbugtracker.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.devbugtracker.exception.BadRequestException;

@Service
public class ProfileImageService {

    @Value("${app.upload.profile-images-dir}")
    private String profileImagesDir;

    @Value("${app.upload.profile-images-url}")
    private String profileImagesUrl;

    public String saveProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("A imagem de perfil é obrigatória");
        }

        String contentType = file.getContentType();
        String extension = getExtensionByContentType(contentType);

        try {
            Path uploadDir = Paths.get(profileImagesDir)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadDir);

            String fileName = UUID.randomUUID() + extension;
            Path targetPath = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), targetPath);

            return profileImagesUrl + "/" + fileName;
        } catch (IOException exception) {
            throw new BadRequestException("Erro ao salvar imagem de perfil");
        }
    }

    public void deleteProfileImage(String profileImageUrl) {
        if (profileImageUrl == null || profileImageUrl.isBlank()) {
            return;
        }

        String expectedPrefix = this.profileImagesUrl + "/";

        if (!profileImageUrl.startsWith(expectedPrefix)) {
            return;
        }

        String fileName = profileImageUrl.substring(expectedPrefix.length());

        try {
            Path imagePath = Paths.get(profileImagesDir)
                    .toAbsolutePath()
                    .normalize()
                    .resolve(fileName);

            Files.deleteIfExists(imagePath);
        } catch (IOException exception) {
            // Se não conseguir apagar a imagem antiga, não bloqueia a atualização do usuário.
        }
    }

    private String getExtensionByContentType(String contentType) {
        if ("image/jpeg".equals(contentType)) {
            return ".jpg";
        }

        if ("image/png".equals(contentType)) {
            return ".png";
        }

        if ("image/webp".equals(contentType)) {
            return ".webp";
        }

        throw new BadRequestException("Formato de imagem inválido. Use JPG, PNG ou WEBP");
    }
}