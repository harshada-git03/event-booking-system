package com.harshada.eventbooking.service;

import com.harshada.eventbooking.entity.Booking;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfTicketService {

    public byte[] generateTicket(Booking booking) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A5);
            PdfWriter.getInstance(document, out);
            document.open();

            
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, new BaseColor(46, 125, 50));
            Font headingFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.DARK_GRAY);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.BLACK);
            Font smallFont = new Font(Font.FontFamily.HELVETICA, 9, Font.ITALIC, BaseColor.GRAY);
            Font codeFont = new Font(Font.FontFamily.COURIER, 10, Font.BOLD, new BaseColor(198, 40, 40));

            
            Paragraph title = new Paragraph("🎟 EVENT TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

           
            document.add(new Paragraph("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", smallFont));

            
            Paragraph eventName = new Paragraph(booking.getEvent().getTitle(), headingFont);
            eventName.setAlignment(Element.ALIGN_CENTER);
            eventName.setSpacingBefore(10);
            eventName.setSpacingAfter(10);
            document.add(eventName);

            
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(10);
            table.setWidths(new float[]{1.5f, 2.5f});

            addTableRow(table, "Attendee", booking.getUser().getName(), normalFont);
            addTableRow(table, "Email", booking.getUser().getEmail(), normalFont);
            addTableRow(table, "Venue", booking.getEvent().getVenue(), normalFont);
            addTableRow(table, "Date", booking.getEvent().getEventDate().toString(), normalFont);
            addTableRow(table, "Category", booking.getEvent().getCategory(), normalFont);
            addTableRow(table, "Quantity", booking.getQuantity().toString() + " ticket(s)", normalFont);
            addTableRow(table, "Total Amount", "₹" + booking.getTotalAmount(), normalFont);
            addTableRow(table, "Status", booking.getStatus(), normalFont);
            addTableRow(table, "Booked On", booking.getBookingTime().toLocalDate().toString(), normalFont);

            document.add(table);

            
            document.add(new Paragraph("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", smallFont));

            
            Paragraph bookingCode = new Paragraph("Booking Code: " + booking.getBookingCode(), codeFont);
            bookingCode.setAlignment(Element.ALIGN_CENTER);
            bookingCode.setSpacingBefore(10);
            document.add(bookingCode);

            
            Paragraph footer = new Paragraph("Please carry this ticket to the event. Thank you!", smallFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(15);
            document.add(footer);

            Paragraph brand = new Paragraph("Event Booking System", smallFont);
            brand.setAlignment(Element.ALIGN_CENTER);
            document.add(brand);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF ticket: " + e.getMessage());
        }
    }

    private void addTableRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD)));
        labelCell.setBorderColor(BaseColor.LIGHT_GRAY);
        labelCell.setPadding(6);
        labelCell.setBackgroundColor(new BaseColor(245, 245, 245));

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setBorderColor(BaseColor.LIGHT_GRAY);
        valueCell.setPadding(6);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}