import { BrowserRouter, Route, Routes } from 'react-router';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;