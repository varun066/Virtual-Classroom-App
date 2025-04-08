import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnnouncementCard from "../components/AnnouncementCard";
import AddClassModal from "../components/AddClassModal";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null); // for consistency
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    profileImage: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);

  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editTeacherFormData, setEditTeacherFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    profileImage: "",
  });
  const [showTeacherEditModal, setShowTeacherEditModal] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [subjectData, setSubjectData] = useState({
    name: "",
    code: "",
    periods: "",
  });
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [announcementData, setAnnouncementData] = useState({
    title: "",
    message: "",
    link: "",
    announcedBy: "",
  });
  const [files, setFiles] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [announcements, setAnnouncements] = useState([]);

  const [className, setClassName] = useState("");
  const [Cteacher, setCTeacher] = useState("");
  const [Cstudents, setCStudents] = useState([]);
  const [Csubjects, setCSubjects] = useState([]);

  const [showClassModal, setShowClassModal] = useState(false);

  const [classes, setClasses] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editClassName, setEditClassName] = useState("");
  const [editCTeacher, setEditCTeacher] = useState("");
  const [editCStudents, setEditCStudents] = useState([]);
  const [editCSubjects, setEditCSubjects] = useState([]);

  const [quires, setQuires] = useState([]);

  const [showAnsModal, setShowAnsModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setAdmin(storedUser);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/teachers")
      .then((res) => setTeachers(res.data));
    axios
      .get("http://localhost:5000/api/admin/students")
      .then((res) => setStudents(res.data));
    axios
      .get("http://localhost:5000/api/admin/subjects")
      .then((res) => setSubjects(res.data));
  }, []);

  useEffect(() => {
    if (activeTab === "home") {
      axios
        .get("http://localhost:5000/api/admin/announcements")
        .then((res) => setAnnouncements(res.data))
        .catch((err) => console.error("Error fetching students:", err));
    }

    if (activeTab === "students") {
      axios
        .get("http://localhost:5000/api/admin/students")
        .then((res) => setStudents(res.data))
        .catch((err) => console.error("Error fetching students:", err));
    }

    if (activeTab === "teachers") {
      axios
        .get("http://localhost:5000/api/admin/teachers")
        .then((res) => setTeachers(res.data))
        .catch((err) => console.error("Error fetching teachers:", err));
    }

    if (activeTab === "subjects") {
      axios
        .get("http://localhost:5000/api/admin/subjects")
        .then((res) => setSubjects(res.data))
        .catch((err) => console.error("Error fetching subjects:", err));
    }

    if (activeTab === "classes") {
      axios
        .get("http://localhost:5000/api/admin/classes")
        .then((res) => setClasses(res.data))
        .catch((err) => console.error("Error fetching subjects:", err));
    }

    if (activeTab === "quires") {
      axios
        .get("http://localhost:5000/api/quires")
        .then((res) => setQuires(res.data))
        .catch((err) => console.error("Error fetching quiers:", err));
    }
  }, [activeTab]);

  const approveStudent = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/students/${id}/approve`);
      alert("Student approved");
      // refresh list

      fetchStudents();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const startEditStudent = (student) => {
    setEditingStudentId(student._id);
    setEditFormData({
      name: student.name,
      email: student.email,
      password: student.password,
      rollNumber: student.rollNumber,
      profileImage: student.profileImage || "",
    });
    setShowEditModal(true);
  };

  const submitUpdateStudent = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/students/${editingStudentId}`,
        editFormData
      );
      alert("Student updated");
      setShowEditModal(false);
      fetchStudents(); // refresh student list
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const approveTeacher = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/teachers/${id}/approve`);
      alert("Teacher approved");
      fetchTeachers(); // refresh
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const startEditTeacher = (teacher) => {
    setEditingTeacherId(teacher._id);
    setEditTeacherFormData({
      name: teacher.name,
      email: teacher.email,
      password: teacher.password,
      rollNumber: teacher.rollNumber,
      profileImage: teacher.profileImage || "",
    });
    setShowTeacherEditModal(true);
  };

  const submitUpdateTeacher = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/teachers/${editingTeacherId}`,
        editTeacherFormData
      );
      alert("Teacher updated");
      setShowTeacherEditModal(false);
      fetchTeachers(); // refresh
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const subjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = { ...subjectData, periods: Number(subjectData.periods) };
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/admin/subjects/${editId}`,
          formData
        );
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/admin/subjects", formData);
      }
      setSubjectData({ name: "", code: "", periods: "" });
      fetchSubjects(); // refresh subject list
    } catch (err) {
      alert("Error: " + err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/subjects"
      );
      setSubjects(response.data); // assuming your backend returns an array of subjects
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  // ✅ Set form for editing
  const subjectEdit = (subject) => {
    setEditId(subject._id);
    setSubjectData({
      name: subject.name,
      code: subject.code,
      periods: subject.periods,
    });
  };

  // ✅ Delete subject
  const subjectDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      await axios.delete(`http://localhost:5000/api/admin/subjects/${id}`);
      fetchSubjects();
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", announcementData.title);
      formData.append("message", announcementData.message);
      formData.append("link", announcementData.link);
      formData.append("announcedBy", announcementData.announcedBy);
      //formData.append('adminId', adminId);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      await axios.post(
        "http://localhost:5000/api/admin/announcements",
        formData
      );
      alert("Announcement added!");
      setAnnouncementData({
        title: "",
        message: "",
        link: "",
        announcedBy: "",
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Error adding announcement");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/announcements"
      );
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={styles.loading}>Loading announcements...</p>;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting announcement", err);
    }
  };

  const handleStudentCheckbox = (id) => {
    setCStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubjectCheckbox = (id) => {
    setCSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    const newClass = {
      className,
      teacher: Cteacher,
      students: Cstudents,
      subjects: Csubjects,
    };
    try {
      await axios
        .post("http://localhost:5000/api/admin/classes", newClass)

        .then(() => {
          // Re-fetch classes
          return axios.get("http://localhost:5000/api/admin/classes");
        });
      alert("Class created successfully!");
      setClassName("");
      setCTeacher("");
      setCStudents([]);
      setCSubjects([]);
    } catch (err) {
      console.error(err);
      alert("Error creating class");
    }
  };

  const handleEditClass = (cls) => {
    setEditingClass(cls);
    setEditClassName(cls.className);
    setEditCTeacher(cls.teacher._id);
    setEditCStudents(cls.students.map((s) => s._id));
    setEditCSubjects(cls.subjects.map((sub) => sub._id));
    setIsEditModalOpen(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        className: editClassName,
        teacher: editCTeacher,
        students: editCStudents,
        subjects: editCSubjects,
      };

      await axios.put(
        `http://localhost:5000/api/admin/classes/${editingClass._id}`,
        updatedData
      );
      alert("Class updated!");
      setIsEditModalOpen(false);
      fetchClasses(); // refresh the list
    } catch (err) {
      alert("Failed to update class", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const handleAnswerClick = async (q) => {
    setSelectedQuestion(q);
    setAnswerText("");
    setShowAnsModal(true);

    // const answer = prompt('Enter your answer:');
    // if (!answer) return;

    // try {
    //   await axios.put(`http://localhost:5000/api/Quires/${q._id}`, { answer });
    //   // Refresh list
    //   const updated = quires.map(item =>
    //     item._id === q._id ? { ...item, answer } : item
    //   );
    //   setQuires(updated);
    // } catch (err) {
    //   console.error('Failed to update answer:', err);
    // }
  };

  const handleSubmitAnswer = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/quires/${selectedQuestion._id}`,
        {
          answer: answerText,
        }
      );

      // Update local list
      const updated = quires.map((item) =>
        item._id === selectedQuestion._id
          ? { ...item, answer: answerText }
          : item
      );
      setQuires(updated);
      setShowAnsModal(false);
    } catch (err) {
      console.error("Failed to update answer:", err);
    }
  };

  const fetchQuires = () => {
    axios
      .get("http://localhost:5000/api/Quires")
      .then((res) => setQuires(res.data))
      .catch((err) => console.error("Error fetching quires:", err));
  };

  const handleLogout = () => {
    // const navigate = useNavigation();
    // Clear authentication (adjust based on your auth method)
    localStorage.removeItem("user"); // If using JWT
    sessionStorage.removeItem("user");
    // Redirect to Landing Page
    window.location.href = "/"; // Redirect to landing page
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div>
            <div style={styles.container}>
              <div style={styles.card}>
                <div style={styles.icon}>🛡️</div>
                <div style={styles.details}>
                  <p>
                    <strong>Name:</strong> {admin.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {admin.email}
                  </p>
                  <p>
                    <strong>Role:</strong> Admin
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              style={styles.openButton}
            >
              Add Announcement
            </button>

            {showModal && (
              <div style={styles.overlay} onClick={() => setShowModal(false)}>
                <div
                  style={styles.modalCard}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    Add Announcement
                  </h2>
                  <form
                    onSubmit={handleAnnouncementSubmit}
                    style={styles.formContainer}
                  >
                    <label style={styles.label}>Title</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={announcementData.title}
                      onChange={(e) =>
                        setAnnouncementData({
                          ...announcementData,
                          title: e.target.value,
                        })
                      }
                      required
                    />

                    <label style={styles.label}>Message</label>
                    <textarea
                      style={styles.input}
                      value={announcementData.message}
                      onChange={(e) =>
                        setAnnouncementData({
                          ...announcementData,
                          message: e.target.value,
                        })
                      }
                      required
                    />

                    <label style={styles.label}>Link (URL)</label>
                    <input
                      type="url"
                      style={styles.input}
                      value={announcementData.link}
                      onChange={(e) =>
                        setAnnouncementData({
                          ...announcementData,
                          link: e.target.value,
                        })
                      }
                    />

                    <label style={styles.label}>Announced By</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={announcementData.announcedBy}
                      onChange={(e) =>
                        setAnnouncementData({
                          ...announcementData,
                          announcedBy: e.target.value,
                        })
                      }
                      required
                    />

                    <label style={styles.label}>Upload Image/Video</label>
                    <input
                      type="file"
                      style={styles.input}
                      multiple
                      onChange={(e) => setFiles([...e.target.files])}
                    />

                    <button
                      type="submit"
                      style={styles.Abutton}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Add Announcement"}
                    </button>

                    <button
                      type="button"
                      style={styles.cancelButton}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            <h2>Latest Announcements</h2>
            <div style={styles.list}>
              {announcements.map((item, index) => (
                <AnnouncementCard
                  key={index}
                  announcement={{
                    title: item.title,
                    message: item.message,
                    link: item.link,
                    files: item.files, // array of image/video URLs
                    announcedBy: item.announcedBy,
                    createdAt: item.createdAt,
                  }}
                  showDelete={true}
                  onDelete={() => handleDelete(item._id)} // 👈 pass delete function
                />
              ))}
            </div>
          </div>
        );
      case "students":
        return (
          <div>
            <h2>Registered Students</h2>

            {students.length === 0 ? (
              <p>No students found.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}></th>
                    <th style={styles.th}>Roll Number</th>

                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} style={{ alignItems: "center" }}>
                      <td style={styles.td}>
                        {" "}
                        <img
                          src={`http://localhost:5000/uploads/${student.profileImage}`}
                          alt="Profile"
                          style={styles.profileImage}
                        />
                      </td>

                      <td style={styles.td}>{student.rollNumber}</td>

                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.email}</td>
                      <td
                        style={{
                          ...styles.td,
                          color: student.isApproved ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {student.isApproved ? "Approved" : "Pending"}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => approveStudent(student._id)}
                          style={{
                            ...styles.button,
                            backgroundColor: "#4CAF50",
                            marginRight: "5px",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => startEditStudent(student)}
                          style={styles.updateBtn}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showEditModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                  <h2>Edit Student</h2>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                  />
                  <br />

                  <label>Email:</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                  />
                  <br />

                  <label>Password:</label>
                  <input
                    type="text"
                    value={editFormData.password}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        password: e.target.value,
                      })
                    }
                  />
                  <br />

                  <label>Roll Number:</label>
                  <input
                    type="text"
                    value={editFormData.rollNumber}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        rollNumber: e.target.value,
                      })
                    }
                  />
                  <br />

                  <label>Profile Image URL:</label>
                  <input
                    type="text"
                    value={editFormData.profileImage}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        profileImage: e.target.value,
                      })
                    }
                  />
                  <br />

                  <button onClick={submitUpdateStudent} style={styles.saveBtn}>
                    Save
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case "teachers":
        return (
          <div>
            <h2>Registered Teachers</h2>
            {teachers.length === 0 ? (
              <p>No teachers found.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}></th>

                    <th style={styles.th}>Roll Number</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td style={styles.td}>
                        {" "}
                        <img
                          src={`http://localhost:5000/uploads/${teacher.profileImage}`}
                          alt="Profile"
                          style={styles.profileImage}
                        />
                      </td>

                      <td style={styles.td}>{teacher.rollNumber}</td>
                      <td style={styles.td}>{teacher.name}</td>
                      <td style={styles.td}>{teacher.email}</td>
                      <td
                        style={{
                          ...styles.td,
                          color: teacher.isApproved ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {teacher.isApproved ? "Approved" : "Pending"}
                      </td>
                      <td style={{ ...styles.td }}>
                        <button
                          onClick={() => approveTeacher(teacher._id)}
                          style={{
                            ...styles.button,
                            backgroundColor: "#4CAF50",
                            marginRight: "10px",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => startEditTeacher(teacher)}
                          style={styles.updateBtn}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showTeacherEditModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                  <h2>Edit Teacher</h2>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editTeacherFormData.name}
                    onChange={(e) =>
                      setEditTeacherFormData({
                        ...editTeacherFormData,
                        name: e.target.value,
                      })
                    }
                  />
                  <br />

                  <label>Email:</label>
                  <input
                    type="email"
                    value={editTeacherFormData.email}
                    onChange={(e) =>
                      setEditTeacherFormData({
                        ...editTeacherFormData,
                        email: e.target.value,
                      })
                    }
                  />
                  <br />

                  <label>Password:</label>
                  <input
                    type="text"
                    value={editTeacherFormData.password}
                    onChange={(e) =>
                      setEditTeacherFormData({
                        ...editTeacherFormData,
                        password: e.target.value,
                      })
                    }
                  />
                  <br />

                  <label>Roll Number:</label>
                  <input
                    type="text"
                    value={editTeacherFormData.rollNumber}
                    onChange={(e) =>
                      setEditTeacherFormData({
                        ...editTeacherFormData,
                        rollNumber: e.target.value,
                      })
                    }
                  />
                  <br />

                  <label>Profile Image URL:</label>
                  <input
                    type="text"
                    value={editTeacherFormData.profileImage}
                    onChange={(e) =>
                      setEditTeacherFormData({
                        ...editTeacherFormData,
                        profileImage: e.target.value,
                      })
                    }
                  />
                  <br />

                  <button onClick={submitUpdateTeacher} style={styles.saveBtn}>
                    Save
                  </button>
                  <button
                    onClick={() => setShowTeacherEditModal(false)}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case "subjects":
        return (
          <div>
            <h2>Subjects</h2>

            {/* 👉 Form to Add or Update */}
            <form onSubmit={subjectSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name: </label>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={subjectData.name}
                  onChange={(e) =>
                    setSubjectData({ ...subjectData, name: e.target.value })
                  }
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Code: </label>
                <input
                  type="text"
                  placeholder="Enter subject code"
                  value={subjectData.code}
                  onChange={(e) =>
                    setSubjectData({ ...subjectData, code: e.target.value })
                  }
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Periods: </label>
                <input
                  type="number"
                  placeholder="Enter periods"
                  value={subjectData.periods}
                  onChange={(e) =>
                    setSubjectData({ ...subjectData, periods: e.target.value })
                  }
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>&nbsp;</label>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.Sbutton,
                    ...(loading ? styles.buttonDisabled : {}),
                  }}
                >
                  {loading ? "Submitting..." : editId ? "Update" : "Add"}{" "}
                  Subject
                </button>
              </div>
            </form>

            {/* 👉 Table of Subjects */}
            <table
              style={{
                marginTop: "20px",
                borderCollapse: "collapse",
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Periods</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj) => (
                  <tr key={subj._id}>
                    <td style={styles.td}>{subj.name}</td>
                    <td style={styles.td}>{subj.code}</td>
                    <td style={styles.td}>{subj.periods}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => subjectEdit(subj)}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => subjectDelete(subj._id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "classes":
        return (
          <div>
            <button
              onClick={() => setShowClassModal(true)}
              className="class-button"
              style={styles.openButton}
            >
              Create Class
            </button>

            <table style={styles.classTable}>
              <thead>
                <tr>
                  <th style={styles.th}>Class Name</th>
                  <th style={styles.th}>Teacher</th>
                  <th style={styles.th}>Students</th>
                  <th style={styles.th}>Subjects</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls, index) => (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>{cls.className}</td>
                    <td style={styles.td}>{cls.teacher.name}</td>
                    <td style={styles.td}>
                      <ul style={styles.list}>
                        {cls.students.map((s, i) => (
                          <li key={i} style={styles.listItem}>
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={styles.td}>
                      <ul style={styles.list}>
                        {cls.subjects.map((sub, i) => (
                          <li key={i} style={styles.listItem}>
                            {sub.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEditClass(cls)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showClassModal && (
              <div style={styles.CmodalOverlay} className="class-modal-overlay">
                <div
                  style={styles.CmodalContent}
                  className="class-modal-content"
                >
                  <button
                    onClick={() => setShowClassModal(false)}
                    style={styles.CcloseBtn}
                    className="class-modal-close"
                  >
                    X
                  </button>

                  <form
                    onSubmit={handleAddClass}
                    style={styles.Cform}
                    className="class-form"
                  >
                    <label style={styles.Clabel} className="class-label">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      required
                      style={styles.Cinput}
                      className="class-input"
                    />

                    <label style={styles.Clabel} className="class-label">
                      Select Teacher
                    </label>
                    <select
                      value={Cteacher}
                      onChange={(e) => setCTeacher(e.target.value)}
                      required
                      style={styles.Cselect}
                      className="class-select"
                    >
                      <option value="">--Select--</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    <label style={styles.Clabel} className="class-label">
                      Select Students
                    </label>
                    <div
                      style={styles.CcheckboxContainer}
                      className="class-checkbox-group"
                    >
                      {students.map((s) => (
                        <label
                          key={s._id}
                          style={styles.CcheckboxLabel}
                          className="class-checkbox-label"
                        >
                          <input
                            type="checkbox"
                            value={s._id}
                            checked={Cstudents.includes(s._id)}
                            onChange={() => handleStudentCheckbox(s._id)}
                          />
                          {s.name}
                        </label>
                      ))}
                    </div>

                    <label style={styles.Clabel} className="class-label">
                      Select Subjects
                    </label>
                    <div
                      style={styles.CcheckboxContainer}
                      className="class-checkbox-group"
                    >
                      {subjects.map((sub) => (
                        <label
                          key={sub._id}
                          style={styles.CcheckboxLabel}
                          className="class-checkbox-label"
                        >
                          <input
                            type="checkbox"
                            value={sub._id}
                            checked={Csubjects.includes(sub._id)}
                            onChange={() => handleSubjectCheckbox(sub._id)}
                          />
                          {sub.name}
                        </label>
                      ))}
                    </div>

                    <button
                      type="submit"
                      style={styles.Cbutton}
                      className="class-submit-button"
                    >
                      Add Class
                    </button>
                  </form>
                </div>
              </div>
            )}

            {isEditModalOpen && (
              <div style={styles.classModalOverlay}>
                <div style={styles.classModal}>
                  <h2>Edit Class</h2>
                  <form onSubmit={handleUpdateClass}>
                    <label>Class Name</label>
                    <input
                      type="text"
                      value={editClassName}
                      onChange={(e) => setEditClassName(e.target.value)}
                      required
                    />

                    <label>Select Teacher</label>
                    <select
                      value={editCTeacher}
                      onChange={(e) => setEditCTeacher(e.target.value)}
                      required
                    >
                      <option value="">--Select--</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    <label>Select Students</label>
                    <div style={styles.CcheckboxContainer}>
                      {students.map((s) => (
                        <label key={s._id} style={styles.CcheckboxLabel}>
                          <input
                            type="checkbox"
                            value={s._id}
                            checked={editCStudents.includes(s._id)}
                            onChange={() => {
                              setEditCStudents((prev) =>
                                prev.includes(s._id)
                                  ? prev.filter((id) => id !== s._id)
                                  : [...prev, s._id]
                              );
                            }}
                          />
                          {s.name}
                        </label>
                      ))}
                    </div>

                    <label>Select Subjects</label>
                    <div style={styles.CcheckboxContainer}>
                      {subjects.map((sub) => (
                        <label key={sub._id} style={styles.CcheckboxLabel}>
                          <input
                            type="checkbox"
                            value={sub._id}
                            checked={editCSubjects.includes(sub._id)}
                            onChange={() => {
                              setEditCSubjects((prev) =>
                                prev.includes(sub._id)
                                  ? prev.filter((id) => id !== sub._id)
                                  : [...prev, sub._id]
                              );
                            }}
                          />
                          {sub.name}
                        </label>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <button type="submit">Update</button>
                      <button onClick={() => setIsEditModalOpen(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case "quires":
        return (
          <div>
            <h2> Questions</h2>
            {quires.length === 0 ? (
              <p>No questions available</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Question</th>
                    <th style={styles.th}>Answer</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quires.map((q, index) => (
                    <tr key={index} style={styles.trHover}>
                      <td style={styles.td}>{q.question}</td>
                      <td style={styles.td}>
                        {q.answer ? (
                          q.answer
                        ) : (
                          <span style={styles.unanswered}>Unanswered</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {!q.answer && (
                          <button
                            style={styles.button}
                            onClick={() => handleAnswerClick(q)}
                          >
                            Answer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showAnsModal && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    minWidth: "300px",
                  }}
                >
                  <h3>Answer Question</h3>
                  <p>
                    <strong>Q:</strong> {selectedQuestion.question}
                  </p>
                  <textarea
                    rows="4"
                    style={{ width: "100%" }}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                  <br />
                  <br />
                  <button onClick={handleSubmitAnswer}>Submit</button>
                  <button
                    onClick={() => setShowAnsModal(false)}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!admin) return <p>Loading...</p>;

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel ⚙️</h2>
        <ul style={styles.menu}>
          <li
            style={
              activeTab === "home" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("home")}
          >
            Home
          </li>
          <li
            style={
              activeTab === "students" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("students")}
          >
            Students
          </li>
          <li
            style={
              activeTab === "teachers" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("teachers")}
          >
            Teachers
          </li>
          <li
            style={
              activeTab === "subjects" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("subjects")}
          >
            Subjects
          </li>
          <li
            style={
              activeTab === "classes" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("classes")}
          >
            Classes
          </li>
          <li
            style={
              activeTab === "quires" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("quires")}
          >
            Quires
          </li>
        </ul>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main style={styles.main}>
        <h1>Welcome, {admin.name} 👋</h1>
        <div style={styles.tabContent}>{renderContent()}</div>
      </main>
    </div>
  );
};

// Styles stay the same
const styles = {
  logoutButton: {
    maxWidth: "100px",
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    border: "2px solid red",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
    marginTop: "auto",
  },
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Verdana",
  },
  sidebar: {
    width: "220px",
    background: "#1e3a8a",
    color: "white",
    padding: "1rem",
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    display: "flex", // Enables flexbox
    flexDirection: "column", // Stacks items vertically
    justifyContent: "space-between", // Pushes items to top & bottom
  },
  logo: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
  },
  menu: {
    listStyleType: "none",
    padding: 0,
  },
  menuItem: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.3s",
  },
  activeMenuItem: {
    padding: "10px",
    cursor: "pointer",
    backgroundColor: "#3b82f6",
    borderRadius: "5px",
  },
  main: {
    marginLeft: "220px",
    flex: 1,
    padding: "2rem",
    backgroundColor: "#f1f5f9",
  },
  card: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#dbeafe",
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid #91c5ff",
    marginBottom: "2rem",
    maxWidth: "500px",
  },
  icon: {
    fontSize: "3rem",
    marginRight: "1rem",
  },
  details: {
    fontSize: "16px",
  },
  tabContent: {
    marginTop: "1rem",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    fontFamily: "Arial, sans-serif",
  },
  th: {
    backgroundColor: "#f2f2f2",
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    verticalAlign: "middle",
  },
  button: {
    padding: "8px 12px",
    marginRight: "8px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "10px",
    width: "400px",
  },
  saveBtn: {
    marginRight: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  cancelBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  updateBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  editBtn: {
    marginRight: "10px",
    padding: "6px 10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  deleteBtn: {
    padding: "6px 10px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  openButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "20px 0",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    padding: "2rem",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "4px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    outline: "none",
  },
  Abutton: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "1rem",
  },
  cancelButton: {
    padding: "10px",
    backgroundColor: "#ccc",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  buttonDisabled: {
    backgroundColor: "#9e9e9e",
    cursor: "not-allowed",
  },

  ALcontainer: {
    padding: "2rem",
    maxWidth: "900px",
    margin: "0 auto",
  },
  ALheader: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2rem",
  },
  ALcard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  ALtitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  ALmessage: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  ALmeta: {
    fontSize: "0.85rem",
    color: "#777",
    marginTop: "0.5rem",
  },
  ALmediaContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  ALmedia: {
    maxWidth: "100%",
    maxHeight: "250px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  ALloading: {
    textAlign: "center",
    marginTop: "2rem",
    fontSize: "1.2rem",
  },
  ALnoData: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#999",
  },

  Cform: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    padding: "1rem",
    maxWidth: "500px",
    margin: "auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  Clabel: {
    fontWeight: "bold",
    marginBottom: "0rem",
  },
  Cinput: {
    padding: "0.5rem",
    border: "1px solid #aaa",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  Cselect: {
    padding: "0.5rem",
    border: "1px solid #aaa",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  CcheckboxContainer: {
    maxHeight: "125px", // You can adjust this height
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "5px",
    backgroundColor: "#f9f9f9",
  },
  CcheckboxLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.9rem",
  },
  Cbutton: {
    padding: "0.6rem",
    fontSize: "1rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  CmodalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  CmodalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 0 10px rgba(0,0,0,0.25)",
  },
  CcloseBtn: {
    backgroundColor: "red",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    float: "right",
    cursor: "pointer",
    marginLeft: "10px",
  },

  classTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  th: {
    padding: "12px 16px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px 16px",
    verticalAlign: "top",
    borderBottom: "1px solid #eee",
  },
  tr: {
    transition: "background-color 0.2s",
  },
  list: {
    paddingLeft: "18px",
    margin: 0,
    listStyleType: "disc",
  },
  listItem: {
    marginBottom: "4px",
  },
  editButton: {
    padding: "6px 10px",
    backgroundColor: "#ffa500",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cellStyle: {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "left",
  },

  btnStyle: {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  trHover: {
    backgroundColor: "#fafafa",
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  unanswered: {
    color: "#999",
    fontStyle: "italic",
  },
  form: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
    backgroundColor: "#fff",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
  },
  Sbutton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  profileImage: {
    width: "40px", // Adjust size
    height: "40px",
    borderRadius: "50%", // Makes it circular
    objectFit: "cover", // Ensures it maintains aspect ratio
    border: "2px solid #ddd", // Optional border for better appearance
  },
};

export default AdminDashboard;
