import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, DollarSign, Plus } from "lucide-react";
import moment from "moment";
import Button from "../../components/ui/Button";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        const invoices = response.data;
        const totalInvoices = invoices.length;
        const totalPaid = invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);
        const totalUnpaid = invoices
          .filter((inv) => inv.status !== "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });
        setRecentInvoices(
          invoices
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `${stats.totalPaid.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `${stats.totalUnpaid.toFixed(2)}`,
      color: "red",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-500" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-500" },
    red: { bg: "bg-red-100", text: "text-red-500" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-96">
        <div className="">
          <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-600 mt-1">
            A quick overview of your bussiness finances.
          </p>
        </div>
        {/*Stats Cards*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stats, index) => (
            <div
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg shadow-gray-100"
              key={index}
            >
              <div className="flex items-center">
                <div
                  className={`shrink-0 w-12 h-12 ${
                    colorClasses[stats.color].bg
                  } rounded-lg flex items-center justify-center`}
                >
                  <stats.icon
                    className={`w-6 h-6 ${colorClasses[stats.color].text}`}
                  />
                </div>
                <div className="ml-4 min-w-0">
                  <div className="text-sm font-medium text-slate-500 truncate">
                    {stats.label}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 wrap-break-word">
                    {stats.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ai-insights card */}

        {/* recent invoices */}
        <div className="">
          <div className="">
            <div className="">
              <h3 className="">Recent Invoices</h3>
              <Button
                className=""
                variant={"ghost"}
                onClick={() => navigate("/invoices")}
              >
                View All
              </Button>
            </div>
            {recentInvoices.length > 0 ? (
              <div className="">
                <table className="">
                  <thead className="">
                    <tr className="">
                      <th className="">Client</th>
                      <th className="">Amount</th>
                      <th className="">Status</th>
                      <th className="">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {recentInvoices.map((invoices) => (
                      <tr
                        className=""
                        key={invoices._id}
                        onClick={() => navigate(`/invoices/${invoices._id}`)}
                      >
                        <td className="">
                          <div className="">{invoices.billTo.clientName}</div>
                          <div className="">#{invoices.invoiceNumber}</div>
                        </td>
                        <td className="">${invoices.total.toFixed(2)}</td>
                        <td className="">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoices.status === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : invoices.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {invoices.status}
                          </span>
                        </td>
                        <td className="">
                          {moment(invoices.dueDate).format("MMM D, YYYY")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="">
                <div className="">
                  <FileText className="" />
                </div>
                <h2 className="">No invoices yet</h2>
                <p className="">
                  You haven't created any invoices yet. Get started by creating
                  your first one.
                </p>
                <Button
                  className=""
                  onClick={() => navigate("/invoices/new")}
                  icon={Plus}
                >
                  Create Invoice
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
