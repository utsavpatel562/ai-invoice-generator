const {GoogleGenAI} = require("@google/genai");
const Invoice = require("../modules/Invoice");
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const parseInvoiceFromText = async(req, res) => {
    const {text} = req.body;
    if(!test) {
        return res.status(400).json({message: "Text is required"});
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
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-latest",
            contents: prompt,
        });
        const responseText = response.text;
        if(typeof responseText !== "string") {
            if(typeof response.text === "function") {
                responseText = response.text();
            } else {
                throw new Error('Could not extract text from AI response');
            }
        }
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanedJson);
        res.status(200).json(parsedData);
    } catch (error) {
        console.error("Error parsing invoice with AI:", error);
        res.status(500).json({message: "Failed to parse invoice data from text.", details: error.message});
    }
}
const generateReminderEmail = async(req, res) => {
try {

    } catch (error) {
        console.error("Error reminder email with AI:", error);
        res.status(500).json({message: "Failed to parse invoice data from text.", details: error.message});
    }
};

const getDashboardSummary = async(req, res) => {
try {

    } catch (error) {
        console.error("Error in generating dashboard summary with AI:", error);
        res.status(500).json({message: "Failed to parse invoice data from text.", details: error.message});
    }
};
module.exports = {parseInvoiceFromText, generateReminderEmail, getDashboardSummary}