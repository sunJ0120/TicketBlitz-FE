// src/pages/OAuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">로그인 처리 중...</div>
      </div>
  );
}