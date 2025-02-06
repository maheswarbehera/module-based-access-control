import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config";

const Login = () => {
    const [formdata, setFormdata] = useState({
        email: "s@gmail.com",
        password: "admin"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); 

    // const navigate = useNavigate();  // Added useNavigate hook

    const handleChange = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", formdata);
            
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            // navigate("/");  // Used useNavigate for redirection
        } catch (error) {
            setError(error.response.data.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>  {/* Changed from action to onSubmit */}
                <input 
                    type="email" 
                    name="email" 
                    value={formdata.email} 
                    onChange={handleChange} 
                    placeholder="Email"
                />
                <input 
                    type="password" 
                    name="password" 
                    value={formdata.password} 
                    onChange={handleChange} 
                    placeholder="Password"
                />
                <button type="submit" disabled={loading}>Submit</button>  {/* Disabled while loading */}
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}  {/* Error message display */}
        </div>
    );
};

export default Login;
