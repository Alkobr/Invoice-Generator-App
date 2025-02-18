import { Action, IState } from "../types";

const reducer = (state:IState, action:Action) => {
  switch (action.type) {
    case "STORE_LOCAL_STORAGE":
      return { ...state, users: action.payload };

    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };

    case "LOGIN":
      return { ...state, loggedInUser: action.payload };

    case "LOGOUT": {
      if (!state.loggedInUser) return state;
      
      const updatedUsers = state.users.map(user =>
        user.email === state.loggedInUser?.email
          ? { ...user, invoices: [...user.invoices, ...(state.loggedInUser.invoices || [])] }
          : user
      );
      
      return { ...state, loggedInUser: null, users: updatedUsers };
    }

    case "ADD_INVOICE": {
      if (!state.loggedInUser) return state;
      
      const updatedUser = {
        ...state.loggedInUser,
        invoices: Array.isArray(state.loggedInUser.invoices)
          ? [...state.loggedInUser.invoices, action.payload]
          : [action.payload],
      };
      
      return { ...state, loggedInUser: updatedUser };
    }

    case "SET_CURRENT_INVOICE": {
      if (!state.loggedInUser) return state;
      return {
        ...state,
        loggedInUser: { ...state.loggedInUser, currentInvoice: action.payload },
      };
    }

    case "UPDATE_INVOICE": {
      if (!state.loggedInUser || !state.loggedInUser.invoices) return state;
    
      const updatedInvoices = state.loggedInUser.invoices.map(invoice =>
        invoice.invoiceId === action.payload.invoiceId ? action.payload : invoice
      );
    
      return {
        ...state,
        loggedInUser: { ...state.loggedInUser, invoices: updatedInvoices },
      };
    }

    default:
      return state;
  }
};

export default reducer;