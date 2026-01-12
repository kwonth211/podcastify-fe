import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../utils/apiClient";

/**
 * Google OAuth 콜백 페이지
 * Supabase Auth가 OAuth 리다이렉트를 처리합니다.
 */
const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('로그인 처리 중...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        setStatus('error');
        setMessage('Supabase가 설정되지 않았습니다.');
        return;
      }

      try {
        // Supabase가 URL의 hash fragment에서 인증 정보를 추출합니다
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus('success');
          setMessage('로그인 성공! 리다이렉트 중...');
          
          // 홈페이지로 리다이렉트
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          // 에러 파라미터 확인
          const errorParam = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (errorParam) {
            setStatus('error');
            setMessage(
              errorParam === 'access_denied'
                ? '로그인이 취소되었습니다.'
                : errorDescription || '로그인에 실패했습니다.'
            );
          } else {
            setStatus('error');
            setMessage('세션을 가져올 수 없습니다.');
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage(
          err instanceof Error ? err.message : '로그인 처리 중 오류가 발생했습니다.'
        );
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          {status === 'error' ? "❌" : status === 'success' ? "✅" : "⏳"}
        </div>
        <p>{message}</p>
        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            홈으로 돌아가기
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
