import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Edit, Printer, AlertCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import CreateInvoice from "./CreateInvoice";
import Button from "../../components/ui/Button";
import ReminderModal from "./ReminderModal";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useRef, useState } from "react";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_INVOICE_BY_ID(id)
        );
        setInvoice(response.data);
      } catch (error) {
        toast.error("Failed to load invoice");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(id),
        formData
      );
      toast.success("Invoice updated successfully!");
      setIsEditing(false);
      setInvoice(response.data);
    } catch (error) {
      toast.error("Failed to update invoice.");
      console.error(error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Invoice Not Found
        </h3>
        <p className="text-slate-500 mb-6 max-w-md">
          The invoice you are looking for does not exist or could not be loaded.
        </p>
        <Button onClick={() => navigate("/invoices")}>
          Back to all invoices
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return <CreateInvoice existingInvoice={invoice} onSave={handleUpdate} />;
  }

  return (
    <>
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={id}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 sm:mb-0">
          Invoice{" "}
          <span className="font-mono text-slate-500">
            {invoice.invoiceNumber}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          {invoice.status !== "Paid" && (
            <Button
              onClick={() => setIsReminderModalOpen(true)}
              variant="secondary"
              icon={Mail}
            >
              Generate Mail
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setIsEditing(true)}
            icon={Edit}
          >
            Edit
          </Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>
            Print or Download
          </Button>
        </div>
      </div>

      <div id="invoice-content-wrapper">
        <div
          ref={invoiceRef}
          id="invoice-preview"
          className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100 ring-1 ring-slate-100"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-10 border-b border-slate-100">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Invoice
              </h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                # {invoice.invoiceNumber}
              </p>
            </div>
            <div className="text-left sm:text-right mt-4 sm:mt-0 space-y-1">
              <p className="text-sm text-slate-500 font-medium">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                  invoice.status === "Paid"
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                    : invoice.status === "Pending"
                    ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                    : "bg-red-100 text-red-700 ring-1 ring-red-200"
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 my-10">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Bill From
              </h3>
              <p className="font-semibold text-lg text-slate-800">
                {invoice.billFrom.businessNumber}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {invoice.billFrom.address}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {invoice.billFrom.email}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {invoice.billFrom.phone}
              </p>
            </div>
            <div className="sm:text-right">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Bill To
              </h3>
              <p className="font-semibold text-lg text-slate-800">
                {invoice.billTo.clientName}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {invoice.billTo.address}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {invoice.billTo.email}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {invoice.billTo.phone}
              </p>
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-10">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Invoice Date
              </h3>
              <p className="text-base font-semibold text-slate-800">
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Due Date
              </h3>
              <p className="text-base font-semibold text-slate-800">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Payment Terms
              </h3>
              <p className="text-base font-semibold text-slate-800">
                {invoice.paymentTerms}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide uppercase">
                    Item
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 tracking-wide uppercase">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 tracking-wide uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 tracking-wide uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <div className="w-full max-w-sm space-y-4 bg-slate-50 rounded-xl p-6 shadow-inner">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax</span>
                <span>${invoice.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 border-t border-slate-300 pt-4">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-10 pt-8 border-t border-slate-200">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Notes
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
        @page {
          padding: 10px;
        }
        @media print {
          body * {
            visibility: hidden;
          }
        #invoice-content-wrapper, #invoice-content-wrapper * {
          visibility: visible;
        }
        #invoice-content-wrapper {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          width: 100%;
        }
        #invoice-preview {
        box-shadow: none;
        border: none;
        border-radius: 0;
        padding: 0;
        }
        }
        `}
      </style>
    </>
  );
};

export default InvoiceDetails;
