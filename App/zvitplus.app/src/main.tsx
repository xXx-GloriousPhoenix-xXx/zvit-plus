import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from './app/providers/RouterProvider';
import './index.css'
import { Provider } from 'react-redux';
import { store } from './app/store/store';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider />
        </Provider>
    </StrictMode>,
)
