import { API_URL } from '@/utils/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const navigate = useNavigate();

   const logout = async () => {
      setLoading(true);
      setError(null);
      try {
         const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
            credentials: 'include',
         });
         if (response.status === 200) {
            navigate('/');
         } else {
            setError('An error occurred');
         }
      } catch (err) {
         console.error('Error logging out:', err);
         setError('Ann error occurred');
      } finally {
         setLoading(false);
      }
   };

   return { logout, loading, error };
};

export default useLogout;
