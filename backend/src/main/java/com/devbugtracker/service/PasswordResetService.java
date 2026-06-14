package com.devbugtracker.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devbugtracker.dto.ForgotPasswordRequestDTO;
import com.devbugtracker.dto.MessageResponseDTO;
import com.devbugtracker.dto.ResetPasswordRequestDTO;
import com.devbugtracker.entity.AppUser;
import com.devbugtracker.entity.PasswordResetToken;
import com.devbugtracker.exception.BadRequestException;
import com.devbugtracker.repository.AppUserRepository;
import com.devbugtracker.repository.PasswordResetTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final long TOKEN_EXPIRATION_HOURS = 1;

    private final AppUserRepository appUserRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Transactional
    public MessageResponseDTO requestPasswordReset(ForgotPasswordRequestDTO requestDTO) {
        String email = requestDTO.getEmail().trim().toLowerCase();

        Optional<AppUser> optionalUser = appUserRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();

            if (user.isEmailVerified()) {
                createAndSendPasswordResetEmail(user);
            }
        }

        return new MessageResponseDTO(
                "Se o email estiver cadastrado, enviaremos instruções para redefinir sua senha."
        );
    }

    @Transactional
    public MessageResponseDTO resetPassword(ResetPasswordRequestDTO requestDTO) {
        if (!requestDTO.getNewPassword().equals(requestDTO.getConfirmPassword())) {
            throw new BadRequestException("A nova senha e a confirmação não correspondem");
        }

        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(requestDTO.getToken())
                .orElseThrow(() -> new BadRequestException("Token de recuperação inválido."));

        if (passwordResetToken.isUsed()) {
            throw new BadRequestException("Este link de recuperação já foi utilizado.");
        }

        if (passwordResetToken.isExpired()) {
            throw new BadRequestException("Este link de recuperação expirou. Solicite um novo link.");
        }

        AppUser user = passwordResetToken.getUser();

        user.setPassword(passwordEncoder.encode(requestDTO.getNewPassword()));
        passwordResetToken.setUsedAt(LocalDateTime.now());

        return new MessageResponseDTO("Senha redefinida com sucesso.");
    }

    private void createAndSendPasswordResetEmail(AppUser user) {
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();

        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setToken(token);
        passwordResetToken.setUser(user);
        passwordResetToken.setExpiresAt(LocalDateTime.now().plusHours(TOKEN_EXPIRATION_HOURS));

        passwordResetTokenRepository.save(passwordResetToken);

        String resetLink = buildResetPasswordLink(token);

        String subject = "Redefina sua senha no DevBug Tracker";

        String body = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Redefina sua senha</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 32px 16px;">
                        <tr>
                            <td align="center">
                                <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #111827; border-radius: 18px; padding: 32px; border: 1px solid #1e293b;">
                                    <tr>
                                        <td>
                                            <h1 style="margin: 0 0 16px; color: #f8fafc; font-size: 24px;">
                                                Redefinição de senha
                                            </h1>

                                            <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                                Olá, %s!
                                            </p>

                                            <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                                Recebemos uma solicitação para redefinir a senha da sua conta no <strong style="color: #38bdf8;">DevBug Tracker</strong>.
                                            </p>

                                            <p style="margin: 0 0 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                                Para criar uma nova senha, clique no botão abaixo:
                                            </p>

                                            <p style="margin: 0 0 28px; text-align: center;">
                                                <a href="%s"
                                                   style="display: inline-block; padding: 14px 22px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px;">
                                                    Redefinir minha senha
                                                </a>
                                            </p>

                                            <p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                                Este link expira em 1 hora e só pode ser utilizado uma vez.
                                            </p>

                                            <p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                                Se o botão não funcionar, copie e cole este endereço no navegador:
                                            </p>

                                            <p style="margin: 0 0 24px; color: #38bdf8; font-size: 13px; line-height: 1.6; word-break: break-all;">
                                                %s
                                            </p>

                                            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                                                Se você não solicitou a redefinição de senha, ignore esta mensagem. Sua senha atual continuará a mesma.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(escapeHtml(user.getName()), resetLink, resetLink);

        emailService.sendHtmlEmail(user.getEmail(), subject, body);
    }

    private String buildResetPasswordLink(String token) {
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);

        return frontendUrl + "/reset-password?token=" + encodedToken;
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}