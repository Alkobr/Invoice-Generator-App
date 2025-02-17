import { useState } from "react";
import { InvoiceCardProps } from "../types";

const useDelete = (initialInvoices: InvoiceCardProps[]) => {
  const [invoiceListDelete, setInvoiceList] = useState(initialInvoices);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceCardProps | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleDelete = (invoice: InvoiceCardProps) => {
    setInvoiceToDelete(invoice);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      const updatedInvoices = invoiceListDelete.filter(
        (i) => i.invoiceId !== invoiceToDelete.invoiceId
      );
      
      // Update state
      setInvoiceList(updatedInvoices);
      setShowConfirmDelete(false);
      setInvoiceToDelete(null);
      setIsConfirmed(true);

      // Update localStorage
      localStorage.setItem("savedInvoice", JSON.stringify(updatedInvoices));
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setInvoiceToDelete(null);
    setIsConfirmed(false);
  };

  return {
    invoiceListDelete,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showConfirmDelete,
    isConfirmed,
  };
};

export default useDelete;
