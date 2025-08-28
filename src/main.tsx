
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ImsProgData } from './screens/ImsProgData'
import { Login } from './screens/Login.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={'/ImsProgFrontend'} >   
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/home" element={<ImsProgData />} />
    </Routes>
  </BrowserRouter>
)
