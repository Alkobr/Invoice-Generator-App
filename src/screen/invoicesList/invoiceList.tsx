
import { InvoiceCardProps } from "../../types";
import "./invoiceList.css";
import { FaFileInvoice, FaFilter } from "react-icons/fa";
import FilterModal from "../../components/filterModals";
import DeleteConfirmationModal from "../../components/deleteConfirmationModal";
import useDelete from "../../hook/useDelete";
import {useNavigate } from "react-router-dom";
import useSearch from "../../hook/useSearch";
import useInvoiceFilter from "../../hook/useInvoiceFilter";
import InvoiceCard from "../../components/invoiceCards";
import SearchBar from "../../components/Search";
import { useEffect, useState, useMemo } from "react";
import { IInvoice } from "../../types";

const CardList: React.FC = () => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const getSavedInvoices = (): InvoiceCardProps[] => {
    const savedInvoices = localStorage.getItem("loggedInUser");
    const existingInvoices = savedInvoices ? JSON.parse(savedInvoices) : [];
    return existingInvoices?.invoices?.map((invoice: IInvoice) => ({ ...invoice })) || [];
  };

  const savedInvoices = useMemo(() => getSavedInvoices(), []);
  const [mainInvoiceList, setMainInvoiceList] = useState<InvoiceCardProps[]>(savedInvoices);
  const [invoiceList, setInvoiceList] = useState<InvoiceCardProps[]>(savedInvoices);

  const { handleDelete, confirmDelete, cancelDelete, showConfirmDelete, deletedInvoice } = useDelete();
  const { filterType, setFilterType, filterValue, setFilterValue, filterStatus, setFilterStatus, filteredInvoices, applyFilter } = useInvoiceFilter(mainInvoiceList);
  const { searchQuery, setSearchQuery, searchResults } = useSearch(mainInvoiceList);

useEffect(() => {
  setInvoiceList(searchResults);
}, [searchResults]);

  
  useEffect(() => {
    const savedInvoices = localStorage.getItem("loggedInUser");
    if (savedInvoices) {
      const userData = JSON.parse(savedInvoices);
      userData.invoices = mainInvoiceList;
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
    }
  }, [mainInvoiceList]);

  useEffect(() => {
    if (deletedInvoice) {
      const updatedMainList = mainInvoiceList.filter(invoice => invoice.invoiceId !== deletedInvoice.invoiceId);
      const List = filteredInvoices.filter(invoice => invoice.invoiceId !== deletedInvoice.invoiceId);
      setMainInvoiceList(updatedMainList);  
      setInvoiceList(List);
    }
  }, [deletedInvoice]);
  
  
  
  useEffect(() => {
    setInvoiceList(filteredInvoices);
  }, [filteredInvoices]);

  const handleCreateInvoice = () => {
    navigate("/CreateInvoice");
  };

  const handleApplyFilter = () => {
    applyFilter();
    setShowFilter(false);
  };

  const handleShowAll = () => {
    setSearchQuery('');
    setFilterType('');
    setFilterValue('');
    setFilterStatus({ paid: false, unpaid: false });
    setInvoiceList(mainInvoiceList);
  };

  return (
    <div className="AllInvoices">
      <div className="containerr">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="buttons">
          <button className="create-invoice" onClick={handleCreateInvoice}>
            <FaFileInvoice className="icon" /> Create Invoice
          </button>
          <button className="filter" onClick={() => setShowFilter(!showFilter)}>
            <FaFilter className="icon" /> Filters
          </button>
          <button className="all-invoices" onClick={handleShowAll} style={{color:'#6a1b9a',fontWeight:'bolder'}}>
            All Invoices
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

      {showConfirmDelete && <DeleteConfirmationModal onConfirm={confirmDelete} onCancel={cancelDelete} />}

      <div className="invoice-container">
        <div className="invoice-header">
          <div className="header-item client">Client</div>
          <div className="header-item inv-num">Invoice Number</div>
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
              onDelete={() => handleDelete(invoice)}
              onEdit={handleCreateInvoice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardList;
