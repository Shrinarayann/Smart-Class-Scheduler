import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
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
    
    setIsLoading(true);
    
    if (isAdminMode) {
      // Keeping the original admin login logic for now
      setTimeout(() => {
        setIsLoading(false);
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          onLogin('admin');
        } else {
          setError('Invalid admin credentials');
        }
      }, 1000);
    } else {
      // Student login with JWT authentication
      try {
        const response = await fetch('http://localhost:8080/auth/student', {
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
          throw new Error(data.message || 'Authentication failed');
        }
        
        // Store the JWT token in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'student');
        
        // Pass user info to parent component
        onLogin('student', data.user);
        
      } catch (err) {
        setError(err.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setCredentials({ username: '', password: '' });
    setError('');
  };

  return (
    <div className={`login-container ${isAdminMode ? 'admin-mode' : 'student-mode'}`}>
      <div className="login-box">
        
        {/* Logo Section */}
        <div className="logo-section">
          <h1>University Class Scheduler</h1>
        </div>

        {/* Toggle between Student and Admin */}
        <div className="toggle-container">
          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-btn ${!isAdminMode ? 'active' : ''}`}
              onClick={() => !isAdminMode ? null : toggleAdminMode()}
            >
              Student
            </button>
            <button
              type="button"
              className={`toggle-btn ${isAdminMode ? 'active' : ''}`}
              onClick={() => isAdminMode ? null : toggleAdminMode()}
            >
              Admin
            </button>
          </div>
        </div>
        
        {/* Login Card */}
        <div className={`login-card ${isAdminMode ? 'admin' : 'student'}`}>
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username">
                {isAdminMode ? 'Admin ID' : 'Username'}
              </label>
              <div className="input-container">
                <i className="fas fa-user"></i>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={isAdminMode ? 'Enter admin ID' : 'Enter student ID'}
                  value={credentials.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <i className="fas fa-lock"></i>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="form-extras">
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
            <div className="form-group">
              <button
                type="submit"
                className={`login-btn ${isAdminMode ? 'admin' : 'student'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Sign in as {isAdminMode ? 'Admin' : 'Student'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
          
          {!isAdminMode && (
            <>
              {/* Additional content for student mode can go here */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}