import Layout from './components/Layout';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;