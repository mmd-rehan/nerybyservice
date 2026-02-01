import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AddServiceForm } from './components/AddService/AddServiceForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-service" element={<div className="min-h-screen bg-gray-100 py-8"><AddServiceForm /></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
