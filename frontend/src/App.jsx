
import reactLogo from './assets/react.svg' 
import './App.css'
import Sidebar from './components/Sidebar'
import Login from './pages/Login' 
import { useEffect, useState } from 'react';
import api from './config';
import CreateRole from './Role';
import Dashboard from './components/theme/Index';
import DigitalSignature from './components/DigitalSignature';
import CameraCapture from './components/CaptureCam';

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
    // fetchModules();
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
      <CreateRole/>
      {/* <Dashboard/> */}
      {/* <DigitalSignature/> */}
      {/* <CameraCapture/> */}
    </>
  )
}

export default App
