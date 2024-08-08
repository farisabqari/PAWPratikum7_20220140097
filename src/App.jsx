import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';

export default function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ChakraProvider>
      <Box padding={4}>
        <Routes>
          <Route path="/login" element={!session ? <Login setSession={setSession} /> : <Navigate to="/profile" />} />
          <Route path="/signup" element={!session ? <SignUp setSession={setSession} /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={session ? <Profile session={session} setSession={setSession} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={session ? "/profile" : "/login"} />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
}