import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

export default function Store() {
  const [stores, setStores] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${API_URL}/store/getAll`)
        const data = await response.json()
        
        if (data.success) {
          setStores(data.payload)
        } else {
          throw new Error(data.message)
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch stores')
      }
    }

    fetchStores()
  }, [])

  const handleLogout = () => {
    navigate('/')
  }

  const handleStoreClick = (storeId) => {
    navigate(`/stores/${storeId}/items`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Stores</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {stores.map((store) => (
            <div 
              key={store.id}
              onClick={() => handleStoreClick(store.id)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-800">{store.name}</h2>
              <p className="text-gray-600 mt-2">{store.address}</p>
              <div className="mt-4 flex justify-end">
                <span className="text-blue-600 hover:text-blue-800">View Items →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
