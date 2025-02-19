

import { useState } from "react";
import { InvoiceCardProps } from "../types";
import { useUserContext } from "../provider";

const useDelete = () => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceCardProps | null>(null);
  const [deletedInvoice, setDeletedInvoice] = useState<InvoiceCardProps | null>(null);
  const { dispatch } = useUserContext();

  const handleDelete = (invoice: InvoiceCardProps) => {
    setInvoiceToDelete(invoice);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      dispatch({ type: "DELETE_INVOICE", payload: invoiceToDelete });
      setDeletedInvoice(invoiceToDelete);
      setShowConfirmDelete(false);
      setInvoiceToDelete(null);

      const savedInvoices = localStorage.getItem("loggedInUser");
      if (savedInvoices) {
        const userData = JSON.parse(savedInvoices);
        userData.invoices = userData.invoices.filter(
          (i: InvoiceCardProps) => i.invoiceId !== invoiceToDelete.invoiceId
        );
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setInvoiceToDelete(null);
  };

  return {
    handleDelete,
    confirmDelete,
    cancelDelete,
    showConfirmDelete,
    deletedInvoice,
  };
};

export default useDelete;


