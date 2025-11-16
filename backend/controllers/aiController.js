const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../modules/Invoice");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }
  try {
    const prompt = `You are expert invoice data extraction AI. Analyze the following text and extract relevant information to create an invoice. 
The output MUST be a valid JSON object.

The JSON object should have the following structure:
{
   "clientName" : "string",
   "email" : "string (if available)",
   "address": "string (if available)",
   "items": [
      {
        "name" : "string",
        "quantity" : "number",
        "unitPrice" : "number"
      }
   ]
}

Here is the text to parse:
--- TEXT START ---
${text}
--- TEXT END ---

Extract the data and provide only the JSON object.
`;
    let response = await ai.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: prompt,
    });

    let responseText = response.text;
    if (typeof responseText !== "string") {
      if (typeof response.text === "function") {
        responseText = response.text();
      } else {
        throw new Error("Could not extract text from AI response");
      }
    }

    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedJson);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    res.status(500).json({ message: "Failed to parse invoice data from text.", details: error.message });
  }
};

const generateReminderEmail = async (req, res) => {
  const { invoiceId } = req.body;
  if (!invoiceId) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }
  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(400).json({ message: "Invoice not found" });
    }

    const prompt = `
You are professional and polite accounting assistant. Write a friendly reminder to client about an overdue or upcoming invoice payment.

Use the following details to personalize the email:
- Client Name: ${invoice.billTo.clientName}
- Invoice Number: ${invoice.invoiceNumber}
- Amount Due: ${invoice.total.toFixed(2)}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

The tone should be friendly but clear. Keep it concise. Start the email with "Subject:".
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: prompt,
    });

    res.status(200).json({ reminderText: response.text });
  } catch (error) {
    console.error("Error reminder email with AI:", error);
    res.status(500).json({ message: "Failed to generate reminder email.", details: error.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });
    if (invoices.length === 0) {
      return res.status(200).json({ insights: ["No invoice data available to generate insights."] });
    }

    const totalInvoice = invoices.length;
    const paidInvoice = invoices.filter((inv) => inv.status === "Paid");
    const unpaidInvoice = invoices.filter((inv) => inv.status !== "Paid");
    const totalRevenue = paidInvoice.reduce((acc, inv) => acc + inv.total, 0);
    const totalOutstanding = unpaidInvoice.reduce((acc, inv) => acc + (inv.total ?? 0), 0);

const recentInvoicesSummary = invoices.slice(-5).map(inv => {
  const total = typeof inv.total === "number" ? inv.total : 0;
  return `Invoice #${inv.invoiceNumber} for ${total.toFixed(2)} with status ${inv.status}`;
});

const prompt = `
- Total number of invoices: ${totalInvoice}
- Total paid invoices: ${paidInvoice.length}
- Total unpaid/pending invoices: ${unpaidInvoice.length}
- Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
- Total outstanding amount from unpaid/pending invoices: ${totalOutstanding.toFixed(2)}
- Recent invoices (last 5): ${recentInvoicesSummary.join(", ")}
`;

    // You can optionally send this prompt to AI for generating insights if needed
    res.status(200).json({ summary: prompt });
  } catch (error) {
    console.error("Error in generating dashboard summary with AI:", error);
    res.status(500).json({ message: "Failed to generate dashboard summary.", details: error.message });
  }
};

module.exports = { parseInvoiceFromText, generateReminderEmail, getDashboardSummary };