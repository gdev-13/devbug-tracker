package com.devbugtracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,}$",
            message = "Informe um email válido, como nome@dominio.com"
    )
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    private String password;
}