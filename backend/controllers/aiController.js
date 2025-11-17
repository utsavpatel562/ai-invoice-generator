const moment = require("moment");
const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../modules/Invoice");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// =====================
// Parse Invoice From Raw Text
// =====================
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

    // Clean response
    let responseText = response.text;
    if (typeof responseText !== "string") {
      if (typeof response.text === "function") {
        responseText = response.text();
      } else {
        throw new Error("Could not extract text from AI response");
      }
    }

    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice with AI:", error);
    res
      .status(500)
      .json({ message: "Failed to parse invoice data from text.", details: error.message });
  }
};

// =====================
// Reminder Email
// =====================
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
    res
      .status(500)
      .json({ message: "Failed to generate reminder email.", details: error.message });
  }
};

// =====================
// Dashboard Summary
// =====================
const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (invoices.length === 0) {
      return res.status(200).json({
        insights: ["No invoice data available to generate insights."],
      });
    }

    // Normalize missing paidDate → use invoiceDate when status = Paid
    const normalizedInvoices = invoices.map((inv) => ({
      ...inv._doc,
      paidDate: inv.paidDate || (inv.status === "Paid" ? inv.invoiceDate : null),
      issueDate: inv.issueDate || inv.invoiceDate,
    }));

    const now = moment();
    const thisStart = now.clone().startOf("month").toDate();
    const thisEnd = now.clone().endOf("month").toDate();

    const lastStart = now.clone().subtract(1, "month").startOf("month").toDate();
    const lastEnd = now.clone().subtract(1, "month").endOf("month").toDate();

    const paidInvoices = normalizedInvoices.filter(
      (inv) => inv.status === "Paid" && inv.paidDate
    );

    // ---- Monthly Revenue ----
    const thisMonthPaid = paidInvoices
      .filter((inv) => inv.paidDate >= thisStart && inv.paidDate <= thisEnd)
      .reduce((sum, inv) => sum + inv.total, 0);

    const lastMonthPaid = paidInvoices
      .filter((inv) => inv.paidDate >= lastStart && inv.paidDate <= lastEnd)
      .reduce((sum, inv) => sum + inv.total, 0);

    let trend =
      lastMonthPaid > 0
        ? ((thisMonthPaid - lastMonthPaid) / lastMonthPaid) * 100
        : thisMonthPaid > 0
        ? 100
        : 0;

    trend = Number(trend.toFixed(1));

    // ---- Slow Paying Clients ----
    const clientDelays = {};

    paidInvoices.forEach((inv) => {
      const issue = moment(inv.issueDate);
      const paid = moment(inv.paidDate);
      const days = paid.diff(issue, "days");

      if (!clientDelays[inv.billTo?.clientName]) {
        clientDelays[inv.billTo.clientName] = [];
      }
      clientDelays[inv.billTo.clientName].push(days);
    });

    const slowClients = Object.entries(clientDelays)
      .map(([client, delays]) => ({
        client,
        avgDaysToPay: (
          delays.reduce((a, b) => a + b, 0) / delays.length
        ).toFixed(1),
      }))
      .sort((a, b) => b.avgDaysToPay - a.avgDaysToPay)
      .slice(0, 3);

    // ---- Collection Efficiency ----
    const totalPaid = paidInvoices.reduce((x, inv) => x + inv.total, 0);
    const totalInvoiced = normalizedInvoices.reduce(
      (x, inv) => x + inv.total,
      0
    );

    const collectionEfficiency =
      totalInvoiced > 0
        ? Number(((totalPaid / totalInvoiced) * 100).toFixed(1))
        : 0;

    // ---- Final Insights ----
    const insights = [
      `This month's collected revenue is $${thisMonthPaid.toFixed(
        2
      )} (${trend}% vs last month).`,
      slowClients.length
        ? `Your slowest-paying client is ${slowClients[0].client}, averaging ${slowClients[0].avgDaysToPay} days to pay.`
        : "No paid invoices yet to analyze client payment speed.",
      `Your collection efficiency score is ${collectionEfficiency}%. Higher scores indicate faster and more reliable payments.`,
    ];

    res.status(200).json({
      insights,
      monthlyRevenue: {
        thisMonth: thisMonthPaid,
        lastMonth: lastMonthPaid,
        trendPercent: trend,
      },
      slowPayingClients: slowClients,
      collectionEfficiencyScore: collectionEfficiency,
    });
  } catch (error) {
    console.error("Error in generating dashboard summary:", error);
    res.status(500).json({
      message: "Failed to generate dashboard summary.",
      details: error.message,
    });
  }
};


module.exports = {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
};
