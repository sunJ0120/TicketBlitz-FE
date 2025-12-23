import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/signup', { name, email, password });
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
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

          <h1 className="text-3xl font-bold text-white text-center mb-2">회원가입</h1>
          <p className="text-zinc-500 text-center mb-8">새 계정을 만들어보세요</p>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
            )}

            <div className="mb-4">
              <label className="block text-zinc-400 text-sm mb-2">이름</label>
              <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition"
                  required
              />
            </div>

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

            <div className="mb-6">
              <label className="block text-zinc-400 text-sm mb-2">비밀번호 확인</label>
              <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition"
                  required
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? '가입 중...' : '회원가입'}
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
                className="w-full py-3 rounded-lg bg-white text-zinc-800 font-medium flex items-center justify-center gap-2 hover:bg-zinc-100 transition"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Google로 계속하기
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6">
            이미 계정이 있으신가요? <Link to="/login" className="text-purple-400 hover:underline">로그인</Link>
          </p>
        </div>
      </div>
  );
}