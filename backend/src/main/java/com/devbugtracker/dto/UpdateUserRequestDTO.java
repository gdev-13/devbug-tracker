package com.devbugtracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequestDTO {

	@NotBlank(message = "o nome é obrigatório")
	private String name;
}
