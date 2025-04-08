import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    width: '400px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  },
  input: {
    width: '100%',
    marginBottom: '1rem',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    marginBottom: '1rem',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
  },
  closeBtn: {
    background: 'red',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    float: 'right',
    marginBottom: '1rem'
  }
};

const AddClassModal = ({ onClose }) => {
  const [className, setClassName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [studentIds, setStudentIds] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/teachers').then(res => setTeachers(res.data));
    axios.get('http://localhost:5000/api/admin/students').then(res => setStudents(res.data));
    axios.get('http://localhost:5000/api/admin/subjects').then(res => setSubjects(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newClass = {
      className: className,
      teacher: teacherId,
      students: studentIds,
      subjects: subjectIds
    };

    try {
      await axios.post('/api/admin/classes', newClass);
      alert('Class created successfully');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating class');
    }
  };




  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>X</button>
        <h2>Create New Class</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />

          <select
            style={styles.select}
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>

          <select
            style={styles.select}
            multiple
            value={studentIds}
            onChange={(e) =>
              setStudentIds(Array.from(e.target.selectedOptions, option => option.value))
            }
          >
            {students.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>

          <select
            style={styles.select}
            multiple
            value={subjectIds}
            onChange={(e) =>
              setSubjectIds(Array.from(e.target.selectedOptions, option => option.value))
            }
          >
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>

          <button type="submit" style={styles.button}>Create Class</button>
        </form>
      </div>
    </div>
  );
};

export default AddClassModal;
