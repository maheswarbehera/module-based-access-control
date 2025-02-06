import useAuth from "./useAuth";

const useModuleAccess = (module) => {
    const user = useAuth();  
    console.log(user?.role.permissions.some(perm => perm.module.name.includes(module)))
    return user?.role.permissions.some(perm => perm.module.name.includes(module));
};
export default useModuleAccess;