// RadioPlayer.js
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { FaBroadcastTower } from 'react-icons/fa';

const RadioPlayer = () => {
    const audioRef = useRef(null);
    const radioStreams = [
        { id: 1, name: "La Zona", url: "https://mdstrm.com/audio/5fada54116646e098d97e6a5/live.m3u8" },
        { id: 2, name: "Radio Oxigeno", url: "https://mdstrm.com/audio/5fab0687bcd6c2389ee9480c/live.m3u8" } // Replace with actual URL
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeStream, setActiveStream] = useState(radioStreams[0]);

    const togglePlayerVisibility = () => {
        setIsOpen(!isOpen);
    };

    const switchStream = (stream) => {
        if (activeStream.id !== stream.id) {
            setActiveStream(stream);
            setIsPlaying(false); // Reset play state
        }
    };

    useEffect(() => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(activeStream.url);
            hls.attachMedia(audioRef.current);
        } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            audioRef.current.src = activeStream.url;
        }
    }, [activeStream]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(error => {
                        console.error("Playback failed:", error);
                    });
            }
        }
    };

    return (
        <div className="fixed right-0 bottom-0 p-4 flex flex-col items-center z-50">
            <button 
                onClick={togglePlayerVisibility} 
                className="bg-white p-2 rounded-full shadow-lg mb-2 hover:bg-gray-200"
                title={isOpen ? "Cerrar reproductor" : "Abrir reproductor"}
            >
                <FaBroadcastTower size={32} className="text-red-600" />
            </button>

            {isOpen && (
                <div className="bg-white p-4 shadow-lg rounded-lg w-64">
                    <h2 className="text-lg font-semibold mb-2">En Vivo</h2>
                    <div className="mb-4">
                        {radioStreams.map((stream) => (
                            <button
                                key={stream.id}
                                onClick={() => switchStream(stream)}
                                className={`block w-full text-left p-2 rounded ${activeStream.id === stream.id ? 'bg-blue-100' : ''}`}
                            >
                                {stream.name}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handlePlayPause} 
                        className="text-blue-600 font-semibold mb-2"
                    >
                        {isPlaying ? "Pausar" : "Reproducir"}
                    </button>
                </div>
            )}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
    );
};

export default RadioPlayer;
