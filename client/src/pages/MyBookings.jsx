import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get(`/bookings/user/${user.id || user._id}`)
                .then(res => setBookings(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            setBookings(bookings.filter(b => b._id !== id));
            alert('Booking cancelled successfully');
        } catch (error) {
            alert('Failed to cancel booking: ' + (error.response?.data?.message || 'Error'));
        }
    };

    if (!user) return <div className="text-white text-center pt-32">Please login to view bookings.</div>;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
    );

    return (
        <div className="pt-32 px-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">My Tickets</h1>
                <p className="text-gray-400 hidden sm:block">History of your cinematic journeys</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-500 mb-4">No tickets found</h3>
                    <p className="text-gray-400 mb-8">You haven't booked any movies yet.</p>
                    <Link to="/" className="btn-primary">Browse Movies</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {bookings.map(booking => (
                        <div key={booking._id} className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row gap-8 hover:bg-white/5 transition duration-300 group">
                            <div className="w-full md:w-32 h-48 rounded-xl overflow-hidden shadow-lg shadow-black/50 relative flex-shrink-0">
                                <img src={booking.movieId?.poster} alt="Poster" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-1">{booking.movieId?.title}</h3>
                                            <p className="text-brand-secondary font-medium tracking-wide text-sm mb-6 uppercase">{booking.movieId?.genre}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBooking(booking._id)}
                                            className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20 transition hover:bg-red-500/20"
                                        >
                                            Cancel Ticket
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500 mb-1 uppercase text-xs font-bold">Showtime</p>
                                            <p className="text-white font-medium text-lg">{booking.showtime}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1 uppercase text-xs font-bold">Seats</p>
                                            <p className="text-white font-medium text-lg tracking-wider">{booking.seats.join(', ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1 uppercase text-xs font-bold">Total</p>
                                            <p className="text-brand-primary font-bold text-lg">${booking.totalAmount}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1 uppercase text-xs font-bold">Date</p>
                                            <p className="text-gray-300">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Confirmed
                                    </span>
                                    <span className="text-xs text-gray-600 font-mono">ID: {booking._id.slice(-8).toUpperCase()}</span>
                                </div>
                            </div>

                            {/* QR Code Stub */}
                            <div className="hidden lg:flex flex-col items-center justify-center border-l border-white/10 pl-8 border-dashed">
                                <div className="w-24 h-24 bg-white p-2 rounded-lg mb-2">
                                    <div className="w-full h-full bg-gray-900 pattern-grid-lg flex items-center justify-center">
                                        <div className="grid grid-cols-2 gap-1 opacity-50">
                                            <div className="w-2 h-2 bg-white"></div>
                                            <div className="w-2 h-2 bg-black"></div>
                                            <div className="w-2 h-2 bg-black"></div>
                                            <div className="w-2 h-2 bg-white"></div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Scan Entry</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
