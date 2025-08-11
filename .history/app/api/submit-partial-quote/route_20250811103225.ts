import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carInfo, userInfo, insuranceType } = body;

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>📈 Partial Value Insurance Request</title>
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
            background: #f59e0b; 
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
          .special-badge {
            background: #d97706;
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
          .highlight-box {
            background: #ffffff;
            border: 2px solid #f59e0b;
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
          .special-section {
            background: #f59e0b;
            color: #ffffff;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .special-section h2 {
            margin: 0 0 15px 0;
            font-size: 22px;
            color: #ffffff;
          }
          .evaluation-section {
            background: #ffffff;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .evaluation-section h4 {
            color: #d97706;
            margin: 0 0 15px 0;
          }
          .action-section {
            background: #ffffff;
            border: 2px solid #3b82f6;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
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
            .highlight-box {
              background: #2d2d2d !important;
            }
            .evaluation-section {
              background: #2d2d2d !important;
            }
            .action-section {
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
            <h1>📈 PARTIAL VALUE INSURANCE REQUEST</h1>
            <div class="special-badge">REQUIRES CUSTOM EVALUATION</div>
          </div>
          
          <div class="content">
            <div class="highlight-box">
              <h3 style="margin: 0 0 10px 0; color: #d97706;">📊 Special Insurance Request</h3>
              <p style="margin: 0; font-weight: 500;">Customer has requested partial value insurance with proportional clause. <strong>Custom evaluation required!</strong></p>
            </div>

            <div class="special-section">
              <h2>📈 Partial Market Value Insurance</h2>
              <div style="font-size: 16px; opacity: 0.9; margin: 10px 0;">with Proportional Clause Application</div>
              <div style="font-size: 14px; opacity: 0.8; margin-top: 15px;">This insurance type requires individual assessment to determine appropriate coverage value and terms</div>
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
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${userInfo.email || "Not provided"}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Requested:</span>
                  <span class="info-value">${new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })} (Cairo)</span>
                </div>
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
                  <span class="info-label">Market Value:</span>
                  <span class="info-value">${carInfo.market_price.toLocaleString()} EGP</span>
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

            <div class="evaluation-section">
              <h4>🔍 Evaluation Requirements</h4>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li>Determine appropriate insurance value based on customer needs</li>
                <li>Calculate proportional clause implications</li>
                <li>Assess vehicle condition and depreciation factors</li>
                <li>Review customer's risk profile and coverage preferences</li>
                <li>Provide customized premium calculation</li>
              </ul>
            </div>

            <div class="action-section">
              <h3 style="margin: 0 0 15px 0; color: #1d4ed8;">📞 Priority Actions</h3>
              <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li><strong>Contact customer within 24 hours</strong> to discuss requirements</li>
                <li>Schedule vehicle inspection if necessary</li>
                <li>Prepare custom insurance proposal with multiple coverage options</li>
                <li>Explain proportional clause terms and implications</li>
                <li>Finalize coverage amount and premium calculation</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>SKY Insurance - Custom Insurance Solutions</p>
            <p>Generated on ${new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })} (Cairo Time)</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    try {
      await resend.emails.send({
        from: "SKY Insurance <noreply@resend.dev>",
        to: ["omar.khaled@sky.eg"],
        subject: `📈 PARTIAL VALUE REQUEST: ${userInfo.full_name} - ${carInfo.year} ${carInfo.make} ${carInfo.model} (${carInfo.market_price.toLocaleString()} EGP)`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        { success: false, error: "فشل في إرسال البريد الإلكتروني" },
        { status: 500 }
      );
    }

    console.log("Partial Value Insurance Request:", {
      carInfo,
      userInfo,
      insuranceType,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "تم إرسال طلبك بنجاح!",
      note: "سيتم التواصل معك خلال 24 ساعة لمناقشة تفاصيل التأمين",
    });
  } catch (error) {
    console.error("Error submitting partial quote:", error);
    return NextResponse.json(
      { success: false, error: "فشل في إرسال الطلب" },
      { status: 500 }
    );
  }
}
