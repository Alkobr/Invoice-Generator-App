import { useState } from "react";
import { InvoiceCardProps } from "../types";

const useInvoiceFilter = (initialInvoices: InvoiceCardProps[]) => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterStatus, setFilterStatus] = useState<{
    paid: boolean;
    unpaid: boolean;
  }>({ paid: false, unpaid: false });
  const [filteredInvoices, setFilteredInvoices] = useState(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");

  const applyFilter = () => {
    let filtered = [...initialInvoices];

    if (filterStatus.paid !== filterStatus.unpaid) {
      filtered = filtered.filter((invoice) => {
        if (filterStatus.paid && invoice.status.toLowerCase() === "paid") {
          return true;
        }
        if (filterStatus.unpaid && invoice.status.toLowerCase() === "unpaid") {
          return true;
        }
        return false;
      });
    }

    if (filterType === "Date" && filterValue) {
      filtered = filtered.filter((invoice) => invoice.dueDate === filterValue);
    } else if (filterType && filterValue) {
      filtered = filtered.filter((invoice) => {
        if (filterType === "Client Name") {
          return invoice.client.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        if (filterType === "Invoice Number") {
          return invoice.invoiceId
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        return false;
      });
    }

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.client.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
  };

  return {
    filterType,
    setFilterType,
    filterValue,
    setFilterValue,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    filteredInvoices,
    applyFilter,
  };
};

export default useInvoiceFilter;
