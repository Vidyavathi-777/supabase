import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: signup form, 2: OTP verification
  const [resendLoading, setResendLoading] = useState(false)

  const { signUpUser, verifyOtp, resendOtp } = UserAuth()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await signUpUser(email, password)
      if (result.success) {
        setStep(2)
        setMessage('Please check your email for the verification code.')
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await verifyOtp(email, otp)
      if (result.success) {
        setMessage('Email verified successfully! Redirecting...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await resendOtp(email)
      if (result.success) {
        setMessage('Verification code sent! Please check your email.')
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Failed to resend verification code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const goBackToSignup = () => {
    setStep(1)
    setOtp('')
    setError('')
    setMessage('')
  }

  if (step === 2) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
            <p className="text-sm text-gray-600 mb-1">
              We've sent a verification code to
            </p>
            <p className="text-sm font-medium text-gray-800">{email}</p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
                maxLength={6}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-blue-600 hover:underline font-medium disabled:text-blue-400 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={goBackToSignup}
              className="text-gray-600 hover:underline text-sm"
            >
              ← Back to signup
            </button>
          </div>

          {message && <p className="text-green-600 text-center text-sm">{message}</p>}
          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignUp}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Register Today!</h2>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline font-medium">
              Login in
            </Link>
          </p>
        </div>

        <div className="space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
            placeholder="Email"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            placeholder="Password (min. 6 characters)"
            required
            minLength={6}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          {message && <p className="text-green-600 text-center text-sm">{message}</p>}
          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        </div>
      </form>
    </div>
  )
}

export default Signup