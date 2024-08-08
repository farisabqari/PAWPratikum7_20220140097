import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useColorModeValue, useToast } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Profile({ session, setSession }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username }) {
    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', 
      });

      if (error) {
        throw error;
      }
      toast({
        title: 'Sukses',
        description: 'Profil berhasil diperbarui!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      setSession(null);
      navigate('/login');
      toast({
        title: 'Berhasil Keluar',
        description: 'Anda telah berhasil keluar dari akun',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal keluar dari akun',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box maxWidth="400px" margin="0 auto" mt={8}>
      <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={6}>
          <Heading as="h1" size="xl" color={textColor}>Profile</Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="text" value={session.user.email} disabled />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input 
              type="text" 
              value={username || ''} 
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <Button 
            onClick={() => updateProfile({ username })}
            colorScheme="blue" 
            isLoading={loading}
          >
            Update Profile
          </Button>
          <Button onClick={handleSignOut} colorScheme="red">
            Sign Out
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}