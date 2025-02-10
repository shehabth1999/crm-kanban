import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KanbanBoard from './pages/KanbanBoard'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <KanbanBoard />
  //</StrictMode> 
)
