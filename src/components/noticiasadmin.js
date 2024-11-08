import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoticiasAdmin = () => {
    const [noticias, setNoticias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editData, setEditData] = useState({ id: null, titulo: '', descripcion: '', fecha: '', fuente: '', image: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4); // Cantidad de elementos por página

    useEffect(() => {
        const fetchNoticias = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/home');
                setNoticias(response.data);
            } catch (error) {
                console.error('Error al obtener las noticias:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
            try {
                await axios.delete(`http://localhost:5000/api/noticias/${id}`);
                setNoticias(noticias.filter(noticia => noticia.id !== id));
                alert('Noticia eliminada correctamente.');
            } catch (error) {
                console.error('Error al eliminar la noticia:', error);
                alert('Hubo un error al eliminar la noticia.');
            }
        }
    };

    const handleEdit = (id) => {
        const noticiaToEdit = noticias.find(noticia => noticia.id === id);
        setEditData({ ...noticiaToEdit });
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/noticias/${editData.id}`, editData);
            alert('Noticia actualizada correctamente.');
            setEditData({ id: null, titulo: '', descripcion: '', fecha: '', fuente: '', image: '' });
            setShowEditModal(false);
            const response = await axios.get('http://localhost:5000/api/home');
            setNoticias(response.data);
        } catch (error) {
            console.error('Error al actualizar la noticia:', error);
            alert('Hubo un error al actualizar la noticia.');
        }
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNoticias = noticias.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(noticias.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage > 3 && currentPage < totalPages - 2) {
                pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            } else {
                pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
        }
        return pageNumbers.map((num, index) => (
            <button
                key={index}
                onClick={() => typeof num === 'number' && paginate(num)}
                className={`px-3 py-1 mx-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                disabled={typeof num !== 'number'}
            >
                {num}
            </button>
        ));
    };

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-3xl font-bold mb-4">Noticias Registradas</h1>
            <div className="flex justify-end mb-4">
                <label className="mr-2">Mostrar:</label>
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
            {isLoading ? (
                <p className="text-center text-gray-600">Cargando noticias...</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">ID</th>
                                    <th className="px-4 py-2 border-b">Título</th>
                                    <th className="px-4 py-2 border-b">Descripción</th>
                                    <th className="px-4 py-2 border-b">Fecha</th>
                                    <th className="px-4 py-2 border-b">Fuente</th>
                                    <th className="px-4 py-2 border-b">Operaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentNoticias.map((noticia, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="px-4 py-2 border-b">{noticia.id}</td>
                                        <td className="px-4 py-2 border-b">{noticia.titulo}</td>
                                        <td className="px-4 py-2 border-b">{truncateText(noticia.descripcion, 50)}</td>
                                        <td className="px-4 py-2 border-b">{noticia.fecha}</td>
                                        <td className="px-4 py-2 border-b">{noticia.fuente}</td>
                                        <td className="px-4 py-2 border-b">
                                            <button
                                                onClick={() => handleEdit(noticia.id)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(noticia.id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Paginador */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            className="px-3 py-1 mx-1 border rounded bg-white text-blue-500"
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </button>
                        {renderPagination()}
                        <button
                            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                            className="px-3 py-1 mx-1 border rounded bg-white text-blue-500"
                            disabled={currentPage === totalPages}
                        >
                            &raquo;
                        </button>
                    </div>
                </>
            )}
            {/* Modal para editar noticia */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-1/2">
                        <h2 className="text-xl font-bold mb-4">Editar Noticia</h2>
                        <input
                            type="text"
                            placeholder="Título"
                            value={editData.titulo}
                            onChange={(e) => setEditData({ ...editData, titulo: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <textarea
                            placeholder="Descripción"
                            value={editData.descripcion}
                            onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <input
                            type="date"
                            value={editData.fecha}
                            onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Fuente"
                            value={editData.fuente}
                            onChange={(e) => setEditData({ ...editData, fuente: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            placeholder="URL de la imagen"
                            value={editData.image}
                            onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticiasAdmin;
