import { useNavigate } from 'react-router-dom';
import landingImage from '../assets/landingpage.jpg'; // adjust path if needed

const LandingPage = () => {
  const navigate = useNavigate();

  const styles = {
    landingPage: {
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    },
    heroSection: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: 'brightness(60%)',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.4)',
    },
    heroContent: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      textAlign: 'center',
    },
    heading: {
      fontSize: '3rem',
      marginBottom: '30px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    button: {
      padding: '12px 24px',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
  };

  return (
    <div style={styles.landingPage}>
      <div style={styles.heroSection}>
        <img src={landingImage} alt="Hero" style={styles.heroImage} />
        <div style={styles.overlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heading}>Welcome to Virtual Classroom</h1>
          <h1 style={styles.heading2}>Register As</h1>
          <div style={styles.buttonGroup}>
            <button
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              onClick={() => navigate('/admin/Signup')}
            >
              Admin
            </button>
            <button
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              onClick={() => navigate('/student/signup')}
            >
              Student
            </button>
            <button
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              onClick={() => navigate('/teacher/Signup')}
            >
              Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
