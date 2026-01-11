import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(name, email, password);
        if (res.success) {
            await login(email, password); // Auto login
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-md glass-panel p-10 rounded-2xl shadow-2xl relative z-10">
                <h2 className="text-4xl font-bold text-center mb-2 text-white">Create Account</h2>
                <p className="text-center text-gray-400 mb-8">Join CineBook today</p>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-primary py-3 text-lg shadow-lg shadow-pink-500/25"
                    >
                        Get Started
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <p className="text-gray-400 text-sm">
                        Already have an account? <Link to="/login" className="text-brand-secondary hover:text-purple-400 font-semibold transition ml-1">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
