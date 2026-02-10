'use client';

import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { ChatProvider } from '@/context/ChatContext';

const theme = createTheme();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  );
}
