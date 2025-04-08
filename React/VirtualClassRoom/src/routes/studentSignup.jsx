import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('profileImage', formData.profileImage);
    data.append('isApproved', false); // Default false

    try {
      const response = await fetch('http://localhost:5000/api/student/signup', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Signup successful! Your Roll Number is ${result.rollNumber}`);
        navigate('/student/login');
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Student Signup</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.form}>
        <input type="text" name="name" placeholder="Name" required onChange={handleChange} style={styles.input} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={styles.input} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={styles.input} />
        <label htmlFor="">Upload Image</label>
        <input type="file" name="profileImage" accept="image/*"  required onChange={handleChange} style={styles.inputFile} />

        <button type="submit" style={styles.button}>Signup</button>
        <p style={styles.linkText}>Already have an account? <Link to="/student/login" style={styles.link}>Login here</Link></p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '80px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  inputFile: {
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default StudentSignup;
