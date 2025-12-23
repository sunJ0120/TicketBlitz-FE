import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md">
          {/* 로고 */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              T
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">로그인</h1>
          <p className="text-zinc-500 text-center mb-8">계정에 로그인하세요</p>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
            )}

            <div className="mb-4">
              <label className="block text-zinc-400 text-sm mb-2">이메일</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition"
                  required
              />
            </div>

            <div className="mb-4">
              <label className="block text-zinc-400 text-sm mb-2">비밀번호</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition"
                  required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
                <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                로그인 유지
              </label>
              <a href="#" className="text-purple-400 text-sm hover:underline">비밀번호 찾기</a>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-[#12121a] text-zinc-500 text-sm">또는</span>
              </div>
            </div>

            <button
                type="button"
                onClick={() => {
                  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
                }}
                className="w-full py-3 bg-[#FEE500] text-black font-semibold rounded-lg hover:bg-[#FDD835] transition flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 2C5.029 2 1 5.129 1 8.989c0 2.464 1.644 4.627 4.114 5.847-.18.676-.65 2.453-.746 2.835-.118.472.173.466.364.339.15-.1 2.384-1.622 3.354-2.28.296.044.6.068.914.068 4.971 0 9-3.129 9-6.989S14.971 2 10 2" fill="black"/>
              </svg>
              카카오 로그인
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6">
            아직 계정이 없으신가요? <Link to="/signup" className="text-purple-400 hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
  );
}