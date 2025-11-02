import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './router/AppRouter';
import NotificationToast from './components/NotificationToast';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';
import './styles/animations.css';
import './styles/colors.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <BookProvider>
            <NotificationProvider>
              <AppRouter />
              <NotificationToast />
            </NotificationProvider>
          </BookProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

