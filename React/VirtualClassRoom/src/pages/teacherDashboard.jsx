import React, { useEffect, useState } from "react";
import axios from "axios";
import AnnouncementCard from "../components/AnnouncementCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sessionData, setSessionData] = useState({
    subject: "",
    from: "",
    to: "",
    link: "",
  });
  const [sessions, setSessions] = useState([]);

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [attendanceData, setAttendanceData] = useState([]);

  const [hoveredButton, setHoveredButton] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [focusedButton, setFocusedButton] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [marksData, setMarksData] = useState({});

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");

  const [loading, setLoading] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState("");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const [resources, setResources] = useState([]);

  const [testName, setTestName] = useState("");
  const [scheduledOn, setScheduledOn] = useState("");
  const [link, setLink] = useState("");
  const [tests, setTests] = useState([]);
  const [tmessage, settMessage] = useState("");

  const [lectureTopic, setLectureTopic] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);

  const [lectureData, setLectureData] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setTeacher(storedUser);
    }
  }, []);

  useEffect(() => {
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

    if (activeTab === "classes") {
      axios
        .get("http://localhost:5000/api/admin/classes")
        .then((res) => setClasses(res.data))
        .catch((err) => console.error("Error fetching subjects:", err));
    }

    if (activeTab === "sessions") {
      axios
        .get("http://localhost:5000/api/sessions")
        .then((res) => setSessions(res.data))
        .catch((err) => console.error("Error fetching sessions:", err));
    }

    if (activeTab === "attendance") {
      axios
        .get("http://localhost:5000/api/attendance")
        .then((res) => {
          setAttendanceData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching attendance:", err);
        });
    }

    if (activeTab === "marks") {
      axios
        .get("http://localhost:5000/api/admin/subjects")
        .then((res) => setSubjects(res.data))
        .catch((err) => console.error(err));

      axios
        .get("http://localhost:5000/api/admin/students")
        .then((res) => setStudents(res.data))
        .catch((err) => console.error(err));
    }

    if (activeTab === "resourses") {
      axios
        .get("http://localhost:5000/api/resources")
        .then((res) => setResources(res.data))
        .catch((err) => console.error(err));
    }

    if (activeTab === "tests") {
      axios
        .get("http://localhost:5000/api/tests/all")
        .then((res) => {
          setTests(res.data);
        })
        .catch((err) => {
          console.error("Error fetching tests:", err);
        });
    }

    if (activeTab === "recorded lectures") {
      axios
        .get("http://localhost:5000/api/lectures/all")
        .then((response) => {
          setLectureData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching lectures:", error);
        });
    }
  }, [activeTab]);

  const handleAddSessionClick = (cls) => {
    setSelectedClass(cls);
    setSessionData({ subject: "", from: "", to: "", link: "" });
    setShowSessionModal(true);
  };

  const handleSubmitSession = async () => {
    if (
      !sessionData.subject ||
      !sessionData.from ||
      !sessionData.to ||
      !sessionData.link
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/sessions`, {
        classId: selectedClass._id,
        subject: sessionData.subject,
        from: sessionData.from,
        to: sessionData.to,
        link: sessionData.link,
        teacherId: selectedClass.teacher._id,
      });
      alert("Session added successfully!");
      setShowSessionModal(false);
    } catch (err) {
      console.error("Error adding session:", err);
      alert("Failed to add session.");
    }
  };

  // const markPresent = (studentId, subjectId) => {
  //   axios.post('http://localhost:5000/api/attendance/mark-present', {
  //     studentId,
  //     subjectId
  //   })
  //     .then(() => {

  //       fetchAttendanceData();
  //       setActiveButton(`${studentId}-${subjectId}`); // show border for clicked

  //     })
  //     .catch(err => console.error(err));
  // };

  const markPresent = async (studentId, subjectId) => {
    //   const buttonKey = `${studentId}-${subjectId}`;
    // setLoadingButton(buttonKey); // disable button

    try {
      await axios.post("http://localhost:5000/api/attendance/mark-present", {
        studentId,
        subjectId,
      });

      // Refresh attendance data
      fetchAttendanceData();

      // Set the button state for visual feedback
      //setActiveButton(`${studentId}-${subjectId}`);
    } catch (err) {
      console.error("Error marking present:", err);
    }
  };

  const baseButtonStyle = {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const hoveredStyle = {
    backgroundColor: "#45a049",
  };

  const activeStyle = {
    border: "2px solid #2e7d32",
  };

  const focusStyle = {
    boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.5)",
  };

  const fetchAttendanceData = () => {
    axios
      .get("http://localhost:5000/api/attendance")
      .then((res) => setAttendanceData(res.data))
      .catch((err) => console.error("Error fetching attendance:", err));
  };

  //------------------------------------------------------------------

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject._id);
    setSelectedSubjectName(subject.name); // ✅ Set the selected name

    fetchMarks(subject._id); // Fetch marks for selected subject
  };

  const handleInputChange = (studentId, value) => {
    setMarksData((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = (studentId) => {
    const marks = marksData[studentId];
    if (!marks || isNaN(marks)) return alert("Enter valid marks");

    axios
      .post("http://localhost:5000/api/marks/assign", {
        studentId,
        subjectId: selectedSubject,
        marks: parseInt(marks),
      })
      .then()
      .catch((err) => console.error(err));
  };

  const fetchMarks = async (subjectId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/marks/${subjectId}`
      );
      const marksMap = {};
      res.data.forEach((entry) => {
        marksMap[entry.studentId._id] = entry.marks;
      });
      setMarksData(marksMap);
    } catch (err) {
      console.error(err);
    }
  };

  //-------------------------------------------------

  const handleResourceUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "links",
      JSON.stringify(links.split(",").map((link) => link.trim()))
    );

    try {
      const res = await axios.post(
        "http://localhost:5000/api/resources/upload",
        formData
      );
      setMessage(res.data.message);
      setTitle("");
      setDescription("");
      setFiles([]);
      setLinks("");
      alert(res.data.message);
      fetchResources();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resources");
        console.log("Fetched Resources:", res.data); // ✅ Debugging line
        setResources(res.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resources");
      setResources(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setLoading(false);
    }
  };

  //--------------------------------------------------------------------------------

  // Handle test submission
  const handleTestSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/tests/add", {
        testName,
        scheduledOn,
        link,
      });

      setMessage(res.data.message);
      setTestName("");
      setScheduledOn("");
      setLink("");
      if (message) {
        alert(message);
      }
      fetchTests();
    } catch (error) {
      console.error(error);
      setMessage("Error adding test");
    }
  };

  // Handle test deletion
  const handleTestDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tests/delete/${id}`);
      fetchTests();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tests/all");
      setTests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // const navigate = useNavigation();
    // Clear authentication (adjust based on your auth method)
    localStorage.removeItem("user"); // If using JWT
    sessionStorage.removeItem("user");
    // Redirect to Landing Page
    window.location.href = "/"; // Redirect to landing page
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleRSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles) return alert("Please select files!");

    const formData = new FormData();
    formData.append("topic", lectureTopic);
    formData.append("description", lectureDescription);

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("videos", selectedFiles[i]);
    }

    try {
      await axios.post("http://localhost:5000/api/lectures/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lectures uploaded successfully!");
      setLectureTopic("");
      setLectureDescription("");
      setSelectedFiles(null);
    } catch (error) {
      console.error(error);
      alert("Failed to upload lectures.");
    }
  };

  if (!teacher) return <p>Loading...</p>;

  const imageUrl = teacher.profileImage
    ? `http://localhost:5000/uploads/${teacher.profileImage}`
    : "https://via.placeholder.com/150";

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div>
            <div style={styles.card}>
              <img src={imageUrl} alt="Profile" style={styles.image} />
              <div style={styles.details}>
                <p>
                  <strong>Roll Number:</strong> {teacher.rollNumber}
                </p>
                <p>
                  <strong>Email:</strong> {teacher.email}
                </p>
                <p>
                  <strong>Role:</strong> Teacher
                </p>
              </div>
            </div>
            <div>
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
                    showDelete={false} // or omit this line completely
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case "classes":
        return (
          <div>
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
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "10px",
                        }}
                        onClick={() => handleAddSessionClick(cls)}
                      >
                        Add Session
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showSessionModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <h3>Add Session for {selectedClass.className}</h3>

                  <label>Subject:</label>
                  <select
                    value={sessionData.subject}
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        subject: e.target.value,
                      })
                    }
                    style={styles.input}
                  >
                    <option value="">Select Subject</option>
                    {selectedClass.subjects.map((sub, i) => (
                      <option key={i} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>

                  <label>From:</label>
                  <input
                    type="text"
                    value={sessionData.from}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, from: e.target.value })
                    }
                    placeholder="e.g. 10:00 AM"
                    style={styles.input}
                  />

                  <label>To:</label>
                  <input
                    type="text"
                    value={sessionData.to}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, to: e.target.value })
                    }
                    placeholder="e.g. 11:00 AM"
                    style={styles.input}
                  />

                  <label>Session Link:</label>
                  <input
                    type="text"
                    value={sessionData.link}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, link: e.target.value })
                    }
                    placeholder="https://meet.link"
                    style={styles.input}
                  />

                  <div style={{ marginTop: "10px" }}>
                    <button onClick={handleSubmitSession} style={styles.button}>
                      Submit
                    </button>
                    <button
                      onClick={() => setShowSessionModal(false)}
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "sessions":
        return (
          <div>
            <h2>All Sessions</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Class</th>
                  <th style={styles.th}>Teacher</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>From</th>
                  <th style={styles.th}>To</th>
                  <th style={styles.th}>Session Link</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      {session.classId?.className || "N/A"}
                    </td>
                    <td style={styles.td}>
                      {session.teacherId?.name || "N/A"}
                    </td>
                    <td style={styles.td}>{session.subject}</td>
                    <td style={styles.td}>{session.from}</td>
                    <td style={styles.td}>{session.to}</td>
                    <td style={styles.td}>
                      <a
                        href={session.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        Join
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "attendance":
        return (
          <div>
            <h2>Mark Attendance</h2>

            {/* Subject Buttons */}
            <div style={{ marginBottom: "20px" }}>
              {subjects.map((subject) => (
                <button
                  key={subject._id}
                  style={{
                    margin: "5px",
                    padding: "10px 20px",
                    backgroundColor:
                      activeButton === subject._id ? "#2563EB" : "#3B82F6",
                    color: "white",
                    fontSize: activeButton === subject._id ? "15px" : "",
                    border:
                      activeButton === subject._id
                        ? "4px solid #3B82F6"
                        : "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onClick={() => setActiveButton(subject._id)}
                >
                  {subject.name}
                </button>
              ))}
            </div>

            {/* Students List with Present Buttons */}
            {activeButton && (
              <div>
                <h3>
                  Subject: {subjects.find((s) => s._id === activeButton)?.name}
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={styles.thStyle}>Student</th>
                      <th style={styles.thStyle}>Mark Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const attendance = attendanceData.find(
                        (a) =>
                          a.studentId._id === student._id &&
                          a.subjectId._id === activeButton
                      );
                      const presentCount = attendance
                        ? attendance.presentCount
                        : 0;
                      const subject = subjects.find(
                        (s) => s._id === activeButton
                      );
                      const totalPeriods = subject ? subject.periods : 0;

                      return (
                        <tr key={student._id}>
                          <td style={styles.tdStyle}>{student.name}</td>
                          <td style={styles.tdStyle}>
                            <button
                              style={{
                                ...baseButtonStyle,
                                ...(hoveredButton === student._id
                                  ? hoveredStyle
                                  : {}),
                                ...(focusedButton === student._id
                                  ? focusStyle
                                  : {}),
                              }}
                              onMouseEnter={() => setHoveredButton(student._id)}
                              onMouseLeave={() => setHoveredButton(null)}
                              onFocus={() => setFocusedButton(student._id)}
                              onBlur={() => setFocusedButton(null)}
                              onClick={() =>
                                markPresent(student._id, activeButton)
                              }
                            >
                              Present
                            </button>
                            <span
                              style={{ marginLeft: "10px", color: "green" }}
                            >
                              ({presentCount} / {totalPeriods})
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case "marks":
        return (
          <div>
            <h2>Marks Management</h2>
            <div>
              {subjects.map((subject) => (
                <button
                  key={subject._id}
                  style={{
                    ...styles.button,
                    marginRight: "10px",
                    ...(selectedSubject === subject._id
                      ? styles.selectedButton
                      : {}),
                  }}
                  onClick={() => handleSubjectSelect(subject)}
                >
                  {subject.name}
                </button>
              ))}
            </div>

            {/* ✅ Selected subject name display */}
            {selectedSubjectName && (
              <div>
                <h2>{selectedSubjectName}</h2>
              </div>
            )}

            {selectedSubject && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Marks/100</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={marksData[student._id] ?? 0}
                          onChange={(e) =>
                            handleInputChange(student._id, e.target.value)
                          }
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.saveButton}
                          onClick={() => handleSave(student._id)}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "resources":
        return (
          <div style={{ padding: "0rem" }}>
            <h2>Upload Resources</h2>
            <form onSubmit={handleResourceUpload} style={styles.formContainer}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>Description</label>
              <textarea
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={styles.textarea}
              />

              <label style={styles.label}>Links (comma-separated)</label>
              <input
                type="text"
                placeholder="https://example.com, https://another.com"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Upload Files</label>
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                style={styles.fileInput}
              />

              <button type="submit" style={styles.button}>
                Upload
              </button>
            </form>

            {/* {message && <p style={styles.message}>{message}</p>} */}

            {/* {message && <p style={styles.message}>{message}</p>} */}

            <div style={styles.container}>
              <h2>Uploaded Resources</h2>
              {resources.length === 0 ? (
                <p>No resources uploaded.</p>
              ) : (
                resources.map((res, index) => (
                  <div key={index} style={styles.resourceCard}>
                    <h3 style={styles.title}>{res.title}</h3>
                    <p style={styles.description}>{res.description}</p>

                    {/* Links */}
                    {res.links.length > 0 && (
                      <div>
                        <strong>Links:</strong>
                        {res.links.map((link, i) => (
                          <div key={i}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.link}
                            >
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Files */}
                    {res.files.length > 0 && (
                      <div>
                        <strong>Files:</strong>
                        {res.files.map((file, i) => {
                          const fileUrl = `http://localhost:5000/${file}`;
                          const fileExtension = file
                            .split(".")
                            .pop()
                            .toLowerCase();

                          return (
                            <div key={i} style={{ margin: "10px 0" }}>
                              {/* Display Images */}
                              {["png", "jpg", "jpeg", "gif"].includes(
                                fileExtension
                              ) ? (
                                <img
                                  src={fileUrl}
                                  alt="Uploaded File"
                                  style={{
                                    width: "200px",
                                    borderRadius: "5px",
                                  }}
                                />
                              ) : /* Display Videos */
                              ["mp4", "webm", "ogg"].includes(fileExtension) ? (
                                <video controls width="300">
                                  <source
                                    src={fileUrl}
                                    type={`video/${fileExtension}`}
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : /* Display Audio */
                              ["mp3", "wav", "ogg"].includes(fileExtension) ? (
                                <audio controls>
                                  <source
                                    src={fileUrl}
                                    type={`audio/${fileExtension}`}
                                  />
                                  Your browser does not support the audio tag.
                                </audio>
                              ) : /* Display PDFs */
                              ["pdf"].includes(fileExtension) ? (
                                <iframe
                                  src={fileUrl}
                                  width="100%"
                                  height="500px"
                                  title="PDF File"
                                ></iframe>
                              ) : /* Provide Download Link for DOCX, PPTX */
                              ["docx", "pptx"].includes(fileExtension) ? (
                                <div>
                                  <p>
                                    No preview available for{" "}
                                    {fileExtension.toUpperCase()} files.
                                  </p>
                                  <a
                                    href={fileUrl}
                                    download
                                    style={{
                                      color: "blue",
                                      textDecoration: "underline",
                                    }}
                                  >
                                    Download {file.split("/").pop()}
                                  </a>
                                </div>
                              ) : (
                                /* Default: Download Link for other files */
                                <a
                                  href={fileUrl}
                                  download
                                  style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Download {file.split("/").pop()}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <hr />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "tests":
        return (
          <div style={styles.container}>
            <h2 style={styles.heading}>Add a Test</h2>
            <form onSubmit={handleTestSubmit} style={styles.form}>
              <input
                type="text"
                placeholder="Test Name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="string"
                placeholder="Scheduled on (Date & Time)"
                value={scheduledOn}
                onChange={(e) => setScheduledOn(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="url"
                placeholder="Test Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Add Test
              </button>
            </form>

            <h2 style={styles.heading}>All Tests</h2>
            {tests.length > 0 ? (
              <ul style={styles.testList}>
                {tests.map((test) => (
                  <li key={test._id} style={styles.testItem}>
                    <strong>{test.testName}</strong> - {test.scheduledOn} -
                    <a
                      href={test.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.testLink}
                    >
                      Open Test
                    </a>
                    <button
                      onClick={() => handleTestDelete(test._id)}
                      style={styles.deleteButton}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tests added yet.</p>
            )}
          </div>
        );
      case "recorded lectures":
        return (
          <div>
            <div style={RLstyles.container}>
              <h2>Add Recorded Lectures</h2>
              <form
                onSubmit={handleRSubmit}
                encType="multipart/form-data"
                style={RLstyles.form}
              >
                <label style={RLstyles.label}>Topic:</label>
                <input
                  type="text"
                  value={lectureTopic}
                  onChange={(e) => setLectureTopic(e.target.value)}
                  required
                  style={RLstyles.input}
                />

                <label style={RLstyles.label}>Description:</label>
                <textarea
                  value={lectureDescription}
                  onChange={(e) => setLectureDescription(e.target.value)}
                  required
                  style={RLstyles.textarea}
                />

                <label style={RLstyles.label}>Upload Videos:</label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                  style={RLstyles.input}
                />

                <button type="submit" style={RLstyles.button}>
                  Upload
                </button>
              </form>
            </div>

            {/* Display Uploaded Lectures */}
            <div style={RLstyles.videoContainer}>
              <h2>Recorded Lectures</h2>
              {lectureData.length === 0 ? (
                <p>No lectures available.</p>
              ) : (
                <ul style={RLstyles.videoList}>
                  {lectureData.map((lecture) => (
                    <li key={lecture._id} style={RLstyles.videoItem}>
                      <h3>{lecture.topic}</h3>
                      <p>{lecture.description}</p>
                      {lecture.videos.map((video, index) => (
                        <video key={index} width="400" controls>
                          <source
                            src={`http://localhost:5000/${video}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ))}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Teacher Panel ⚙️</h2>
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
              activeTab === "classes" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("classes")}
          >
            My Classes
          </li>
          <li
            style={
              activeTab === "sessions" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("sessions")}
          >
            My Sessions
          </li>
          <li
            style={
              activeTab === "attendance"
                ? styles.activeMenuItem
                : styles.menuItem
            }
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </li>
          <li
            style={
              activeTab === "marks" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("marks")}
          >
            Marks
          </li>
          <li
            style={
              activeTab === "resources"
                ? styles.activeMenuItem
                : styles.menuItem
            }
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </li>
          <li
            style={
              activeTab === "tests" ? styles.activeMenuItem : styles.menuItem
            }
            onClick={() => setActiveTab("tests")}
          >
            Tests
          </li>
          <li
            style={
              activeTab === "recorded lectures"
                ? styles.activeMenuItem
                : styles.menuItem
            }
            onClick={() => setActiveTab("recorded lectures")}
          >
            Recorded lectures
          </li>
        </ul>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main style={styles.main}>
        <h1>Hey, Professor {teacher.name} 🎓</h1>
        <h2>Welcome 👋</h2>
        <div style={styles.tabContent}>{renderContent()}</div>
      </main>
    </div>
  );
};

const RLstyles = {
  container: {
    width: "60%",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "20px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "80px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  videoContainer: {
    marginTop: "30px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
  },
  videoList: {
    listStyle: "none",
    padding: "0",
  },
  videoItem: {
    marginBottom: "20px",
  },
};

const styles = {
  logoutButton: {
    maxWidth: "100px",
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    border: "2px solid white",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
    marginTop: "auto",
  },

  card: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fffbe6",
    padding: "1.5rem",
    borderRadius: "15px",
    border: "1px solid #e0d888",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "600px",
  },
  image: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "1.5rem",
  },
  details: {
    fontSize: "17px",
  },
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Verdana",
  },
  sidebar: {
    width: "250px",
    background: "#ad1111",
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
    backgroundColor: "#f63b3b",
    borderRadius: "5px",
  },
  main: {
    marginLeft: "250px",
    flex: 1,
    padding: "2rem",
    backgroundColor: "#f1f5f9",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
  },
  cancelBtn: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    marginLeft: "10px",
  },
  thStyle: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  },
  tdStyle: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "center",
  },
  buttonStyle: {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  baseButtonStyle: {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  hoveredStyle: {
    backgroundColor: "#45a049",
  },
  activeStyle: {
    border: "2px solid #2e7d32",
  },
  button: {
    margin: "8px",
    padding: "10px 20px",
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  selectedButton: {
    backgroundColor: "#2563EB",
    border: "2px solid #1D4ED8",
    fontSize: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#F3F4F6",
    padding: "12px",
    borderBottom: "1px solid #D1D5DB",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #E5E7EB",
  },
  input: {
    padding: "8px",
    width: "80px",
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#10B981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  formContainer: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  label: {
    display: "block",
    marginBottom: "0.2rem",
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#333",
  },
  input: {
    width: "96%",
    padding: "10px",
    marginBottom: "0.6rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  textarea: {
    width: "96%",
    padding: "10px",
    minHeight: "50px",
    marginBottom: "0.6rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    resize: "vertical",
  },
  fileInput: {
    marginBottom: "0.6rem",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    fontWeight: "bold",
  },
  resourceList: {
    marginTop: "3rem",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  resourceCard: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    marginBottom: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "auto",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  buttonHover: {
    background: "#0056b3",
  },
  testList: {
    listStyleType: "none",
    padding: "0",
    marginTop: "15px",
  },
  testItem: {
    padding: "10px",
    background: "#fff",
    borderRadius: "5px",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  testLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  deleteButton: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  // Add hover and click styles in your global CSS or styled-components if needed
};

export default TeacherDashboard;
