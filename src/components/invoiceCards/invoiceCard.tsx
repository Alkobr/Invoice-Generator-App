import "./invoiceCard.css";
import { InvoiceCardProps } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import useRandomImage from "../../hook/useRandomImage";
import { useNavigate } from "react-router-dom";

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  client,
  invoiceId,
  dueDate,
  subTotal,
  status,
  onDelete,
}) => {
  const profileImage = useRandomImage(invoiceId);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editInvoice/${invoiceId}`);
  };

  return (
    <div className="invoice-card">
      <div className="invoice-item client-info">
        <img
          src={profileImage}
          className="circular-image"
          alt={`${client.name} Profile`}
        />
        <div className="client-details">
          <div className="client-name">{client.name}</div>
          <div className="client-email">{client.email}</div>
        </div>
      </div>
      <div className="invoice-item inv-num">{invoiceId}</div>
      <div className="invoice-item">{new Date(dueDate).toLocaleDateString()}</div>
      <div className="invoice-item">
        ${subTotal ? subTotal.toFixed(2) : "0.00"}
      </div>
      <div className={`invoice-item ${status ? "Paid" : "UnPaid"}`}>
        {status ? "Paid" : "Unpaid"}
      </div>
      <div className="invoice-item action-icons">
        <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={handleEdit} />
        <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={onDelete} />
      </div>
    </div>
  );
};

export default InvoiceCard;
