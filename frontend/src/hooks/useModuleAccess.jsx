import useAuth from "./useAuth";

const useModuleAccess = (module) => {
    const user = useAuth();  
    console.log(user?.role.permissions.some(perm => perm.module.name.includes(module)))
    return user?.role.permissions.some(perm => perm.module.name.includes(module));
};
export default useModuleAccess;

export const useReadWriteUpdatdeDelete = (module, action) => {
    const user = useAuth();  

    // Check if the module exists in the user's role permissions and if the specific action is allowed
    return user?.role.permissions.some(perm => 
        perm.module.name.includes(module) && perm[action] === true
    );
};


export const useModulePermission = (module, action = null) => {
    const user = useAuth();

    // Check if the module exists in the user's role permissions
    const hasModuleAccess = user?.role.permissions.some(perm => perm.module.name.includes(module));

    // If an action is provided, check if the user has that specific action permission
    if (action) {
        const hasActionPermission = user?.role.permissions.some(perm => 
            perm.module.name.includes(module) && perm[action] === true
        );
        return hasActionPermission;
    }

    // If no action is specified, just return module access
    return hasModuleAccess;
};
 
