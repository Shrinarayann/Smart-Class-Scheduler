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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Simulate login process
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Demo login logic - in a real app, this would be an API call
      if (credentials.username === 'student' && credentials.password === 'password') {
        // Successful login
        alert('Login successful! Redirecting to dashboard...');
      } else {
        // Failed login
        setError('Invalid username or password');
      }
    }, 1000);
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
                <div className="input-icon">
                  <User size={16} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Your Student Email"
                  value={credentials.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <div className="input-icon">
                  <Lock size={16} />
                </div>
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
                  <svg className="loading-spinner" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LogIn size={16} className="login-icon" />
                )}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          {/* Divider */}
          {/* <div className="divider">
            <span>Or continue with</span>
          </div> */}
          
          
          {/* <div className="social-login">
            <button className="social-button">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4373 21.879V14.89H7.89931V12H10.4373V9.797C10.4373 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1913C13.9503 8.562 13.5633 9.333 13.5633 10.124V12H16.3363L15.8933 14.89H13.5633V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z"></path>
              </svg>
            </button>
            <button className="social-button">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M21.8 10.5h-10v3.6h5.7c-.5 2.5-2.7 3.9-5.7 3.9-3.6 0-6.4-2.8-6.4-6.4s2.8-6.4 6.4-6.4c1.5 0 2.8.5 3.8 1.5l2.7-2.7C16.5 2.1 14.1 1 11.5 1 6.1 1 2 5.1 2 10.5S6.1 20 11.5 20c4.8 0 9.1-3.5 9.1-9.5 0-.2 0-.8-.2-1.5z"></path>
              </svg>
            </button>
            <button className="social-button">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M12.2498 19.5C14.1498 19.5 15.7398 18.86 17.1998 17.54L14.9398 15.81C14.2098 16.29 13.2998 16.59 12.2498 16.59C9.93979 16.59 7.99979 14.98 7.31979 12.84H4.96979V14.62C6.39979 17.5 9.19979 19.5 12.2498 19.5Z"></path>
                <path d="M7.31979 12.84C7.01979 11.84 7.01979 10.76 7.31979 9.75999V7.97998H4.96979C3.98979 9.85998 3.98979 12.74 4.96979 14.62L7.31979 12.84Z"></path>
                <path d="M12.2498 7.41001C13.3398 7.39001 14.3898 7.79001 15.1798 8.54001L17.1698 6.55001C15.6598 5.11001 13.9798 4.30001 12.2498 4.32001C9.19979 4.32001 6.39979 6.32001 4.96979 9.20001L7.31979 10.98C7.99979 8.84001 9.93979 7.23001 12.2498 7.41001Z"></path>
              </svg>
            </button>
          </div> */}
          
          {/* Sign Up Link */}
          {/* <p className="signup-link">
            Don't have an account?{' '}
            <a href="#">Register here</a>
          </p> */}
        </div>
        
        {/* Footer */}
        <div className="login-footer">
          <p>&copy; 2025 University Name. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}