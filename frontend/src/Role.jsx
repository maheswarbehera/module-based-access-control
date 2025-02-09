// import { useState } from "react";
// import axios from "axios";
// import api from "./config";

// const CreateRole = () => {
//   const [roleName, setRoleName] = useState("");
//   const [permissions, setPermissions] = useState([]);
//   const [modules, setModules] = useState([
//     { name: "catalog" },
//     { name: "category" },
//     { name: "product" },
//     { name: "order" },
//   ]);

//   // Handle role name change
//   const handleRoleNameChange = (e) => {
//     setRoleName(e.target.value);
//   };

//   // Handle permission changes for each module
//   const handlePermissionChange = (moduleName, action, checked) => {
//     setPermissions((prevPermissions) => {
//       const existingModulePermissions = prevPermissions.find(
//         (perm) => perm.module === moduleName
//       );

//       if (existingModulePermissions) {
//         // Update the specific action (read, write, update, delete) based on checkbox status
//         existingModulePermissions[action] = checked; // If checked is true, it sets to true; else false
//       } else {
//         // If no permissions exist for the module, create a new entry with the action set to the checkbox state (true/false)
//         const newPermission = {
//           module: moduleName,
//           read: false,   // Default to false, will be set to true if checkbox is checked
//           write: false,
//           update: false,
//           delete: false,
//         };
//         newPermission[action] = checked; // Set the action (read, write, etc.) to true/false
//         prevPermissions.push(newPermission);
//       }

//       return [...prevPermissions];
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const roleData = {
//       name: roleName,
//       permissions,
//     };

//     try {
//       const response = await api.post("/roles", roleData); // Send to backend to create role
//       alert("Role created successfully!");
//     } catch (error) {
//       console.error("Error creating role:", error);
//       alert("Error creating role");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Role Name:</label>
//         <input
//           type="text"
//           value={roleName}
//           onChange={handleRoleNameChange}
//           required
//           placeholder="Enter role name"
//         />
//       </div>

//       <div>
//         <h3>Assign Permissions:</h3>
//         {modules.map((module) => (
//           <div key={module.name}>
//             <h4>{module.name}</h4>
//             <label>
//               <input
//                 type="checkbox"
//                 onChange={(e) =>
//                   handlePermissionChange(module.name, "read", e.target.checked)
//                 }
//               />
//               Read
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 onChange={(e) =>
//                   handlePermissionChange(module.name, "write", e.target.checked)
//                 }
//               />
//               Write
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 onChange={(e) =>
//                   handlePermissionChange(module.name, "update", e.target.checked)
//                 }
//               />
//               Update
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 onChange={(e) =>
//                   handlePermissionChange(module.name, "delete", e.target.checked)
//                 }
//               />
//               Delete
//             </label>
//           </div>
//         ))}
//       </div>

//       <button type="submit">Create Role</button>
//     </form>
//   );
// };

import React, { useEffect, useState } from 'react';
import api from './config'; // Ensure correct API setup

function CreateRole() {
  const [roleName, setRoleName] = useState('');
  const [modulesWithPermissions, setModulesWithPermissions] = useState([]);

  // Fetch modules with their permissions
  useEffect(() => {
    const fetchModulesWithPermissions = async () => {
      try {
        const { data } = await api.get('/roles/permission');  // Endpoint that returns modules with permissions
        console.log('Modules and Permissions Data:', data.modulesWithPermissions);
        // Initialize permissions with default values
        const initializedModules = data.modulesWithPermissions.map(module => ({
          ...module,
          permissions: {
            read: false,
            write: false,
            update: false,
            delete: false,
          }
        }));
        setModulesWithPermissions(initializedModules);  // Set the modules with default permissions
      } catch (error) {
        console.error('Error fetching modules and permissions:', error);
      }
    };
    fetchModulesWithPermissions();
  }, []);

  // Handle role name input change
  const handleRoleNameChange = (event) => {
    setRoleName(event.target.value);
  };

  // Handle permission change for each module
  const handlePermissionChange = (module, permissionType, value) => {
    setModulesWithPermissions(prevModules => {
      return prevModules.map(mod => {
        if (mod.module === module) {
          return {
            ...mod,
            permissions: {
              ...mod.permissions,
              [permissionType]: value,  // Update the permission type (read, write, update, delete)
            }
          };
        }
        return mod;
      });
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Format data for API request to match the desired payload
    const roleData = {
      name: roleName,
      permissions: modulesWithPermissions.map(module => ({
        module: module.module,
        read: module.permissions.read,
        write: module.permissions.write,
        update: module.permissions.update,
        delete: module.permissions.delete
      }))
    };

    try {
      const response = await api.post('/roles', roleData); // Endpoint to create the role
      console.log(response.data); // Handle success
      alert('Role created successfully!');
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Error creating role');
    }
  };

  return (
    <div>
      <h2>Create Role</h2>
      <form onSubmit={handleSubmit}>
        {/* Role Name */}
        <div>
          <label htmlFor="roleName">Role Name:</label>
          <input
            type="text"
            id="roleName"
            value={roleName}
            onChange={handleRoleNameChange}
            required
            placeholder="Enter role name"
          />
        </div>

        {/* Permissions for each module */}
        <div>
          <h3>Assign Permissions:</h3>
          {modulesWithPermissions.map((module) => (
            <div key={module.module}>
              <h4>{module.module}</h4>
              <label>
                <input
                  type="checkbox"
                  checked={module.permissions.read}
                  onChange={(e) => handlePermissionChange(module.module, 'read', e.target.checked)}
                />
                Read
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={module.permissions.write}
                  onChange={(e) => handlePermissionChange(module.module, 'write', e.target.checked)}
                />
                Write
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={module.permissions.update}
                  onChange={(e) => handlePermissionChange(module.module, 'update', e.target.checked)}
                />
                Update
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={module.permissions.delete}
                  onChange={(e) => handlePermissionChange(module.module, 'delete', e.target.checked)}
                />
                Delete
              </label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit">Create Role</button>
      </form>
    </div>
  );
}

export default CreateRole;
