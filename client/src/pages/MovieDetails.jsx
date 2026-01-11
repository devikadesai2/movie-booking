import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function MovieDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        api.get(`/movies/${id}`)
            .then(res => {
                setMovie(res.data);
                if (res.data.showtimes.length > 0) setSelectedShowtime(res.data.showtimes[0]);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (selectedSeats.length === 0) return alert('Select at least one seat');

        setProcessing(true);
        try {
            await api.post('/bookings', {
                userId: user.id || user._id,
                movieId: movie._id,
                showtime: selectedShowtime.time,
                seats: selectedSeats,
                totalAmount: selectedSeats.length * selectedShowtime.price
            });
            alert('Booking Successful!');
            navigate('/my-bookings');
        } catch (error) {
            alert('Booking Failed: ' + (error.response?.data?.message || 'Unknown error'));
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
    );

    if (!movie) return <div className="text-white pt-24 text-center">Movie not found</div>;

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];

    const isSeatBooked = (seatId) => {
        return selectedShowtime?.seats && selectedShowtime.seats[seatId] === true;
    };

    return (
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Movie Info */}
            <div className="lg:col-span-1 space-y-8 glass-panel p-6 rounded-2xl h-fit sticky top-28">
                <div className="aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl shadow-brand-primary/20 relative">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-brand-primary/80 backdrop-blur-md rounded-full text-white text-sm font-bold shadow-lg">
                            {movie.genre}
                        </span>
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                    <div className="flex items-center gap-4 text-gray-300 text-sm mb-6">
                        <span className="flex items-center gap-1 text-yellow-400">
                            ★ <span className="text-white">{movie.rating}</span>
                        </span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span>2h 30m</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm">{movie.description}</p>
                </div>
            </div>

            {/* Booking Interface */}
            <div className="lg:col-span-2 space-y-8">
                <div className="glass-panel p-8 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-1 h-6 bg-brand-secondary rounded-full"></span>
                        Select Showtime
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {movie.showtimes.map((show, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setSelectedShowtime(show); setSelectedSeats([]); }}
                                className={`px-6 py-4 rounded-xl font-medium transition flex flex-col items-center min-w-[100px] border border-transparent 
                    ${selectedShowtime?.time === show.time
                                        ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/30 border-white/20'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'}`}
                            >
                                <div className="text-lg font-bold">{show.time}</div>
                                <div className="text-xs opacity-70 mt-1">${show.price}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="w-1 h-6 bg-brand-primary rounded-full"></span>
                        Select Seats
                    </h2>

                    {/* Screen */}
                    <div className="mb-12 flex flex-col items-center">
                        <div className="w-3/4 h-16 bg-gradient-to-b from-white/10 to-transparent mb-4 transform perspective-[500px] rotate-x-12 rounded-t-[50%] opacity-50 shadow-[0_-20px_60px_rgba(255,255,255,0.1)]"></div>
                        <p className="text-xs text-gray-500 tracking-[0.5em] font-light">SCREEN</p>
                    </div>

                    <div className="w-full overflow-x-auto pb-4">
                        <div className="min-w-[300px] flex flex-col gap-4 items-center">
                            {rows.map(row => (
                                <div key={row} className="flex gap-4">
                                    {cols.map(col => {
                                        const seatId = `${row}${col}`;
                                        const booked = isSeatBooked(seatId);
                                        const selected = selectedSeats.includes(seatId);
                                        return (
                                            <button
                                                key={seatId}
                                                disabled={booked}
                                                onClick={() => toggleSeat(seatId)}
                                                className={`w-10 h-10 rounded-lg text-xs font-bold transition flex items-center justify-center relative group
                            ${booked ? 'bg-white/5 text-gray-600 cursor-not-allowed' :
                                                        selected ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/50 scale-110 z-10' :
                                                            'bg-white/10 text-gray-400 hover:bg-white/20 hover:scale-110 hover:shadow-lg hover:shadow-white/5'}
                        `}
                                            >
                                                {seatId}
                                                {selected && <div className="absolute -inset-1 bg-brand-primary/30 blur-md -z-10 rounded-lg"></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-8 mt-8 border-t border-white/5 pt-6 text-xs text-gray-400">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/10"></div> Available</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-brand-primary shadow-lg shadow-brand-primary/50"></div> Selected</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/5 text-gray-600"></div> Sold</div>
                    </div>
                </div>

                {/* Checkout Bar */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 sticky bottom-6 shadow-2xl shadow-black/50 border-t border-white/20 backdrop-blur-xl bg-black/80">
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider">Total Price</p>
                        <p className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            ${selectedSeats.length * (selectedShowtime?.price || 0)}
                        </p>
                        <p className="text-xs text-gray-500">{selectedSeats.length} seats selected</p>
                    </div>
                    <button
                        onClick={handleBooking}
                        disabled={processing || selectedSeats.length === 0}
                        className={`px-12 py-4 rounded-xl font-bold text-lg text-white transition shadow-xl relative overflow-hidden group
                ${processing || selectedSeats.length === 0 ? 'bg-gray-800 cursor-not-allowed text-gray-500' : 'btn-primary'}
            `}
                    >
                        <span className="relative z-10">{processing ? 'Processing...' : 'Confirm Booking'}</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
