import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { session, signOut } = UserAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, <span className="font-medium text-blue-600">{session?.user?.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        <hr className="mb-6" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">My Courses</h2>
            <ul className="text-gray-600 list-disc list-inside">
              <li>React Fundamentals</li>
              <li>Supabase Integration</li>
              <li>Authentication and Context API</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Recent Activity</h2>
            <ul className="text-gray-600 list-disc list-inside">
              <li>Signed up via email</li>
              <li>Viewed course: Supabase Auth</li>
              <li>Updated profile information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
