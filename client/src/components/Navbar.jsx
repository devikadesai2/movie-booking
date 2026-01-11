import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b-0 border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition">
                    CineBook
                </Link>

                <div className="flex items-center gap-8">
                    <Link to="/" className="text-gray-300 hover:text-white font-medium transition hover:scale-105">Movies</Link>
                    {user ? (
                        <>
                            <Link to="/my-bookings" className="text-gray-300 hover:text-white font-medium transition hover:scale-105">My Bookings</Link>
                            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm text-white font-medium">{user.name}</p>
                                    <p className="text-xs text-brand-secondary">Member</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-5 py-2 bg-white/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-full text-sm font-medium transition border border-white/5"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-300 hover:text-white font-medium transition">Login</Link>
                            <Link
                                to="/register"
                                className="btn-primary shadow-lg shadow-purple-500/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
