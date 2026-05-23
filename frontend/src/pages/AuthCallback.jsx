import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authGoogleSession } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash || '';
    const match = hash.match(/session_id=([^&]+)/);
    if (!match) {
      navigate('/login');
      return;
    }
    const sessionId = decodeURIComponent(match[1]);

    // Read intended role from query param (set during signup)
    const params = new URLSearchParams(location.search);
    const role = params.get('role') || 'customer';

    (async () => {
      try {
        const { user } = await authGoogleSession(sessionId, role);
        setUser(user);
        toast.success(`Καλώς ήρθες, ${user.name}!`);
        // clean URL fragment
        window.history.replaceState(null, '', '/');
        if (user.role === 'merchant') navigate('/merchant/dashboard', { state: { user } });
        else navigate('/', { state: { user } });
      } catch (e) {
        toast.error('Σφάλμα ταυτοποίησης. Παρακαλώ δοκίμασε ξανά.');
        navigate('/login');
      }
    })();
  }, [navigate, location.search, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 text-[#2d7a3a] animate-spin mb-4" />
      <p className="text-gray-600">Συνδεόμαστε...</p>
    </div>
  );
};

export default AuthCallback;
