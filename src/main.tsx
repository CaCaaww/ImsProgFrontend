
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ImsProgData } from './screens/ImsProgData'
import { Login } from './screens/Login.tsx';
import { Home } from './screens/Home.tsx';
import { CreateItem } from './screens/createItem.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={'/ImsProgFrontend'} >   
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/data" element={<ImsProgData />} />
      <Route path="/create" element={< CreateItem/>} />
      <Route path="/home" element={<Home/>} />
    </Routes>
  </BrowserRouter>
)
