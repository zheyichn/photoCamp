import { createTheme } from '@mui/material/styles';

export default function ThemeBuilder() {

    const theme = createTheme({
        typography: {
            fontFamily: 'Lato',
        },
        components: {
            MuiGrid: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#FAFAFA'
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#3AB4F2'
                    }
                }
            }
        },
        palette: {
            secondary: {
                main: '#3AB4F2'
            }
        }
    })

    return theme;
}