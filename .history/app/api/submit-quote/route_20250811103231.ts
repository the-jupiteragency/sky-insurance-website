import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carInfo, userInfo, documents, selectedOffer } = body;

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>✅ New Insurance Quote Submitted</title>
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
            background: #10b981; 
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
          .success-badge {
            background: #059669;
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
          .success-box {
            background: #ffffff;
            border: 2px solid #10b981;
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
          .premium-section {
            background: #10b981;
            color: #ffffff;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .premium-section h2 {
            margin: 0 0 10px 0;
            font-size: 24px;
            color: #ffffff;
          }
          .premium-section .amount {
            font-size: 28px;
            font-weight: bold;
            margin: 10px 0;
            color: #ffffff;
          }
          .conditions-section {
            background: #ffffff;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .conditions-section h4 {
            color: #d97706;
            margin: 0 0 15px 0;
          }
          .conditions-section ul {
            margin: 0;
            padding-right: 20px;
            text-align: right;
            direction: rtl;
          }
          .conditions-section li {
            margin: 8px 0;
            color: #d97706;
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
            .success-box {
              background: #2d2d2d !important;
            }
            .conditions-section {
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
            <h1>✅ NEW INSURANCE QUOTE SUBMITTED</h1>
            <div class="success-badge">QUOTE READY FOR PROCESSING</div>
          </div>
          
          <div class="content">
            <div class="success-box">
              <h3 style="margin: 0 0 10px 0; color: #059669;">🎉 Quote Submission Successful</h3>
              <p style="margin: 0; font-weight: 500;">A customer has successfully completed and submitted their insurance quote. <strong>Ready for policy processing!</strong></p>
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
                  <span class="info-label">Submitted:</span>
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
                  <span class="info-label">Value:</span>
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

            <div class="premium-section">
              <h2>🏆 Selected Insurance Plan</h2>
              <div style="font-size: 20px; margin: 10px 0;">${selectedOffer.company}</div>
              <div style="font-size: 16px; opacity: 0.9; margin: 5px 0;">${selectedOffer.policyType}</div>
              <div class="amount">${Math.round(selectedOffer.annualPremium).toLocaleString()} EGP</div>
              <div style="font-size: 14px; opacity: 0.9;">Annual Premium • Rate: ${(selectedOffer.premiumRate * 100).toFixed(2)}%</div>
            </div>
              
            <div class="conditions-section">
              <h4>📋 Policy Terms and Conditions</h4>
              <ul>
                ${selectedOffer.conditions?.ar ? selectedOffer.conditions.ar.map((condition: string) => `<li>${condition}</li>`).join("") : "<li>شروط وأحكام الوثيقة سيتم توضيحها عند إصدار الوثيقة</li>"}
              </ul>
            </div>

            <div class="action-section">
              <h3 style="margin: 0 0 15px 0; color: #1d4ed8;">📞 Next Steps</h3>
              <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li>Contact customer within 24 hours to confirm details</li>
                <li>Verify submitted documents and information</li>
                <li>Process policy issuance and payment collection</li>
                <li>Send policy documents to customer</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>SKY Insurance - Policy Management System</p>
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
        subject: `✅ NEW QUOTE SUBMITTED: ${userInfo.full_name} - ${carInfo.year} ${carInfo.make} ${carInfo.model} (${Math.round(selectedOffer.annualPremium).toLocaleString()} EGP)`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        { success: false, error: "فشل في إرسال البريد الإلكتروني" },
        { status: 500 }
      );
    }

    console.log("Quote submission:", {
      carInfo,
      userInfo,
      documents,
      selectedOffer,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "تم إرسال طلبك بنجاح!",
      note: "سيتم التواصل معك خلال 24 ساعة لتأكيد تفاصيل التأمين",
    });
  } catch (error) {
    console.error("Error submitting quote:", error);
    return NextResponse.json(
      { success: false, error: "فشل في إرسال الطلب" },
      { status: 500 }
    );
  }
}
