package com.devbugtracker.config;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.devbugtracker.exception.ErrorResponse;
import com.devbugtracker.security.AuthTokenFilter;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;
    private final ObjectMapper objectMapper;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/register", "/auth/login", "/auth/verify-email").permitAll()
                        .requestMatchers("/uploads/profile-images/**").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, _) -> {
                            ErrorResponse errorResponse = new ErrorResponse(
                                    LocalDateTime.now(),
                                    HttpStatus.UNAUTHORIZED.value(),
                                    "Unauthorized",
                                    "Usuário não autenticado",
                                    request.getRequestURI()
                            );

                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            objectMapper.writeValue(response.getWriter(), errorResponse);
                        })
                        .accessDeniedHandler((request, response, _) -> {
                            ErrorResponse errorResponse = new ErrorResponse(
                                    LocalDateTime.now(),
                                    HttpStatus.FORBIDDEN.value(),
                                    "Forbidden",
                                    "Acesso negado",
                                    request.getRequestURI()
                            );

                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            objectMapper.writeValue(response.getWriter(), errorResponse);
                        })
                )
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}