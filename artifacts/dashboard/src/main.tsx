import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import { getToken } from './lib/auth';
import App from './App';
import './index.css';

// Attach JWT to every API request automatically
setAuthTokenGetter(getToken);

createRoot(document.getElementById('root')!).render(<App />);
