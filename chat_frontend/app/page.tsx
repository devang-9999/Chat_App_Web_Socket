'use client';

import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Authentication/Login';
import Signup from '@/components/Authentication/Signup';

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) router.push('/chat');
  }, [router]);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5} mb={2}>
        <Typography variant="h3">Talk-A-Tive</Typography>
      </Box>

      <Box border="1px solid #ddd" borderRadius={2} p={3}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        {tab === 0 && <Login />}
        {tab === 1 && <Signup />}
      </Box>
    </Container>
  );
}
