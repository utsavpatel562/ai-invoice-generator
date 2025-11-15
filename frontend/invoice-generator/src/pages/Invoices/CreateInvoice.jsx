import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [formData, setFormData] = useState(
    existingInvoice || {
      invoiceNumber: "",
      invoiceData: new Date().toISOString().split("T")[0],
      dueDate: "",
      billForm: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
      },
      billTo: { clientName: "", email: "", address: "", phone: "" },
      items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
      notes: "",
      paymentTerms: "Net 15",
    }
  );
  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(
    !existingInvoice
  );

  useEffect(() => {
    const aiData = location.state?.aiData;
    if (aiData) {
      setFormData((prev) => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || "",
          email: aiData.email || "",
          address: aiData.address || "",
          phone: "",
        },
        items: aiData.items || [
          { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
        ],
      }));
    }
    if (existingInvoice) {
      setFormData({
        ...existingInvoice,
        invoiceData: moment(existingInvoice.invoiceData).format("YYYY-MM-DD"),
        dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      });
    } else {
      const generateNewInvoiceNumber = async () => {
        setIsGeneratingNumber(true);
        try {
          const response = await axiosInstance.get(
            API_PATHS.INVOICE.GET_ALL_INVOICES
          );
          const invoices = response.data;
          let maxNum = 0;
          invoices.forEach((inv) => {
            const num = parseInt(inv.invoiceNumber.split("-")[1]);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          });
          const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
          setFormData((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));
        } catch (error) {
          console.error("Failed to generate invoice number", error);
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
          }));
        }
        setIsGeneratingNumber(false);
      };
      generateNewInvoiceNumber();
    }
  }, [existingInvoice]);

  return <div>CreateInvoice</div>;
};

export default CreateInvoice;
