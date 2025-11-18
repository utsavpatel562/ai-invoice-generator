import { Sparkles, X } from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../../components/ui/TextareaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateWithAiModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please paste some text to generate an invoice.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.PARSE_INVOICE_TEXT,
        { text }
      );

      // FIXED LINE — correctly extract AI output
      const invoiceData = response.data.data;

      toast.success("Invoice data extracted successfully!");
      onClose();

      navigate("/invoices/new", { state: { aiData: invoiceData } });
    } catch (error) {
      toast.error("Failed to generate invoice from text.");
      console.error("AI parsing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-black/60 bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
              Create Invoice with AI
            </h3>
            <button
              className="text-slate-400 hover:text-slate-600"
              onClick={onClose}
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Paste any text containing invoice details (client, items, price)
              and AI will generate a structured invoice draft.
            </p>

            <TextareaField
              name="invoiceText"
              label="Paste Invoice Text Here"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Invoice for ClientCrop: 2 Hours of work at $80/hr plus tax"
              rows={8}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} isLoading={isLoading}>
              {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWithAiModal;
