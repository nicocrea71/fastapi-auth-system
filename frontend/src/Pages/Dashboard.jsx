import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Dashboard = () => {
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    const access_token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!access_token) {
            Swal.fire({
            title: 'Unauthorized!',
            text: 'You must be logged in to access the dashboard.',
            icon: 'error',
            confirmButtonText: 'OK'
            }).then(() => {
            navigate('/login');
            });
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let response = await fetch('/api/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                
                if (response.status === 401) {
                    return Swal.fire({
                        title: 'Session Expired!',
                        text: 'Please log in again to continue.',
                        icon: 'warning',
                        confirmButtonText: 'Login'
                        }).then(() => {
                        localStorage.removeItem('access_token');
                        navigate('/login');
                    });
                }

                let data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || data.detail || 'Failed to fetch user data');
                }

                setUserData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("access_token");
                Swal.fire({
                    title: "Logged Out!",
                    text: "You have been logged out successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/");
            }
        });
    };

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-lg animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center">
                <Link to="/" className=" top-3 left-4 text-gray-500 hover:text-gray-700 text-sm"> <FiArrowLeft size={18} /></Link>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome to Your Dashboard</h1>
                <p className="text-gray-600 mb-6">This is a protected page. Only authenticated users can access it.</p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left">
                <h2 className="font-semibold text-gray-700 mb-2">Your Info</h2>
                <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {userData.email}
                </p>
                </div>

                <button
                onClick={handleLogout}
                className="mt-8 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-medium shadow-md"
                >
                Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;