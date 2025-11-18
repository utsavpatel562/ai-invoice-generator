const { GoogleGenerativeAI } = require("@google/generative-ai");
const moment = require("moment");
const Invoice = require("../modules/Invoice");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * 1. PARSE INVOICE TEXT
 */
const parseInvoiceFromText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    const prompt = `
      Extract invoice data from the text and return ONLY valid JSON:
      {
        "clientName": "",
        "invoiceNumber": "",
        "amount": 0,
        "status": "",
        "dueDate": ""
      }

      TEXT:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    let json;
    try {
      json = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to parse JSON from AI",
        aiOutput: aiText,
      });
    }

    return res.json({ data: json });
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return res.status(500).json({
      error: "AI parsing failed",
      details: error.message,
    });
  }
};

/**
 * 2. GENERATE REMINDER EMAIL — FIXED & STABLE
 */
const generateReminderEmail = async (req, res) => {
  try {
    const invoiceId = req.body.invoiceId?.trim();

    if (!invoiceId) {
      return res.status(400).json({ message: "Invoice ID required" });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Clean safe fallback values
    const clientName = invoice.billTo?.clientName || "Client";
    const invoiceNumber = invoice.invoiceNumber || "N/A";
    const amount = invoice.total?.toFixed(2) || "0.00";
    const dueDate = invoice.dueDate
      ? new Date(invoice.dueDate).toLocaleDateString()
      : "Not specified";

    const prompt = `
      Write a professional payment reminder email.

      Client: ${clientName}
      Invoice Number: ${invoiceNumber}
      Amount Due: $${amount}
      Due Date: ${dueDate}

      Requirements:
      - Start with "Subject:"
      - Include a clear body message
      - Be polite and concise
      - End with a thank you
    `;

    const result = await model.generateContent(prompt);
    const emailText = result.response.text();

    return res.status(200).json({ reminderText: emailText });
  } catch (error) {
    console.error("Error generating reminder:", error);
    return res.status(500).json({
      message: "Failed to generate reminder email",
      details: error.message,
    });
  }
};

/**
 * 3. DASHBOARD SUMMARY (unchanged)
 */
const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (!invoices.length) {
      return res.json({
        insights: ["No invoice data available"],
      });
    }

    const normalized = invoices.map((inv) => ({
      ...inv._doc,
      paidDate: inv.paidDate || (inv.status === "Paid" ? inv.invoiceDate : null),
      issueDate: inv.issueDate || inv.invoiceDate,
    }));

    const now = moment();
    const thisStart = now.startOf("month").toDate();
    const thisEnd = now.endOf("month").toDate();

    const lastStart = moment(thisStart).subtract(1, "month").toDate();
    const lastEnd = moment(thisEnd).subtract(1, "month").toDate();

    const paidInvoices = normalized.filter(
      (inv) => inv.status === "Paid" && inv.paidDate
    );

    const thisMonthPaid = paidInvoices
      .filter((inv) => inv.paidDate >= thisStart && inv.paidDate <= thisEnd)
      .reduce((sum, inv) => sum + inv.total, 0);

    const lastMonthPaid = paidInvoices
      .filter((inv) => inv.paidDate >= lastStart && inv.paidDate <= lastEnd)
      .reduce((sum, inv) => sum + inv.total, 0);

    const trend =
      lastMonthPaid > 0
        ? Number((((thisMonthPaid - lastMonthPaid) / lastMonthPaid) * 100).toFixed(1))
        : thisMonthPaid > 0
        ? 100
        : 0;

    const totalPaid = paidInvoices.reduce((a, b) => a + b.total, 0);
    const totalInvoiced = normalized.reduce((a, b) => a + b.total, 0);

    const efficiency =
      totalInvoiced > 0
        ? Number(((totalPaid / totalInvoiced) * 100).toFixed(1))
        : 0;

    const insights = [
      `This month's revenue: $${thisMonthPaid.toFixed(2)} (${trend}% vs last month)`,
      `Collection efficiency: ${efficiency}%`,
    ];

    return res.json({
      insights,
      monthlyRevenue: {
        thisMonth: thisMonthPaid,
        lastMonth: lastMonthPaid,
        trendPercent: trend,
      },
      collectionEfficiencyScore: efficiency,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      message: "Failed to get dashboard summary",
      details: error.message,
    });
  }
};

module.exports = {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
};
