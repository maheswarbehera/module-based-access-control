import { Navigate } from "react-router-dom";
import useModuleAccess from "../hooks/useModuleAccess";

const OrdersPage = () => {
    if (!useModuleAccess("order")) return <Navigate to="/dashboard" />;
    return <h1>Orders Management</h1>;
};
export default OrdersPage;
