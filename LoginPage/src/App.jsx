import { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, BookOpen } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Send authentication request to API
      const response = await fetch('http://localhost:8080/api/v1/auth/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle error response from API
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Store JWT token in localStorage or sessionStorage
      localStorage.setItem('token', data.token);
      
      // You might also want to store user info
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard'; // or use router.push('/dashboard') if using Next.js
      
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        {/* Logo and Header */}
        <div className="login-header">
          <div className="logo-container">
            <BookOpen size={28} className="logo-icon" />
          </div>
          <h1 className="login-title">University Course Scheduler</h1>
          <p className="login-subtitle">Sign in to your student account</p>
        </div>
        
        {/* Login Card */}
        <div className="login-card">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} className="error-icon" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <User size={16} className="input-icon" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Your student ID"
                  value={credentials.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={credentials.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="form-actions">
              <div className="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              <div className="forgot-password">
                <a href="#">Forgot your password?</a>
              </div>
            </div>
            
            {/* Login Button */}
            <div className="form-submit">
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LogIn size={16} className="login-icon" />
                )}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
      
          
          
        </div>
        
      </div>
    </div>
  );
}