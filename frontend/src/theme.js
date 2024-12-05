// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default Material-UI blue
    },
    secondary: {
      main: '#dc004e', // Default Material-UI pink
    },
  },
});

export default theme;
