import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2C3E50',
      light: '#34495E',
      dark: '#1A252F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#CB4335',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#27AE60',
      light: '#58D68D',
      dark: '#1E8449',
    },
    warning: {
      main: '#F39C12',
      light: '#F8C471',
      dark: '#D68910',
    },
    info: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2E86C1',
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#CB4335',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#566573',
      disabled: '#95A5A6',
    },
    grey: {
      50: '#ECF0F1',
      100: '#D5DBDB',
      200: '#BDC3C7',
      300: '#A6ACAF',
      400: '#95A5A6',
      500: '#7F8C8D',
      600: '#566573',
      700: '#2C3E50',
      800: '#1A252F',
      900: '#17202A',
    },
    divider: '#D5DBDB',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#2C3E50',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#2C3E50',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#2C3E50',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2C3E50',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2C3E50',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2C3E50',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#566573',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      color: '#566573',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#2C3E50',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      color: '#566573',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      color: '#95A5A6',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
      color: '#566573',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(44, 62, 80, 0.05)',
    '0px 4px 8px rgba(44, 62, 80, 0.1)',
    '0px 8px 16px rgba(44, 62, 80, 0.1)',
    '0px 12px 24px rgba(44, 62, 80, 0.15)',
    '0px 16px 32px rgba(44, 62, 80, 0.15)',
    '0px 20px 40px rgba(44, 62, 80, 0.2)',
    '0px 24px 48px rgba(44, 62, 80, 0.2)',
    '0px 28px 56px rgba(44, 62, 80, 0.25)',
    '0px 32px 64px rgba(44, 62, 80, 0.25)',
    '0px 36px 72px rgba(44, 62, 80, 0.3)',
    '0px 40px 80px rgba(44, 62, 80, 0.3)',
    '0px 44px 88px rgba(44, 62, 80, 0.35)',
    '0px 48px 96px rgba(44, 62, 80, 0.35)',
    '0px 52px 104px rgba(44, 62, 80, 0.4)',
    '0px 56px 112px rgba(44, 62, 80, 0.4)',
    '0px 60px 120px rgba(44, 62, 80, 0.45)',
    '0px 64px 128px rgba(44, 62, 80, 0.45)',
    '0px 68px 136px rgba(44, 62, 80, 0.5)',
    '0px 72px 144px rgba(44, 62, 80, 0.5)',
    '0px 76px 152px rgba(44, 62, 80, 0.55)',
    '0px 80px 160px rgba(44, 62, 80, 0.55)',
    '0px 84px 168px rgba(44, 62, 80, 0.6)',
    '0px 88px 176px rgba(44, 62, 80, 0.6)',
    '0px 92px 184px rgba(44, 62, 80, 0.65)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          boxShadow: '0 4px 15px rgba(44, 62, 80, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)',
            boxShadow: '0 6px 20px rgba(44, 62, 80, 0.3)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #E74C3C 0%, #EC7063 100%)',
          boxShadow: '0 4px 15px rgba(231, 76, 60, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #CB4335 0%, #E74C3C 100%)',
            boxShadow: '0 6px 20px rgba(231, 76, 60, 0.3)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(44, 62, 80, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 8px 30px rgba(44, 62, 80, 0.15)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '&:hover fieldset': {
              borderColor: '#2C3E50',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2C3E50',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#566573',
            '&.Mui-focused': {
              color: '#2C3E50',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #ECF0F1',
          padding: '16px',
        },
        head: {
          backgroundColor: '#F8F9FA',
          fontWeight: 600,
          color: '#2C3E50',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(44, 62, 80, 0.02)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(52, 152, 219, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(52, 152, 219, 0.12)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
        colorPrimary: {
          backgroundColor: 'rgba(44, 62, 80, 0.1)',
          color: '#2C3E50',
        },
        colorSecondary: {
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          color: '#E74C3C',
        },
        colorSuccess: {
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          color: '#27AE60',
        },
        colorWarning: {
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
          color: '#F39C12',
        },
        colorInfo: {
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          color: '#3498DB',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          alignItems: 'center',
        },
        standardSuccess: {
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          color: '#27AE60',
          border: '1px solid rgba(39, 174, 96, 0.2)',
        },
        standardError: {
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          color: '#E74C3C',
          border: '1px solid rgba(231, 76, 60, 0.2)',
        },
        standardWarning: {
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
          color: '#F39C12',
          border: '1px solid rgba(243, 156, 18, 0.2)',
        },
        standardInfo: {
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          color: '#3498DB',
          border: '1px solid rgba(52, 152, 219, 0.2)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

export default theme;