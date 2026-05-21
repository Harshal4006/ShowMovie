const { Resend } = require('resend');
const generateBookingConfirmedEmail = require('../EmailTemplates/BookingConfirmedTemplate');
const generateBookingPendingEmail = require('../EmailTemplates/BookingPendingTemplate');
const generateBookingFailedEmail = require('../EmailTemplates/BookingFailedTemplate');
const generateNewShowAddedEmail = require('../EmailTemplates/NewShowAddedTemplate');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ShowMovie <onboarding@resend.dev>';

class EmailService {
  async sendBookingConfirmed(data) {
    if (!resend) {
      console.log('[EmailService] Resend not configured, skipping confirmed email');
      return { success: false, reason: 'Resend not configured' };
    }

    const html = generateBookingConfirmedEmail(data);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Booking Confirmed - ShowMovie',
      html,
    });

    console.log('[EmailService] Confirmed email sent to', data.userEmail, '- ID:', result.data?.id);
    return { success: true, emailId: result.data?.id };
  }

  async sendBookingPending(data) {
    if (!resend) {
      console.log('[EmailService] Resend not configured, skipping pending email');
      return { success: false, reason: 'Resend not configured' };
    }

    const html = generateBookingPendingEmail(data);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Your Booking is Pending',
      html,
    });

    console.log('[EmailService] Pending email sent to', data.userEmail, '- ID:', result.data?.id);
    return { success: true, emailId: result.data?.id };
  }

  async sendBookingFailed(data) {
    if (!resend) {
      console.log('[EmailService] Resend not configured, skipping failed email');
      return { success: false, reason: 'Resend not configured' };
    }

    const html = generateBookingFailedEmail(data);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: 'Booking Failed - Payment Unsuccessful',
      html,
    });

    console.log('[EmailService] Failed email sent to', data.userEmail, '- ID:', result.data?.id);
    return { success: true, emailId: result.data?.id };
  }

  async sendNewShowAdded(data) {
    if (!resend) {
      console.log('[EmailService] Resend not configured, skipping show added email');
      return { success: false, reason: 'Resend not configured' };
    }

    const html = generateNewShowAddedEmail(data);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: `New Show Added - ${data.movieTitle}`,
      html,
    });

    console.log('[EmailService] Show added email sent to', data.userEmail, '- ID:', result.data?.id);
    return { success: true, emailId: result.data?.id };
  }
}

module.exports = new EmailService();
