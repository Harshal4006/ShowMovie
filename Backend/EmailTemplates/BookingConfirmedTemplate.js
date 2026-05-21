const generateBookingConfirmedEmail = (data) => {
  const {
    userName = 'Movie Lover',
    movieTitle = 'Movie',
    bookingId = 'N/A',
    seats = [],
    amount = 0,
    showDate = 'N/A',
    showTime = 'N/A',
    theater = 'N/A',
    paymentId = 'N/A',
  } = data;

  const seatsList = Array.isArray(seats) ? seats.join(', ') : seats;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1117; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1d27; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">ShowMovie</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Booking Confirmed!</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 24px 16px;">
              <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Hi ${userName},</p>
              <p style="margin: 8px 0 0; color: #9ca3af; font-size: 15px; line-height: 1.6;">Your booking has been confirmed. Here are your ticket details:</p>
            </td>
          </tr>

          <!-- Booking Details Card -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1117; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #6b7280; font-size: 13px;">Movie</span>
                          <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${movieTitle}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #6b7280; font-size: 13px;">Booking ID</span>
                          <p style="margin: 4px 0 0; color: #ef4444; font-size: 15px; font-weight: 600; font-family: monospace;">${bookingId}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #6b7280; font-size: 13px;">Date & Time</span>
                          <p style="margin: 4px 0 0; color: #ffffff; font-size: 15px;">${showDate} at ${showTime}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #6b7280; font-size: 13px;">Theater</span>
                          <p style="margin: 4px 0 0; color: #ffffff; font-size: 15px;">${theater}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #6b7280; font-size: 13px;">Seats</span>
                          <p style="margin: 4px 0 0; color: #ffffff; font-size: 15px; font-weight: 600;">${seatsList}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #6b7280; font-size: 13px;">Payment ID</span>
                          <p style="margin: 4px 0 0; color: #ffffff; font-size: 14px; font-family: monospace;">${paymentId}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 0;">
                          <span style="color: #6b7280; font-size: 13px;">Total Amount</span>
                          <p style="margin: 4px 0 0; color: #ef4444; font-size: 24px; font-weight: 700;">₹${Number(amount).toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 24px 32px; text-align: center;">
              <a href="https://showmovie-frontend.vercel.app/my-booking" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 600;">View My Bookings</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f1117; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Need help? Contact us at <a href="mailto:support@showmovie.com" style="color: #ef4444; text-decoration: none;">support@showmovie.com</a></p>
              <p style="margin: 0; color: #4b5563; font-size: 12px;">© 2026 ShowMovie. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

module.exports = generateBookingConfirmedEmail;
