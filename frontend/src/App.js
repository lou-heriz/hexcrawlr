import './App.css';
import { GlobalStyles } from './styles/Global.ts'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/Theme.ts'
import Map from './components/map/index.js';



function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Map />
      </ThemeProvider>
    </div>
  );
}

export default App;
