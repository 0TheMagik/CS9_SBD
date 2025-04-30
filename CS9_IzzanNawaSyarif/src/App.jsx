import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Store from './components/Store'
import ItemList from './components/ItemList'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/stores" element={<Store />} />
          <Route path="/stores/:storeId/items" element={<ItemList />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}