import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [responseData, setResponseData] = useState(null);

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation logic
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSubmitted(false);
    setResponseData(null);

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to API
    setLoading(true);
    try {
      // Using fetch with proper CORS handling
      const response = await fetch(
        'https://vernanbackend.ezlab.in/api/contact-us/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            message: formData.message.trim()
          }),
          mode: 'cors',
          credentials: 'include'
        }
      );

      const data = await response.json();
      
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok || response.status === 200) {
        setSubmitted(true);
        setResponseData(data);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setErrors({});
      } else {
        setApiError(`Server responded with status ${response.status}: ${data.detail || data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      setApiError(`Error: ${error.message}. Please check console and try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-wrapper">
        <h1 className="form-title">Contact Us</h1>
        
        {submitted && (
          <div className="success-message">
            ✓ Form Submitted Successfully!
            {responseData && <div style={{fontSize: '0.9rem', marginTop: '10px'}}>
              Server Response: {JSON.stringify(responseData).substring(0, 100)}...
            </div>}
          </div>
        )}

        {apiError && (
          <div className="error-message">
            ✗ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={errors.name ? 'input-error' : ''}
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phone ? 'input-error' : ''}
              required
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              rows="5"
              className={errors.message ? 'input-error' : ''}
              required
            ></textarea>
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <div style={{marginTop: '20px', fontSize: '0.85rem', color: '#666'}}>
          <p>Debug Info: Using Fetch API with CORS mode</p>
          <p>API: https://vernanbackend.ezlab.in/api/contact-us/</p>
        </div>
      </div>
    </div>
  );
}

export default App;
