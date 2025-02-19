
import { useState, useEffect } from "react";
import { InvoiceCardProps } from "../types";

const useSearch = (initialInvoices: InvoiceCardProps[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<InvoiceCardProps[]>(initialInvoices);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(initialInvoices);
    } else {
      const filtered = initialInvoices.filter(
        (invoice) =>
          invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, initialInvoices]);  // ✅ البحث يتم تحديثه عند تغيّر البيانات أو النص المُدخل

  return { searchQuery, setSearchQuery, searchResults };
};

export default useSearch;
