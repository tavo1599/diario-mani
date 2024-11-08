import React, { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthModals from './AuthModals';
import logo from '../assets/Diario-r.png';

const Navbar = ({ setCategory }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/verify-role', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUserRole(response.data.rol);
                setUserName(localStorage.getItem('userName'));
                setLoggedIn(true);
            })
            .catch(error => {
                console.error('Error al verificar el rol:', error);
                setLoggedIn(false);
            });
        }

        const handleStorageChange = () => {
            setLoggedIn(!!localStorage.getItem('token'));
            setUserName(localStorage.getItem('userName') || '');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuRef]);

    const handleCategoryChange = (category) => {
        setCategory(category);
    };

    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
        setIsUserMenuOpen(false);
    };

    const toggleRegisterModal = () => {
        setIsRegisterModalOpen(!isRegisterModalOpen);
        setIsUserMenuOpen(false);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: username,
                contrasena: password,
            });
            const { token, rol, nombre } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userName', nombre);
            setUserRole(rol);
            setUserName(nombre);
            setLoggedIn(true);
            alert('Inicio de sesión exitoso');
            setIsLoginModalOpen(false);
            
            // Actualiza la página después de iniciar sesión
            window.location.reload();
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Usuario o contraseña incorrectos');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setLoggedIn(false);
        setUserRole(null);
        setUserName('');
        alert('Cierre de sesión exitoso');
        window.location.reload();
        navigate('/');
    };

    return (
        <>
            <nav className="bg-white fixed w-full shadow-md z-10">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div
                        className="flex items-center text-xl font-bold cursor-pointer"
                        onClick={() => handleCategoryChange('home')}
                    >
                        <img src={logo} alt="Logo" className="w-14 h-14 mr-2" />
                        Diario Mani
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={() => handleCategoryChange('home')} className="text-gray-700 hover:text-blue-600">Home</button>
                        <button onClick={() => handleCategoryChange('politica')} className="text-gray-700 hover:text-blue-600">Política</button>
                        <button onClick={() => handleCategoryChange('deportes')} className="text-gray-700 hover:text-blue-600">Deportes</button>
                    </div>
                    <div className="relative flex items-center">
                        {loggedIn && userName ? (
                            <span className="mr-2 text-gray-700 font-medium">Bienvenido, {userName}</span>
                        ) : null}
                        <div ref={userMenuRef} className="relative">
                            <FaUser
                                className="text-gray-700 cursor-pointer hover:text-blue-600"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                size={24}
                            />
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                                    <div className="flex flex-col items-start">
                                        {loggedIn ? (
                                            <>
                                                {(userRole === 1 || userRole === 2) && (
                                                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                                                        Panel
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                                                >
                                                    Cerrar sesión
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={toggleLoginModal} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">
                                                    Iniciar sesión
                                                </button>
                                                <button onClick={toggleRegisterModal} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">
                                                    Registrarse
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <AuthModals
                isLoginModalOpen={isLoginModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
                toggleLoginModal={toggleLoginModal}
                toggleRegisterModal={toggleRegisterModal}
                handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                email={email}
                setEmail={setEmail}
            />
        </>
    );
};

export default Navbar;
