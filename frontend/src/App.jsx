
import reactLogo from './assets/react.svg' 
import './App.css'
import Sidebar from './components/Sidebar'
import Login from './pages/Login' 
import { useEffect, useState } from 'react';
import api from './config';

function App() { 
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]); // Fetch available modules from API

  // Fetch modules to assign permissions
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const { data } = await api.get("/modules"); // Endpoint to fetch all modules
        setModules(data.modules);  // Assuming the response has a `modules` array
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);

  // Handle role name input change
  const handleRoleNameChange = (event) => {
    setRoleName(event.target.value);
  };

  // Handle permission change for each module
  const handlePermissionChange = (moduleName, permissionType, value) => {
    setPermissions((prevPermissions) => {
      const existingPermission = prevPermissions.find((perm) => perm.module === moduleName);
      if (existingPermission) {
        existingPermission[permissionType] = value;
      } else {
        prevPermissions.push({
          module: moduleName,
          [permissionType]: value,
        });
      }
      return [...prevPermissions];
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const roleData = {
      name: roleName,
      permissions,
    };

    try {
      const response = await api.post('/roles', roleData);  // Send to backend to create role
      console.log(response.data);  // Handle success
      alert('Role created successfully!');
    } catch (error) {
      console.error("Error creating role:", error);
      alert('Error creating role');
    }
  };
  return (
    <>
      <div> 
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> 
      <Login/>
      <Sidebar/> 
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
          {modules.map((module) => (
            <div key={module._id}>
              <h4>{module.name}</h4>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handlePermissionChange(module.name, 'read', e.target.checked)}
                />
                Read
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handlePermissionChange(module.name, 'write', e.target.checked)}
                />
                Write
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handlePermissionChange(module.name, 'update', e.target.checked)}
                />
                Update
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handlePermissionChange(module.name, 'delete', e.target.checked)}
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
    </>
  )
}

export default App
