import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev, [e.target.name]: e.target.value,
        }))
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(formData);
        try{
            let request = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            let data = await request.json();

            if (!request.ok || !data.ok) {
                return setError(data.message || data.detail || 'Login failed.');
            }

            setError(null);
            const access_token = data.access_token;
            localStorage.setItem('access_token', access_token);
        }catch(err){
            return setError('Network error, Please Try again later.');
        }

        

        Swal.fire({
            title: 'Success!',
            text: 'You have Logged In Successfully. You can access Protected Routes now.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            navigate('/');
        });
        };
    
        useEffect(() => {
            if (error) {
                Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
                confirmButtonText: 'OK'
                });
            }
        }, [error]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-4 w-80 m-4">
                <Link to="/" className=" top-3 left-4 text-gray-500 hover:text-gray-700 text-sm"> <FiArrowLeft size={18} /> </Link>
                <h2 className="text-2xl font-semibold text-center text-gray-700">Log In</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email..."
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />

                <button type="submit" className="bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700 transition">
                    Log In
                </button>
            </form>
        </div>
  );
};


export default Login;