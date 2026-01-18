
import { GoogleGenAI } from "@google/genai";
import { RefundRequest, RefundStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRefundEmail = async (
  request: RefundRequest,
  newStatus: RefundStatus
): Promise<string> => {
  const statusLabel = newStatus === RefundStatus.APPROVED ? "approved" : "rejected/cancelled";
  
  const prompt = `
    Draft a professional, empathetic email to a customer regarding their refund request for an e-commerce platform.
    
    Customer Name: ${request.customerName}
    Product: ${request.product.name} (ID: ${request.product.id})
    Price: $${request.product.price}
    New Status: ${statusLabel}
    Reason provided by customer: "${request.reason}"
    
    ${newStatus === RefundStatus.APPROVED ? `Mention that the pickup is scheduled for ${request.pickupTime} at ${request.address}.` : "Apologize that we cannot fulfill the refund at this time due to policy violations, but remain polite."}
    
    Keep the tone professional and helpful. Return ONLY the body text of the email.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate email content.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI response. Please draft manually.";
  }
};
