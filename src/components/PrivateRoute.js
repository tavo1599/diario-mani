import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ userRole, children }) => {
    if (userRole !== 1 && userRole !== 2) {
        // Si el usuario no tiene el rol adecuado (1 o 2), redirige a la página principal
        return <Navigate to="/" />;
    }
    // Si tiene el rol adecuado, renderiza el contenido de la ruta
    return children;
};

export default PrivateRoute;
