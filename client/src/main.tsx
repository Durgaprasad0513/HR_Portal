
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
 defaultOptions: {
 queries: {
 retry: 1,
 refetchOnWindowFocus: true, // Auto-refresh when user switches back to the tab
 refetchInterval: 5000, // Poll every 5 seconds for real-time updates across the app
 staleTime: 4000, // Keep data fresh just under the polling interval
 },
 },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
 <QueryClientProvider client={queryClient}>
 <App />
 </QueryClientProvider>,
);
