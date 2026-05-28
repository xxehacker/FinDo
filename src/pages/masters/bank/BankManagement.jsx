import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { useNavigate } from "react-router-dom";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import { FaPiggyBank } from "react-icons/fa";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
} from "@/components/ui/data-table";

const BankManagement = () => {
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBanks = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await AXIOS_INSTANCE.get(API_ENDPOINTS.BANK.GET_ALL);
      if (response?.status === 200) {
        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        setBanks(data);
        setFilteredBanks(data);
      } else {
        throw new Error(`Unexpected response status: ${response?.status}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch banks");
      setBanks([]);
      setFilteredBanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (Array.isArray(banks)) {
      const filtered = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (bank.branch?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (bank.accountNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks([]);
    }
  }, [searchTerm, banks]);

  const deleteBank = async (id) => {
    try {
      const response = await AXIOS_INSTANCE.delete(API_ENDPOINTS.BANK.DELETE(id));
      if (response.status === 200) {
        toast.success("Bank deleted successfully");
        fetchBanks();
      }
    } catch (err) {
      toast.error("Failed to delete bank");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Bank Management"
          description="Manage bank accounts and balances"
          breadcrumbs={
            <>
              <span>Master Data</span>
              <span className="text-foreground">›</span>
              <span className="text-foreground">Banks</span>
            </>
          }
          actions={
            <Button onClick={() => navigate("/master/bank/create")}>
              + Add Bank
            </Button>
          }
        />

        <div className="neo-card p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search name, branch, or account #"
              className="sm:max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          </div>
        </div>

        {error && <Alert variant="destructive">{error}</Alert>}

        <DataTable>
          <table className="w-full table-fixed min-w-[800px]">
            <DataTableHeader>
              <tr>
                <DataTableHead className="w-12">#</DataTableHead>
                <DataTableHead>Bank</DataTableHead>
                <DataTableHead>Branch</DataTableHead>
                <DataTableHead>Account</DataTableHead>
                <DataTableHead>Amount</DataTableHead>
                <DataTableHead>Type</DataTableHead>
                <DataTableHead className="w-48">Actions</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="inline-block h-8 w-8 border-4 border-[var(--neo-black)] border-t-primary rounded-full animate-spin" />
                  </td>
                </tr>
              ) : filteredBanks.length > 0 ? (
                filteredBanks.map((bank, index) => (
                  <DataTableRow key={bank._id}>
                    <DataTableCell className="font-bold">{index + 1}</DataTableCell>
                    <DataTableCell>
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-[10px] border-4 border-[var(--neo-black)] bg-accent flex items-center justify-center shadow-[2px_2px_0_0_var(--neo-black)]">
                          <FaPiggyBank size={18} />
                        </div>
                        <div>
                          <div className="font-bold truncate">{bank.name?.toUpperCase()}</div>
                          {bank.ifsc && (
                            <div className="text-xs text-muted-foreground font-semibold">
                              IFSC: {bank.ifsc}
                            </div>
                          )}
                        </div>
                      </div>
                    </DataTableCell>
                    <DataTableCell>{bank.branch || "N/A"}</DataTableCell>
                    <DataTableCell>{bank.accountNumber || "N/A"}</DataTableCell>
                    <DataTableCell className="font-bold">
                      ₹{bank.amount?.toLocaleString() || "0"}
                    </DataTableCell>
                    <DataTableCell>
                      <Badge variant="outline">{bank.accountType || "primary"}</Badge>
                    </DataTableCell>
                    <DataTableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/master/bank/view/${bank._id}`)}>
                          View
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/master/bank/edit/${bank._id}`)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (window.confirm("Delete this bank account?")) {
                              deleteBank(bank._id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center font-semibold text-muted-foreground">
                    No banks found
                  </td>
                </tr>
              )}
            </DataTableBody>
          </table>
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default BankManagement;
