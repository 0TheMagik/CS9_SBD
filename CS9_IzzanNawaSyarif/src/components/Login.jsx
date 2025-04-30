import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      let response;
      const url = `${API_URL}/user/` + (isLogin ? 'login' : 'register');
      
      if (!isLogin) {
        const queryParams = new URLSearchParams(formData).toString();
        response = await fetch(`${url}?${queryParams}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          }
        });
      } else {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }

      console.log(`${isLogin ? 'Login' : 'Registration'} successful:`, data);
      
      if (!isLogin) {
        setFormData({
          name: '',
          email: '',
          password: ''
        });
        setIsLogin(true);
      } else {
        navigate('/stores')
      }
      
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'Network error occurred');
    }
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h1>

        <div className="flex justify-between mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`w-1/2 p-3 text-lg font-medium ${
              isLogin 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`w-1/2 p-3 text-lg font-medium ${
              !isLogin 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required={!isLogin}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">
              Email
            </label>
            <input
              type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                placeholder="Enter your email"
              />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
