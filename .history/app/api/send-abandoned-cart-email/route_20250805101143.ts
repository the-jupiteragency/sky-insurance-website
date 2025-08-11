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
        <title>🚨 URGENT: Abandoned Insurance Quote</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 700px; 
            margin: 20px auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .urgent-badge {
            background: #fbbf24;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
            display: inline-block;
          }
          .content { 
            padding: 30px;
          }
          .alert-box {
            background: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 25px 0;
          }
          .info-card { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }
          .info-card h3 {
            margin: 0 0 15px 0;
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 2px solid #dbeafe;
            padding-bottom: 8px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
          }
          .info-label {
            font-weight: 600;
            color: #4b5563;
          }
          .info-value {
            color: #111827;
            font-weight: 500;
          }
          .progress-section {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
          }
          .progress-bar {
            background: #e0e7ff;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
          }
          .progress-fill {
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
            height: 100%;
            transition: width 0.3s ease;
          }
          .action-section {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .contact-priority {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          @media (max-width: 600px) {
            .info-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="background: rgba(0,0,0,0.1); padding: 10px; border-radius: 5px;">🚨 ABANDONED INSURANCE QUOTE</h1>
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

            <div class="action-section" style="background: rgba(0,0,0,0.1);>
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
