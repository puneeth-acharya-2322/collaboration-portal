const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

async function sendApplicationEmail(to, formData) {
  const industrySection = formData.companyName ? `
    <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Company</td><td style="padding:8px 16px;">${formData.companyName}</td></tr>
    <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Website</td><td style="padding:8px 16px;">${formData.website || 'N/A'}</td></tr>
    <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Project Proposal</td><td style="padding:8px 16px;">${formData.proposal || 'N/A'}</td></tr>
    <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Open to MOU?</td><td style="padding:8px 16px;">${formData.mouInterest || 'N/A'}</td></tr>
  ` : '';

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
    <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
      <div style="background:linear-gradient(135deg,#0F6E56,#0d5a46);padding:32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;">🤝 New Collaboration Application</h1>
        <p style="color:#a7f3d0;margin:8px 0 0;font-size:14px;">AI in Healthcare — Research Matchmaking Portal</p>
      </div>
      <div style="padding:24px;">
        <div style="background:#ecfdf5;border-left:4px solid #0F6E56;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:20px;">
          <strong style="color:#0F6E56;">Project:</strong> ${formData.projectTitle || 'General Collaboration'}
          <br><strong style="color:#0F6E56;">Role Type:</strong> ${formData.role}
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;">
          <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Name</td><td style="padding:8px 16px;">${formData.name}</td></tr>
          <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Institution</td><td style="padding:8px 16px;">${formData.institution}</td></tr>
          <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Email</td><td style="padding:8px 16px;"><a href="mailto:${formData.email}">${formData.email}</a></td></tr>
          <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">I am a…</td><td style="padding:8px 16px;">${formData.role}</td></tr>
          <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">ORCID / Scopus</td><td style="padding:8px 16px;">${formData.orcid || 'Not provided'}</td></tr>
          <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Availability</td><td style="padding:8px 16px;">${formData.availability}</td></tr>
          <tr><td style="padding:8px 16px;font-weight:600;color:#374151;background:#f9fafb;">Start Date</td><td style="padding:8px 16px;">${formData.startDate}</td></tr>
          ${industrySection}
        </table>
        <div style="margin-top:20px;">
          <h3 style="color:#374151;margin:0 0 8px;">Pitch</h3>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;line-height:1.6;color:#4b5563;">
            ${formData.pitch}
          </div>
        </div>
      </div>
      <div style="background:#f9fafb;padding:16px 24px;text-align:center;font-size:12px;color:#9ca3af;">
        AI in Healthcare — KMC Manipal • Research Matchmaking Portal
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"AI Healthcare Portal" <${process.env.SMTP_USER || 'noreply@manipal.edu'}>`,
    to,
    subject: `New Collaboration Application: ${formData.name} — ${formData.projectTitle || 'General'}`,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('📧 Email failed (SMTP not configured?):', err.message);
    // Don't throw — application still saves even if email fails
    return false;
  }
}

module.exports = { sendApplicationEmail };
