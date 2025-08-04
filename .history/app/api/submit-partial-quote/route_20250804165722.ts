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
        <title>📈 Partial Value Insurance Request</title>
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
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .special-badge {
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
          .highlight-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
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
          .special-section {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .special-section h2 {
            margin: 0 0 15px 0;
            font-size: 22px;
          }
          .evaluation-section {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .evaluation-section h4 {
            color: #92400e;
            margin: 0 0 15px 0;
          }
          .action-section {
            background: #eff6ff;
            border: 1px solid #3b82f6;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
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
        to: ["website@sky.eg"],
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
