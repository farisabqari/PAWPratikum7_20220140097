import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Heading, useColorModeValue, Link, useToast } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function Login({ setSession }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session);
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.error_description || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };


  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box maxWidth="400px" margin="0 auto" mt={8}>
      <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={6}>
          <Heading as="h1" size="xl" color={textColor}>Login</Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleLogin} colorScheme="blue" isLoading={loading} width="full">
            Login
          </Button>
          <Text>
            Don't have an account? <Link as={RouterLink} to="/signup" color="blue.500">Sign Up</Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}