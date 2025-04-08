import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TeacherSignup = () => {
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
      const response = await fetch('http://localhost:5000/api/teacher/signup', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Signup successful! Your Roll Number is ${result.rollNumber}`);
        navigate('/teacher/login');
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error. Please try again later.');
    }
  };

  const styles = {
    container: {
      maxWidth: '450px',
      margin: '80px auto',
      padding: '30px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial',
      backgroundColor: '#fdfdfd',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    linkText: {
      textAlign: 'center',
      marginTop: '10px',
      fontSize: '14px',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Teacher Signup</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" required onChange={handleChange} style={styles.input} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={styles.input} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={styles.input} />
        <input type="file" name="profileImage" accept="image/*" required onChange={handleChange} style={styles.input} />

        <button type="submit" style={styles.button}>Signup</button>
        <p style={styles.linkText}>
          Already have an account? <Link to="/teacher/login" style={styles.link}>Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default TeacherSignup;
