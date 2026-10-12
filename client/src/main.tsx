
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
 defaultOptions: {
 queries: {
 retry: 1,
 refetchOnWindowFocus: true, // Auto-refresh when user switches back to the tab
 staleTime: 30_000, // Reuse recent data across route changes; focus refetch keeps it current.
 },
 },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
 <QueryClientProvider client={queryClient}>
 <App />
 </QueryClientProvider>,
);
