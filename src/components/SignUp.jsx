import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Heading, useColorModeValue, Link, useToast } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function SignUp({ setSession }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setSession(data.session);
      toast({
        title: 'Pendaftaran Berhasil',
        description: 'Periksa email Anda untuk tautan konfirmasi!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Kesalahan',
        description: error.error_description || error.message,
        status: 'error',
        duration: 5000,
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
          <Heading as="h1" size="xl" color={textColor}>Sign Up</Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleSignUp} colorScheme="green" isLoading={loading} width="full">
            Sign Up
          </Button>
          <Text>
            Already have an account? <Link as={RouterLink} to="/login" color="blue.500">Login</Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}