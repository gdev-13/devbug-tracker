package com.devbugtracker.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devbugtracker.entity.AppUser;
import com.devbugtracker.entity.EmailVerificationToken;
import com.devbugtracker.repository.EmailVerificationTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final long TOKEN_EXPIRATION_HOURS = 24;

    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Transactional
    public void createAndSendVerificationEmail(AppUser user) {
        emailVerificationTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(TOKEN_EXPIRATION_HOURS));

        emailVerificationTokenRepository.save(verificationToken);

        String confirmationLink = buildConfirmationLink(token);

        String subject = "Confirme seu email no DevBug Tracker";

        String body = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Confirme seu email</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 32px 16px;">
                        <tr>
                            <td align="center">
                                <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #111827; border-radius: 18px; padding: 32px; border: 1px solid #1e293b;">
                                    <tr>
                                        <td>
                                            <h1 style="margin: 0 0 16px; color: #f8fafc; font-size: 24px;">
                                                Confirme seu email
                                            </h1>

                                            <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                                Olá, %s!
                                            </p>

                                            <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                                Recebemos uma solicitação de cadastro no <strong style="color: #38bdf8;">DevBug Tracker</strong> usando este endereço de email.
                                            </p>

                                            <p style="margin: 0 0 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                                Para ativar sua conta e começar a organizar seus projetos e bugs, clique no botão abaixo:
                                            </p>

                                            <p style="margin: 0 0 28px; text-align: center;">
                                                <a href="%s"
                                                   style="display: inline-block; padding: 14px 22px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px;">
                                                    Confirmar meu email
                                                </a>
                                            </p>

                                            <p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                                Este link expira em 24 horas e só pode ser utilizado uma vez.
                                            </p>

                                            <p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                                Se o botão não funcionar, copie e cole este endereço no navegador:
                                            </p>

                                            <p style="margin: 0 0 24px; color: #38bdf8; font-size: 13px; line-height: 1.6; word-break: break-all;">
                                                %s
                                            </p>

                                            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                                                Se você não criou uma conta no DevBug Tracker, ignore esta mensagem. Nenhuma ação será necessária.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(user.getName(), confirmationLink, confirmationLink);

        emailService.sendHtmlEmail(user.getEmail(), subject, body);
    }

    private String buildConfirmationLink(String token) {
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);

        return frontendUrl + "/verify-email?token=" + encodedToken;
    }
    
    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token de verificação inválido."));

        if (verificationToken.isUsed()) {
            throw new IllegalArgumentException("Este link de verificação já foi utilizado.");
        }

        if (verificationToken.isExpired()) {
            throw new IllegalArgumentException("Este link de verificação expirou. Solicite um novo link.");
        }

        AppUser user = verificationToken.getUser();

        user.setEmailVerified(true);
        verificationToken.setUsedAt(LocalDateTime.now());
    }
}