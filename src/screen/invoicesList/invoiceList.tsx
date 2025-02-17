import React, { useState, useEffect } from "react";
import { InvoiceCardProps } from "../../types";
import "./invoiceList.css";
import { FaFileInvoice, FaFilter } from "react-icons/fa";
import FilterModal from "../../components/filterModals";
import DeleteConfirmationModal from "../../components/deleteConfirmationModal";
import useDelete from "../../hook/useDelete";
import useInvoiceFilter from "../../hook/useInvoiceFilter";
import { useNavigate } from "react-router-dom";
import useSearch from "../../hook/useSearch";
import InvoiceCard from "../../components/invoiceCards";
import SearchBar from "../../components/Search";

const CardList: React.FC = () => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const getSavedInvoices = (): InvoiceCardProps[] => {
    const savedInvoices = localStorage.getItem("savedInvoice");
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  };

  const [invoiceList, setInvoiceList] =
    useState<InvoiceCardProps[]>(getSavedInvoices);
  const [mainInvoiceList, setMainInvoiceList] =
    useState<InvoiceCardProps[]>(getSavedInvoices);
  console.log(invoiceList);

  const {
    invoiceListDelte,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showConfirmDelete,
  } = useDelete(invoiceList);

  const {
    filterType,
    setFilterType,
    filterValue,
    setFilterValue,
    filterStatus,
    setFilterStatus,
    filteredInvoices,
    applyFilter,
  } = useInvoiceFilter(mainInvoiceList);

  const { searchQuery, setSearchQuery, searchResults, search } =
    useSearch(mainInvoiceList);

  const handleCreateInvoice = () => {
    navigate("/CreateInvoice");
  };

  const handleApplyFilter = () => {
    applyFilter();
    setShowFilter(false);
  };

  const handleDeleteInvoice = (invoice: InvoiceCardProps) => {
    handleDelete(invoice);
  };

  useEffect(() => {
    setInvoiceList(invoiceListDelte);
    setMainInvoiceList(invoiceListDelte);
  }, [invoiceListDelte]);

  useEffect(() => {
    setInvoiceList(filteredInvoices);
  }, [filteredInvoices]);

  useEffect(() => {
    setInvoiceList(searchResults);
  }, [searchResults]);

  return (
    <div className="AllInvoices">
      <div className="containerr">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          search={search}
        />
        <div className="buttons">
          <button className="create-invoice" onClick={handleCreateInvoice}>
            <FaFileInvoice className="icon" /> Create Invoice
          </button>
          <button className="filter" onClick={() => setShowFilter(!showFilter)}>
            <FaFilter className="icon" /> Filters
          </button>
        </div>
      </div>

      {showFilter && (
        <FilterModal
          filterType={filterType}
          setFilterType={setFilterType}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          applyFilter={handleApplyFilter}
          closeFilter={() => setShowFilter(false)}
        />
      )}

      {showConfirmDelete && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className="invoice-container">
        <div className="invoice-header">
          <div className="header-item client">Client</div>
          <div className="header-item">Invoice Number</div>
          <div className="header-item">Date</div>
          <div className="header-item">Total Amount</div>
          <div className="header-item">Status</div>
          <div className="header-item">Actions</div>
        </div>
        <div className="cards-container">
          {invoiceList.map((invoice) => (
            <InvoiceCard
              key={invoice.invoiceId} 
              {...invoice}
              onDelete={() => handleDeleteInvoice(invoice)}
              onEdit={() => handleCreateInvoice()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardList;
