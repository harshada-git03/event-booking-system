package com.harshada.eventbooking.service;

import com.harshada.eventbooking.entity.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Confirmed - " + booking.getEvent().getTitle());
            helper.setText(buildBookingEmail(booking), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendCancellationEmail(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Cancelled - " + booking.getEvent().getTitle());
            helper.setText(buildCancellationEmail(booking), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    private String buildBookingEmail(Booking booking) {
        return "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #2e7d32;'>Booking Confirmed! 🎉</h2>"
                + "<p>Hi <b>" + booking.getUser().getName() + "</b>,</p>"
                + "<p>Your booking has been confirmed. Here are your details:</p>"
                + "<table style='border-collapse: collapse; width: 100%;'>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Booking Code</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getBookingCode() + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Event</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getEvent().getTitle() + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Venue</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getEvent().getVenue() + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Date</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getEvent().getEventDate() + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Quantity</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getQuantity() + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Total Amount</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>₹" + booking.getTotalAmount() + "</td></tr>"
                + "</table>"
                + "<p style='margin-top: 20px;'>Thank you for booking with us!</p>"
                + "<p style='color: #888;'>Event Booking System</p>"
                + "</div>";
    }

    private String buildCancellationEmail(Booking booking) {
        return "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #c62828;'>Booking Cancelled</h2>"
                + "<p>Hi <b>" + booking.getUser().getName() + "</b>,</p>"
                + "<p>Your booking has been cancelled successfully.</p>"
                + "<table style='border-collapse: collapse; width: 100%;'>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Booking Code</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getBookingCode() + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Event</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getEvent().getTitle() + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Date</b></td>"
                + "<td style='padding: 8px; border: 1px solid #ddd;'>" + booking.getEvent().getEventDate() + "</td></tr>"
                + "</table>"
                + "<p style='margin-top: 20px;'>We hope to see you at future events!</p>"
                + "<p style='color: #888;'>Event Booking System</p>"
                + "</div>";
    }
}
