import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') || 'your-email@company.com'

serve(async (req) => {
  try {
    const { name, email, current_role, created_at } = await req.json()

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-row { margin: 15px 0; padding: 12px; background: white; border-radius: 6px; }
            .label { font-weight: bold; color: #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✅ New Assessment Submitted!</h1>
            </div>
            <div class="content">
              <p>A new UX Growth Journey assessment has been completed:</p>
              
              <div class="info-row">
                <span class="label">👤 Name:</span> ${name}
              </div>
              
              <div class="info-row">
                <span class="label">📧 Email:</span> ${email}
              </div>
              
              <div class="info-row">
                <span class="label">💼 Role:</span> ${current_role}
              </div>
              
              <div class="info-row">
                <span class="label">⏰ Submitted:</span> ${new Date(created_at).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              <a href="https://career-assessment-form-five.vercel.app/admin?password=uxgrowth2024" class="button">
                📊 View in Admin Dashboard
              </a>
              
              <div class="footer">
                <p>UX Growth Journey Assessment System</p>
                <p>This is an automated notification. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'UX Assessment <onboarding@resend.dev>',
        to: [NOTIFICATION_EMAIL],
        subject: `✅ New Assessment Submitted - ${name}`,
        html: emailHtml,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
})
