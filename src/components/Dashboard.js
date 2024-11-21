import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import NoticiasRecientes from './NoticiasRecientes';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [allNoticias, setAllNoticias] = useState([]);
    const [noticiaCount, setNoticiaCount] = useState(0);
    const [deportesCount, setDeportesCount] = useState(0);
    const [politicaCount, setPoliticaCount] = useState(0);
    const [internacionalesCount, setInternacionalesCount] = useState(0); // Estado para internacionales
    const [totalNoticias, setTotalNoticias] = useState(0);
    const [isScraping, setIsScraping] = useState(false);
    const [noticiasPorFuente, setNoticiasPorFuente] = useState([]);
    const [masLeidas, setMasLeidas] = useState([]);
    const [internacionales, setInternacionales] = useState([]); // Estado para noticias internacionales

    useEffect(() => {
        const fetchAllNoticias = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/home');
                const noticias = response.data;

                setAllNoticias(noticias);
                setTotalNoticias(noticias.length);
            } catch (error) {
                console.error('Error al obtener todas las noticias:', error);
            }
        };

        const fetchNoticiasCountByCategory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias/count');
                const counts = response.data;

                counts.forEach(item => {
                    if (item.coleccion === 'noticia') {
                        setNoticiaCount(item.total);
                    } else if (item.coleccion === 'deportes') {
                        setDeportesCount(item.total);
                    } else if (item.coleccion === 'politica') {
                        setPoliticaCount(item.total);
                    } else if (item.coleccion === 'internacionales') {
                        setInternacionalesCount(item.total); // Setear el estado para internacionales
                    }
                });
            } catch (error) {
                console.error('Error al obtener el conteo de noticias por categoría:', error);
            }
        };

        const fetchNoticiasPorFuente = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias/fuente-count');
                setNoticiasPorFuente(response.data);
            } catch (error) {
                console.error('Error al obtener el conteo de noticias por fuente:', error);
            }
        };

        const fetchMasLeidas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias-mas-leidas');
                setMasLeidas(response.data);
            } catch (error) {
                console.error('Error al obtener las noticias más leídas:', error);
            }
        };

        const fetchInternacionales = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/internacionales');
                setInternacionales(response.data);
            } catch (error) {
                console.error('Error al obtener las noticias internacionales:', error);
            }
        };

        fetchAllNoticias();
        fetchNoticiasCountByCategory();
        fetchNoticiasPorFuente();
        fetchMasLeidas();
        fetchInternacionales(); // Llamar a la función para internacionales
    }, []);

    const handleScrape = async () => {
        setIsScraping(true);
        try {
            const response = await axios.post('http://localhost:5000/api/scrape');
            alert(response.data.message);
        } catch (error) {
            alert('Error al iniciar el scraping');
            console.error('Error al iniciar el scraping:', error);
        } finally {
            setIsScraping(false);
        }
    };

    const barChartData = {
        labels: ['Noticia', 'Deportes', 'Política', 'Internacionales'],
        datasets: [
            {
                label: 'Cantidad de Noticias',
                data: [noticiaCount, deportesCount, politicaCount, internacionalesCount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: ['Noticia', 'Deportes', 'Política', 'Internacionales'],
        datasets: [
            {
                label: 'Distribución de Noticias',
                data: [noticiaCount, deportesCount, politicaCount, internacionalesCount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto p-4 max-h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold mb-4">Bienvenido al Dashboard</h1>
            <p className="mb-4">Esta es la sección del Dashboard para usuarios con rol de administrador.</p>

            <button
                onClick={handleScrape}
                className={`p-2 mb-4 bg-blue-600 text-white rounded ${isScraping ? 'opacity-50' : ''}`}
                disabled={isScraping}
            >
                {isScraping ? 'Scrapeando...' : 'Iniciar Scraping'}
            </button>

            <div className="mb-8 grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-100 rounded shadow">
                    <h3 className="text-xl font-bold">Total de Noticias</h3>
                    <p className="text-2xl">{totalNoticias}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded shadow">
                    <h3 className="text-xl font-bold">Noticias Generales</h3>
                    <p className="text-2xl">{noticiaCount}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded shadow">
                    <h3 className="text-xl font-bold">Noticias de Deportes</h3>
                    <p className="text-2xl">{deportesCount}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded shadow">
                    <h3 className="text-xl font-bold">Noticias de Política</h3>
                    <p className="text-2xl">{politicaCount}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded shadow">
                    <h3 className="text-xl font-bold">Noticias Internacionales</h3>
                    <p className="text-2xl">{internacionalesCount}</p>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white shadow rounded max-h-64 overflow-hidden">
                    <h2 className="text-xl font-semibold mb-2">Visualización de Noticias</h2>
                    <div style={{ height: '200px' }}>
                        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="p-4 bg-white shadow rounded max-h-64 overflow-hidden">
                    <h2 className="text-xl font-semibold mb-2">Distribución de Noticias</h2>
                    <div style={{ height: '200px' }}>
                        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
            <NoticiasRecientes />
            {/* <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Noticias Internacionales</h2>
                <div className="max-h-48 overflow-y-auto bg-white p-4 rounded shadow">
                    <ul className="list-disc list-inside">
                        {internacionales.slice(0, 5).map((noticia, index) => (
                            <li key={index} className="mb-2">
                                <strong>{noticia.titulo}</strong> - {noticia.fecha}
                            </li>
                        ))}
                    </ul>
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;
