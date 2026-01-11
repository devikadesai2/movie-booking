import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies');
                setMovies(res.data);
            } catch (error) {
                console.error("Failed to fetch movies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
    );

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                    <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Experience Cinema
                    </span>
                    <br />
                    <span className="text-white">Like Never Before</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Book tickets for the latest blockbusters with our premium booking experience.
                    Immersive sound, comfortable seating, and unforgettable moments wait.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {movies.map(movie => (
                    <Link to={`/movie/${movie._id}`} key={movie._id} className="group glass-panel rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-brand-secondary/20">
                        <div className="aspect-[2/3] w-full overflow-hidden relative">
                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition duration-300">
                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{movie.title}</h3>
                                <div className="flex items-center justify-between text-sm font-medium">
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-blue-300 border border-white/10">{movie.genre}</span>
                                    <span className="flex items-center gap-1 text-yellow-400 bg-black/40 px-2 py-1 rounded-md">
                                        ★ {movie.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
