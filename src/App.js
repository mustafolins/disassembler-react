import './App.css';
import DisassembledCode from './Components/DisassembledCode';
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
          <DisassembledCode />
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
