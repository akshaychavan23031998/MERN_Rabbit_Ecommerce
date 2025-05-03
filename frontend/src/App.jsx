import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Privacy_Policy_Page from './pages/Privacy_Policy_Page'
import Terms_of_Service_Page from './pages/Terms_of_Service_Page'
import Home from './pages/Home'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Layout */}
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home/>}/>
        </Route>
        <Route>{/* Admin Layout */}</Route>
        <Route path="/privacy-policy" element={<Privacy_Policy_Page />} />
        <Route path="/terms" element={<Terms_of_Service_Page />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
