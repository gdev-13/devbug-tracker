package com.devbugtracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${app.mail.from}")
    private String mailFrom;

    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            javaMailSender.send(message);
        } catch (MessagingException | MailException exception) {
            throw new IllegalStateException("Não foi possível enviar o email.", exception);
        }
    }
}