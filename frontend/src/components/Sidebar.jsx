import useModuleAccess from "../hooks/useModuleAccess";

const Sidebar = () => {
    return (
        <nav>
            {useModuleAccess("catalog") && <a href="/catalog">Catalog</a>}
            {useModuleAccess("category") && <a href="/category">Category</a>}
            {useModuleAccess("product") && <a href="/product">Product</a>}
            {useModuleAccess("order") && <a href="/order">Order</a>}
        </nav>
    );
};
export default Sidebar;