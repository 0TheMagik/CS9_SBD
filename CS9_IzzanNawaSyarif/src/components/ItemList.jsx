import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ItemList() {
  const [items, setItems] = useState([])
  const [store, setStore] = useState(null)
  const [error, setError] = useState('')
  const { storeId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/store/${storeId}`)
        const data = await response.json()
        if (data.success) {
          setStore(data.payload)
        }
      } catch (err) {
        setError('Failed to fetch store details')
      }
    }

    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/item/byStoreId/${storeId}`)
        const data = await response.json()
        if (data.success) {
          setItems(data.payload)
        }
      } catch (err) {
        setError('Failed to fetch items')
      }
    }

    fetchStoreDetails()
    fetchItems()
  }, [storeId])

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {store?.name || 'Store Items'}
            </h1>
            <p className="text-gray-600 mt-2">{store?.address}</p>
          </div>
          <button
            onClick={() => navigate('/stores')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Stores
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mt-2">Price: ${item.price}</p>
                <p className="text-gray-600">Stock: {item.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
