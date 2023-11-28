import './App.css';
import Disassembler from './Components/Disassembler';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Disassembler />
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
