import CustomButton from "../../components/customButton";
import PreviewInvoice from "../../components/previewInvoice";
import "../createInvoice/createInvoice.css";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import preview from "../../assets/eye.png";
import download from "../../assets/download.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OrderTable from "../../components/Table";
import Save from "../../assets/Save.png"

import { useUserContext } from "../../provider";
import { IClient, IInvoice, TableRow } from "../../types";

const EditInvoice = () => {
  const { id } = useParams();
  const previewRef = useRef(null);
  const [isTaxInputVisible, setIsTaxInputVisible] = useState(false);
  const [isDiscountInputVisible, setIsDiscountInputVisible] = useState(false);

  const { state, dispatch } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [listItems, setListItems] = useState<TableRow[]>([]);
  const [clientDetails, setClientDetails] = useState<IClient>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [invoiceDetails, setInvoiceDetails] = useState<IInvoice | null>(null);
  useEffect(() => {
    const storedInvoices = localStorage.getItem("loggedInUser");
    const invoices = storedInvoices ? JSON.parse(storedInvoices) : [];
    const existingInvoicesValue = invoices?.invoices || [];
    const foundInvoice = existingInvoicesValue.find((inv: IInvoice) => inv.invoiceId === id);
    if (foundInvoice) {
      setInvoiceDetails(foundInvoice);
      setClientDetails(foundInvoice.client);
      setListItems(foundInvoice.items);
    }
  }, [id]);


  if (!invoiceDetails) return <p>Invoice not found.</p>;

  const user = state.loggedInUser;
  if (!user) return <p>Please log in to create an invoice.</p>;

  const handleItemChange = (index, field: string, value:any) => {
    const updatedItems = [...listItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    const newSubTotal = updatedItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    setListItems(updatedItems);
    setInvoiceDetails((prev) =>
      prev ? { ...prev, subTotal: newSubTotal } : null
    );
  };
  const updateInvoiceTotal = (items: TableRow[]) => {
    const newSubTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setInvoiceDetails(prev => prev ? { ...prev, subTotal: newSubTotal } : null);
  };
  
  
  const handleAddItem = () => {
    const newItem: TableRow = { name: "", quantity: 1, price: 0 };
    const updatedItems = [...listItems, newItem];
    setListItems(updatedItems);
    updateInvoiceTotal(updatedItems);
  };
  

  const handleRemoveItem = (index: number) => {
    const updatedItems = listItems.filter((_, i) => i !== index);
    setListItems(updatedItems);
    updateInvoiceTotal(updatedItems);
  };
  
  const calculateTotal = () => {
    const subTotal = invoiceDetails?.subTotal || 0;
    const tax = invoiceDetails?.tax ? (invoiceDetails.tax / 100) * subTotal : 0;
    const discount = invoiceDetails?.discount
      ? (invoiceDetails.discount / 100) * subTotal
      : 0;
    return subTotal + tax - discount;
    console.log(subTotal);
  };

  const handleClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceDetails((prev) => {
      if (!prev) return null;
      const updatedInvoice = { ...prev, [name]: value };
      if (name === "tax" || name === "discount") {
        updatedInvoice.subTotal = calculateTotal();
      }
      return updatedInvoice;
    });
  };
  const handleSubmit = () => {
    const updatedInvoice = { ...invoiceDetails, items: listItems, client: clientDetails, subTotal: calculateTotal() };
    const storedInvoices = localStorage.getItem("savedInvoice");
    let invoices = storedInvoices ? JSON.parse(storedInvoices) : [];
    invoices = invoices.map((inv: IInvoice) => (inv.invoiceId === id ? updatedInvoice : inv));
    localStorage.setItem("savedInvoice", JSON.stringify(invoices));
    dispatch({ type: "UPDATE_INVOICE", payload: updatedInvoice });
  };
  const handlePreview = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDownload = async () => {
    if (!previewRef.current) {
      console.error("Preview ref is not attached to any element.");
      return;
    }

    const element = previewRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save("invoice.pdf");
  };


  return (
    <div className="wrapper">
      <div className="main">
        <div className="MainPart1">
          <div className="General-Info">
            <div className="G1">
              <div className="maglo">{user.name}</div>
              <div className="sales-maglo-com">{user.email}</div>
            </div>
            <div className="G2">
              <div className="textG2">{user.address}</div>
              <div className="phone">{user.phone}</div>
            </div>
          </div>
          <div className="card-theme-off">
            <div className="invoice-number">
              <div className="invoice-number2">Invoice Details</div>
              <div className="info">
                <div className="InvoiceDetails">
                  <div className="InvoiceDetailsText">Invoice Number</div>
                  <div className="LargeInvoiceNumber">
                    {invoiceDetails.invoiceId}
                  </div>
                </div>
                <div className="InvoiceDetails">
                  <div className="InvoiceDetailsText">Due Date</div>
                  <div className="input-container">
                    <input
                      type="date"
                      name="dueDate"
                      value={invoiceDetails.dueDate}
                      onChange={handleInvoiceChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="InvoiceDetails">
                  <div className="InvoiceDetailsText">Invoice Status</div>
                  <div className="input-container">
                    <select
                      id="status"
                      name="status"
                      className="input-field"
                      value={invoiceDetails.status ? "Paid" : "Unpaid"}
                      onChange={(e) =>
                        setInvoiceDetails({
                          ...invoiceDetails,
                          status: e.target.value === "Paid",
                        })
                      }
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
                {invoiceDetails.status && (
                  <div className="InvoiceDetails">
                    <div className="InvoiceDetailsText">Payment Method</div>
                    <div className="input-container">
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        className="input-field"
                        value={invoiceDetails.paymentMethod}
                        onChange={handleInvoiceChange}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="billed-to">
              <div className="billed-to2">Bill to</div>
              <div className="info2">
                <div className="InvoiceDetails">
                  <div className="InvoiceDetailsText">Client Name</div>
                  <div className="input-container">
                    <input
                      type="text"
                      name="name"
                      className="input-field"
                      value={clientDetails.name}
                      onChange={handleClientChange}
                    />
                  </div>
                </div>
                <div className="InvoiceDetails">
                  <div className="InvoiceDetailsText">Client phone</div>
                  <div className="input-container">
                    <input
                      type="tel"
                      name="phone"
                      value={clientDetails.phone}
                      className="input-field"
                      onChange={handleClientChange}
                    />
                  </div>
                </div>

                <div className="InvoiceDetails">
                  <div className="InvoiceDetailsText">Client Email</div>
                  <div className="input-container">
                    <input
                      type="email"
                      name="email"
                      value={clientDetails.email}
                      className="input-field"
                      onChange={handleClientChange}
                    />
                  </div>
                </div>

                <div className="InvoiceDetails">
                  <div className="InvoiceDetailsText">Client Address</div>
                  <div className="input-container">
                    <input
                      type="text"
                      name="address"
                      value={clientDetails.address}
                      className="input-field"
                      onChange={handleClientChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OrderTable
            items={listItems}
            onItemChange={handleItemChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
          <div className="CalculateDivMainCreate">
            <div></div>
            <div className="CalculateDiv">
              <div className="subTotalDiv">
                <div className="subTotalDiv">
                  <div className="TextG">Subtotal </div>
                  <div className="priceText">${invoiceDetails.subTotal}</div>
                </div>
              </div>
              <div className="subTotalDiv">
                <div className="TextG">Tax (%)</div>
                {isTaxInputVisible ? (
                  <input
                    type="number"
                    className="InputData"
                    name="tax"
                    value={invoiceDetails.tax}
                    onChange={handleInvoiceChange}
                    onBlur={() => setIsTaxInputVisible(false)}
                    autoFocus
                    placeholder="Enter tax (e.g., 10)"
                  />
                ) : (
                  <div
                    className="addButton"
                    onClick={() => setIsTaxInputVisible(true)}
                  >
                    Add
                  </div>
                )}
              </div>
              <div className="subTotalDiv">
                <div className="TextG">Discount </div>
                {isDiscountInputVisible ? (
                  <input
                    type="number"
                    className="InputData"
                    name="discount"
                    value={invoiceDetails.discount}
                    onChange={handleInvoiceChange}
                    onBlur={() => setIsDiscountInputVisible(false)}
                    autoFocus
                    placeholder="Enter discount (e.g. 10"
                  />
                ) : (
                  <div
                    className="addButton"
                    onClick={() => setIsDiscountInputVisible(true)}
                  >
                    Add
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="hidden" ref={previewRef}>
          <PreviewInvoice
            user={user}
            client={clientDetails}
            invoice={invoiceDetails}
            pageType="A4"
            list={listItems}
          />
        </div>

        <PreviewInvoice
          user={user}
          client={clientDetails}
          invoice={invoiceDetails}
          pageType="A6"
          list={listItems}
        />

        <div className="setting">
          <CustomButton icon={preview} text="Preview" onClick={handlePreview} />
          <CustomButton
            icon={download}
            text="Download"
            onClick={handleDownload}
          />
        </div>
        <div className="saveInvoice">
          <CustomButton
            icon={Save }
            text="Save Edit"
            onClick={handleSubmit}
          />
        </div>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <PreviewInvoice
              user={user}
              client={clientDetails}
              invoice={invoiceDetails}
              pageType="A4"
              list={listItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditInvoice;
