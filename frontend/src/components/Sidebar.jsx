import { useEffect, useState } from "react";
import useModuleAccess, { useModulePermission } from "../hooks/useModuleAccess";
import api from "../config";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  // State to hold the values for name and description
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const canRead = useModulePermission('category', 'read');
  const canWrite = useModulePermission('category', 'write');
  const canUpdate = useModulePermission('category', 'update');
  const canDelete = useModulePermission('category', 'delete');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setData(data.categories);
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories');
        setLoading(false);
      }
    };
    if(canRead){
        fetchCategories();
    }
  }, [canRead]);

  // Handle input change for both fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value // Dynamically update name or description field based on 'name' attribute
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post('/categories', formData);
      console.log(res.data.message);
      alert(`Category created: ${formData.name}`);
      // Optionally, reset form data after success
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error("Error creating category:", error);
      alert('Failed to create category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await api.delete(`/categories/${id}`);
        console.log(res);
        alert(`Category with ID: ${id} deleted`);
        // Optionally, refresh the categories list after deletion
        setData(data.filter(cat => cat._id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
        alert('Failed to delete category.');
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await api.put(`/categories/${id}`, formData);
      console.log(res);
      alert(`Category with ID: ${id} updated`);
    } catch (error) {
      console.error("Error updating category:", error);
      alert('Failed to update category.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <nav>
        {canRead && <a href="/category">Category - Read</a>}
        {canWrite && <a href="/category">Category - Write</a>}
        {canUpdate && <a href="/category">Category - Update</a>}
        {canDelete && <a href="/category">Category - Delete</a>}

        <div>
          <form onSubmit={canWrite ? handleSubmit : () => alert('You do not have permission to write.')}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                />
              </label>
            </div>

            <div>
              <label>
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                />
              </label>
            </div>

            <button type="submit" disabled={!canWrite}>Submit</button>
          </form>
        </div>
      </nav>

      {canRead && (
        <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cat) => (
            <tr key={cat._id}>
              <td>{cat._id}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button 
                  onClick={() => canUpdate ? handleEdit(cat._id) : alert('You do not have permission to edit.')} 
                  disabled={!canUpdate}>
                  Edit
                </button>
                <button 
                  onClick={() => canDelete && handleDelete(cat._id)} 
                  disabled={!canDelete}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    </>
  );
};

export default Sidebar;
