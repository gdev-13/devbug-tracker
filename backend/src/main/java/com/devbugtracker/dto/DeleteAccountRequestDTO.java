package com.devbugtracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteAccountRequestDTO {

    @NotBlank(message = "Senha é obrigatória")
    private String password;
}