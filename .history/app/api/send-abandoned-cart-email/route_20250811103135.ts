import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userInfo, carInfo, timestamp, lastActivity, currentStep } = data;

    const timeSpent = lastActivity
      ? Math.round((lastActivity - timestamp) / 1000 / 60)
      : 0;
    const abandonedAt = new Date(lastActivity || timestamp).toLocaleString(
      "en-US",
      {
        timeZone: "Africa/Cairo",
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

    const stepNames: Record<string, string> = {
      "car-info": "Vehicle Information",
      "user-info": "Personal Information",
      documents: "Document Upload",
      offers: "Insurance Offers",
      "thank-you": "Completion",
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>🚨 URGENT: Abandoned Insurance Quote</title>
        <style>
          :root {
            color-scheme: light dark;
          }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0; 
            background-color: #ffffff;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          .container { 
            max-width: 700px; 
            margin: 20px auto; 
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          }
          .header { 
            background: #dc2626; 
            color: #ffffff; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
          }
          .urgent-badge {
            background: #f59e0b;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
            display: inline-block;
          }
          .content { 
            padding: 30px;
            background: #ffffff;
            color: #1a1a1a;
          }
          .alert-box {
            background: #ffffff;
            border: 2px solid #dc2626;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          .info-grid {
            width: 100%;
            margin: 25px 0;
          }
          .info-card { 
            background: #ffffff; 
            padding: 20px; 
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .info-card h3 {
            margin: 0 0 15px 0;
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 8px;
          }
          .info-item {
            display: table;
            width: 100%;
            margin: 8px 0;
            padding: 5px 0;
          }
          .info-label {
            display: table-cell;
            font-weight: 600;
            color: #374151;
            width: 40%;
          }
          .info-value {
            display: table-cell;
            color: #1a1a1a;
            font-weight: 500;
            text-align: right;
          }
          .progress-section {
            background: #ffffff;
            border: 2px solid #0ea5e9;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
          }
          .action-section {
            background: #059669;
            color: #ffffff;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .contact-priority {
            background: #ffffff;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #1a1a1a !important;
              color: #ffffff !important;
            }
            .container {
              background: #2d2d2d !important;
              border-color: #404040 !important;
            }
            .content {
              background: #2d2d2d !important;
              color: #ffffff !important;
            }
            .info-card {
              background: #2d2d2d !important;
              border-color: #404040 !important;
            }
            .info-card h3 {
              color: #60a5fa !important;
              border-bottom-color: #60a5fa !important;
            }
            .info-label {
              color: #d1d5db !important;
            }
            .info-value {
              color: #ffffff !important;
            }
            .alert-box {
              background: #2d2d2d !important;
            }
            .progress-section {
              background: #2d2d2d !important;
            }
            .contact-priority {
              background: #2d2d2d !important;
            }
            .footer {
              background: #1a1a1a !important;
              border-top-color: #404040 !important;
            }
          }
          
          @media (max-width: 600px) {
            .info-grid {
              display: block;
            }
            .info-item {
              display: block;
            }
            .info-label, .info-value {
              display: block;
              width: 100%;
              text-align: left;
            }
            .info-value {
              margin-top: 5px;
              font-weight: 700;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 ABANDONED INSURANCE QUOTE</h1>
            <div class="urgent-badge">HIGH PRIORITY - CONTACT IMMEDIATELY</div>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <h3 style="margin: 0 0 10px 0; color: #dc2626;">⚠️ Customer Alert</h3>
              <p style="margin: 0; font-weight: 500;">A potential customer started the insurance quote process but abandoned it. <strong>Immediate follow-up required!</strong></p>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <h3>👤 Customer Information</h3>
                <div class="info-item">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${userInfo.full_name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${userInfo.mobile_number}</span>
                </div>
                ${
                  userInfo.email
                    ? `
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${userInfo.email}</span>
                </div>
                `
                    : ""
                }
              </div>
              
              <div class="info-card">
                <h3>🚗 Vehicle Information</h3>
                <div class="info-item">
                  <span class="info-label">Make:</span>
                  <span class="info-value">${carInfo.make}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Model:</span>
                  <span class="info-value">${carInfo.model}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Year:</span>
                  <span class="info-value">${carInfo.year}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Value:</span>
                  <span class="info-value">${carInfo.market_price?.toLocaleString()} EGP</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Condition:</span>
                  <span class="info-value">${carInfo.condition === "new" ? "New" : "Used"}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Fuel Type:</span>
                  <span class="info-value">${carInfo.fuel_type === "fuel" ? "Gasoline" : "Electric"}</span>
                </div>
              </div>
            </div>

            <div class="progress-section">
              <h3 style="margin: 0 0 15px 0; color: #0369a1;">📊 Quote Progress</h3>
              <div class="info-item">
                <span class="info-label">Last Step Completed:</span>
                <span class="info-value">${stepNames[currentStep] || currentStep}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Time Spent:</span>
                <span class="info-value">${timeSpent} minutes</span>
              </div>
              <div class="info-item">
                <span class="info-label">Abandoned At:</span>
                <span class="info-value">${abandonedAt} (Cairo Time)</span>
              </div>
            </div>

            <div class="contact-priority">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">📞 Contact Priority</h3>
              <p style="margin: 0; color: #92400e; font-weight: 500;">This customer showed high interest by providing personal details and vehicle information. <strong>Contact within 1 hour for best conversion rate.</strong></p>
            </div>

            <div class="action-section">
              <h3 style="margin: 0 0 15px 0;">🎯 Recommended Actions</h3>
              <ul style="text-align: left; margin: 0; padding-left: 20px;">
                <li>Call the customer immediately using the provided phone number</li>
                <li>Reference their specific vehicle: ${carInfo.year} ${carInfo.make} ${carInfo.model}</li>
                <li>Mention the estimated value: ${carInfo.market_price?.toLocaleString()} EGP</li>
                <li>Offer to complete the quote process over the phone</li>
                <li>Provide immediate pricing if possible</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>SKY Insurance - Customer Acquisition System</p>
            <p>Generated on ${new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })} (Cairo Time)</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: "SKY Insurance <noreply@resend.dev>",
      to: ["omar.khaled@sky.eg"],
      subject: `🚨 URGENT ABANDONED QUOTE: ${userInfo.full_name} - ${carInfo.year} ${carInfo.make} ${carInfo.model} (${carInfo.market_price?.toLocaleString()} EGP)`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Abandoned cart email API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send abandoned cart email" },
      { status: 500 }
    );
  }
}
