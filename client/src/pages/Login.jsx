import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

            <div className="w-full max-w-md glass-panel p-10 rounded-2xl shadow-2xl relative z-10">
                <h2 className="text-4xl font-bold text-center mb-2 text-white">Welcome Back</h2>
                <p className="text-center text-gray-400 mb-8">Access your account to continue</p>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="w-full btn-primary py-3 text-lg shadow-lg shadow-purple-500/25"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <p className="text-gray-400 text-sm">
                        Don't have an account? <Link to="/register" className="text-brand-primary hover:text-pink-400 font-semibold transition ml-1">Create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
