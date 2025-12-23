import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="text-xl font-bold text-white">TICKETBLITZ</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link to="/" className="text-zinc-400 hover:text-white transition">홈</Link>
            <Link to="/concerts" className="text-zinc-400 hover:text-white transition">공연 목록</Link>
          </div>

          <div>
            {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
                >
                  로그아웃
                </button>
            ) : (
                <Link
                    to="/login"
                    className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
                >
                  로그인
                </Link>
            )}
          </div>
        </div>
      </nav>
  );
}