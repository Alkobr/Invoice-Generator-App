import { useState, useEffect } from "react";
import { InvoiceCardProps } from "../types";

const useSearch = (initialInvoices: InvoiceCardProps[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<InvoiceCardProps[]>(initialInvoices);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(initialInvoices);
    }
  }, [searchQuery, initialInvoices]);

  const search = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(initialInvoices);
      return;
    }
    const filtered = initialInvoices.filter(
      (invoice) =>
        invoice.client.name.toLowerCase().includes(query.toLowerCase()) ||
        invoice.invoiceId.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return { searchQuery, setSearchQuery, searchResults, search };
};

export default useSearch;