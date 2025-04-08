import React, { useEffect, useState } from "react";
import axios from "axios";
import AnnouncementCard from "../components/AnnouncementCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const StudentDashboard = () => {
  const [student, setStudent] = useState();
  const [activeTab, setActiveTab] = useState("home");
  const [announcements, setAnnouncements] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [attendanceData, setAttendanceData] = useState([]);

  const [marksData, setMarksData] = useState([]);

  const [resources, setResources] = useState([]);
  const [tests, setTests] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  const [lectureData, setLectureData] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    // Get student data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser);
    if (storedUser) {
      setStudent(storedUser);
    }
  }, []);

  useEffect(() => {
    console.log("Logged in student:", student);
    console.log("Logged in student id:", student?.id);
  }, [student]);

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

    if (activeTab === "sessions") {
      axios
        .get("http://localhost:5000/api/sessions")
        .then((res) => setSessions(res.data))
        .catch((err) => console.error("Error fetching sessions:", err));
    }

    if (activeTab === "attendance") {
      axios
        .get("http://localhost:5000/api/students/attendance")
        .then((res) => {
          console.log("Fetched Attendance Data:", res.data);
          setAttendanceData(res.data); // ✅ Only set the data, don't filter here
        })
        .catch((err) => console.error("Error fetching attendance:", err));
    }

    if (activeTab === "marks") {
      axios
        .get("http://localhost:5000/api/students/marks")
        .then((res) => {
          console.log("Marks Data:", res.data); // ✅ Debugging log
          setMarksData(res.data);
        })
        .catch((err) => console.error("Error fetching marks:", err));
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

    if (activeTab === "lectures") {
      axios
        .get("http://localhost:5000/api/lectures/all")
        .then((response) => setLectureData(response.data))
        .catch((error) => console.error("Error fetching lectures:", error));
    }

    if (activeTab === "qa") {
      axios
        .get("http://localhost:5000/api/questions")
        .then((res) => {
          setQuestions(res.data);
        })
        .catch((err) => {
          console.error("Error fetching questions:", err);
        });
    }
  }, [activeTab]);

  useEffect(() => {
    console.log("Updated Attendance Data:", attendanceData);
  }, [attendanceData]);

  const AttendanceChart = ({ attendanceData, subjects }) => {
    // Process data to format it for Recharts
    const chartData = attendanceData
      .filter((record) => record.studentId === student?.id) // Filter only for current student
      .map((record) => {
        const subject = subjects.find((sub) => sub._id === record.subjectId);
        const totalClasses = subject?.periods || 0;
        const attendancePercentage = totalClasses
          ? ((record.presentCount / totalClasses) * 100).toFixed(2)
          : 0;

        return {
          subject: subject?.name || "N/A",
          attendance: parseFloat(attendancePercentage),
        };
      });

    return (
      <div style={{ width: "100%", height: 300 }}>
        <h3>Attendance Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="attendance" fill="#53b859" name="Attendance %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const MarksChart = ({ marksData, subjects }) => {
    const marksDataForChart = marksData
      .filter((mark) => mark.studentId === student?.id) // Show only current student data
      .map((mark) => {
        const subject = subjects.find((sub) => sub._id === mark.subjectId);
        return {
          subject: subject?.name || "N/A",
          marks: mark.marks,
        };
      });

    return (
      <div style={{ width: "100%", height: 300 }}>
        <h3>Marks Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={marksDataForChart} barSize={50}>
            <XAxis dataKey="subject" stroke="#8884d8" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="marks" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
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

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/questions", {
        question: newQuestion,
      });
      setNewQuestion("");
      fetchQuestions(); // Refresh the list
    } catch (error) {
      console.error("Error adding question", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions");
      setQuestions(res.data);
    } catch (error) {
      console.error("Error fetching questions", error);
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

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div>
            <div style={styles.container}>
              {/* <h1>Welcome, {student.name} 👋</h1> */}
              <div style={styles.card}>
                <img
                  src={
                    "http://localhost:5000/uploads/" + student.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  style={styles.image}
                />
                <div style={styles.details}>
                  <p>
                    <strong>Roll Number:</strong> {student.rollNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Role:</strong> Student
                  </p>
                </div>
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

      case "sessions":
        return (
          <div>
            <h2>All Sessions</h2>
            <table style={sessionStyles.table}>
              <thead>
                <tr>
                  <th style={sessionStyles.th}>Class</th>
                  <th style={sessionStyles.th}>Teacher</th>
                  <th style={sessionStyles.th}>Subject</th>
                  <th style={sessionStyles.th}>From</th>
                  <th style={sessionStyles.th}>To</th>
                  <th style={sessionStyles.th}>Session Link</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={index} style={sessionStyles.tr}>
                    <td style={sessionStyles.td}>
                      {session.classId?.className || "N/A"}
                    </td>
                    <td style={sessionStyles.td}>
                      {session.teacherId?.name || "N/A"}
                    </td>
                    <td style={sessionStyles.td}>{session.subject}</td>
                    <td style={sessionStyles.td}>{session.from}</td>
                    <td style={sessionStyles.td}>{session.to}</td>
                    <td style={sessionStyles.td}>
                      <a
                        href={session.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={sessionStyles.link}
                        onMouseEnter={(e) =>
                          (e.target.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.textDecoration = "none")
                        }
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
            <div>
              <table style={tableStyles.container}>
                <thead>
                  <tr>
                    <th style={tableStyles.headerCell}>Subject</th>
                    <th style={tableStyles.headerCell}>Present Count</th>
                    <th style={tableStyles.headerCell}>Total Classes</th>
                    <th style={tableStyles.headerCell}>Attendance %</th>
                    <th style={tableStyles.headerCell}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={tableStyles.dataCell}>
                        No attendance data available
                      </td>
                    </tr>
                  ) : (
                    attendanceData
                      .filter((record) => record.studentId === student?.id)
                      .map((record, index) => {
                        const subject = subjects.find(
                          (sub) => sub._id === record.subjectId
                        );
                        const totalClasses = subject?.periods || 0;
                        const attendancePercentage = totalClasses
                          ? (
                              (record.presentCount / totalClasses) *
                              100
                            ).toFixed(2)
                          : "N/A";

                        const isRisky =
                          attendancePercentage !== "N/A" &&
                          attendancePercentage < 85;

                        return (
                          <tr key={index}>
                            <td style={tableStyles.dataCell}>
                              {subject?.name || "N/A"}
                            </td>
                            <td style={tableStyles.dataCell}>
                              {record.presentCount}
                            </td>
                            <td style={tableStyles.dataCell}>{totalClasses}</td>
                            <td style={tableStyles.dataCell}>
                              {attendancePercentage}%
                            </td>
                            <td style={tableStyles.statusCell}>
                              <span
                                style={{
                                  ...tableStyles.statusText,
                                  ...(isRisky
                                    ? tableStyles.risky
                                    : tableStyles.eligible),
                                }}
                              >
                                {isRisky ? "Risky" : "Eligible"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <AttendanceChart
                attendanceData={attendanceData}
                subjects={subjects}
              />
            </div>
          </div>
        );

      case "marks":
        return (
          <div>
            <div>
              <h2>Marks</h2>
              <table style={marksTableStyles.tableContainer}>
                <thead>
                  <tr>
                    <th style={marksTableStyles.tableHeader}>Subject</th>
                    <th style={marksTableStyles.tableHeader}>Marks/100</th>
                    <th style={marksTableStyles.tableHeader}>Status</th>{" "}
                    {/* Pass/Fail column */}
                  </tr>
                </thead>
                <tbody>
                  {marksData
                    .filter((mark) => mark.studentId === student?.id) // Show only current student data
                    .map((mark, index) => {
                      const subject = subjects.find(
                        (sub) => sub._id === mark.subjectId
                      );
                      const isPass = mark.marks >= 35; // Pass/Fail condition

                      return (
                        <tr key={index}>
                          <td style={marksTableStyles.tableData}>
                            {subject?.name || "N/A"}
                          </td>
                          <td style={marksTableStyles.tableData}>
                            {mark.marks}
                          </td>
                          <td style={marksTableStyles.statusCell}>
                            <span
                              style={{
                                ...marksTableStyles.statusText,
                                ...(isPass
                                  ? marksTableStyles.pass
                                  : marksTableStyles.fail),
                              }}
                            >
                              {isPass ? "Pass" : "Fail"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div>
              <MarksChart marksData={marksData} subjects={subjects} />
            </div>
          </div>
        );

      // case 'marks':
      //   return (<div></div>);

      case "resources":
        return (
          <div style={{ padding: "0rem" }}>
            <div style={resourceStyles.container}>
              <h2>Uploaded Resources</h2>
              {resources.length === 0 ? (
                <p>No resources uploaded.</p>
              ) : (
                resources.map((res, index) => (
                  <div key={index} style={resourceStyles.resourceCard}>
                    <h3 style={resourceStyles.title}>{res.title}</h3>
                    <p style={resourceStyles.description}>{res.description}</p>

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
                              style={resourceStyles.link}
                              onMouseEnter={(e) =>
                                (e.target.style.textDecoration = "underline")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.textDecoration = "none")
                              }
                            >
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <strong>Files:</strong>
                      {/* Files */}
                      {res.files.length > 0 && (
                        <div
                          style={{
                            margin: "10px 0",
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                          }}
                        >
                          {res.files.map((file, i) => {
                            const fileUrl = `http://localhost:5000/${file}`;
                            const fileExtension = file
                              .split(".")
                              .pop()
                              .toLowerCase();

                            return (
                              <div key={i} style={{ margin: "10px 0" }}>
                                {["png", "jpg", "jpeg", "gif"].includes(
                                  fileExtension
                                ) ? (
                                  <img
                                    src={fileUrl}
                                    alt="Uploaded File"
                                    style={resourceStyles.filePreview}
                                  />
                                ) : ["mp4", "webm", "ogg"].includes(
                                    fileExtension
                                  ) ? (
                                  <video controls style={resourceStyles.video}>
                                    <source
                                      src={fileUrl}
                                      type={`video/${fileExtension}`}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : ["mp3", "wav", "ogg"].includes(
                                    fileExtension
                                  ) ? (
                                  <audio controls style={resourceStyles.audio}>
                                    <source
                                      src={fileUrl}
                                      type={`audio/${fileExtension}`}
                                    />
                                    Your browser does not support the audio tag.
                                  </audio>
                                ) : ["pdf"].includes(fileExtension) ? (
                                  <iframe
                                    src={fileUrl}
                                    style={resourceStyles.pdfFrame}
                                    title="PDF File"
                                  ></iframe>
                                ) : ["docx", "pptx"].includes(fileExtension) ? (
                                  <div>
                                    <p>
                                      No preview available for{" "}
                                      {fileExtension.toUpperCase()} files.
                                    </p>
                                    <a
                                      href={fileUrl}
                                      download
                                      style={resourceStyles.downloadLink}
                                    >
                                      Download {file.split("/").pop()}
                                    </a>
                                  </div>
                                ) : (
                                  <a
                                    href={fileUrl}
                                    download
                                    style={resourceStyles.downloadLink}
                                  >
                                    Download {file.split("/").pop()}
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <hr />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "tests":
        return (
          <div style={testStyles.container}>
            <h2 style={testStyles.heading}>All Tests</h2>
            {tests.length > 0 ? (
              <ul style={testStyles.testList}>
                {tests.map((test) => (
                  <li key={test._id} style={testStyles.testItem}>
                    <strong>{test.testName}</strong> - {test.scheduledOn} -
                    <a
                      href={test.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={testStyles.testLink}
                      onMouseEnter={(e) =>
                        (e.target.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.textDecoration = "none")
                      }
                    >
                      Open Test
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tests added yet.</p>
            )}
          </div>
        );
      case "lectures":
        return (
          <div style={SDstyles.container}>
            <h2>Lecture Documents</h2>

            {/* Display Lecture Topics as Buttons */}
            <div style={SDstyles.buttonList}>
              {lectureData.map((lecture) => (
                <button
                  key={lecture._id}
                  style={SDstyles.button}
                  onClick={() => setSelectedLecture(lecture)}
                >
                  {lecture.topic}
                </button>
              ))}
            </div>

            {/* Show Details When a Topic is Clicked */}
            {selectedLecture && (
              <div style={SDstyles.lectureDetails}>
                <h3>{selectedLecture.topic}</h3>
                <p>{selectedLecture.description}</p>
                {selectedLecture.videos.map((video, index) => (
                  <video key={index} width="100%" height="400px" controls>
                    <source
                      src={`http://localhost:5000/${video}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            )}
          </div>
        );
      case "qa":
        return (
          <div style={qaStyles.container}>
            <h2 style={qaStyles.heading}>Q&A Section</h2>

            <div style={qaStyles.inputContainer}>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question..."
                style={qaStyles.inputField}
              />
              <button
                onClick={handleAskQuestion}
                style={qaStyles.submitButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#0056b3")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#007bff")
                }
              >
                Submit
              </button>
            </div>

            <table style={qaStyles.table}>
              <thead>
                <tr>
                  <th style={qaStyles.tableHeader}>Question</th>
                  <th style={qaStyles.tableHeader}>Answer</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={qaStyles.tableCell}>
                      No questions yet.
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q._id} style={qaStyles.tableRow}>
                      <td style={qaStyles.tableCell}>{q.question}</td>
                      <td style={qaStyles.tableCell}>
                        {q.answer ? (
                          q.answer
                        ) : (
                          <span style={qaStyles.unanswered}>
                            Not answered yet
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
    }
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>Student Panel ⚙️</h2>
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
                activeTab === "sessions"
                  ? styles.activeMenuItem
                  : styles.menuItem
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
                activeTab === "lectures"
                  ? styles.activeMenuItem
                  : styles.menuItem
              }
              onClick={() => setActiveTab("lectures")}
            >
              Recorded Lectures
            </li>

            <li
              style={
                activeTab === "qa" ? styles.activeMenuItem : styles.menuItem
              }
              onClick={() => setActiveTab("qa")}
            >
              Q&A
            </li>
          </ul>
        </div>
        <div>
          <button style={styles.logoutButtonStyles} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main style={styles.main}>
        <h1>Hey, {student.name} 🎓</h1>
        <h2>Welcome 👋</h2>
        <div style={styles.tabContent}>{renderContent()}</div>
      </main>
    </div>
  );
};

const SDstyles = {
  container: {
    width: "60%",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  buttonList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },
  button: {
    padding: "10px 15px",
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
  lectureDetails: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
  },
};

const qaStyles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  inputField: {
    padding: "10px",
    width: "70%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
  },
  submitButton: {
    padding: "10px 15px",
    marginLeft: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.2s",
  },
  submitButtonHover: {
    backgroundColor: "#0056b3",
  },
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
  tableHeader: {
    borderBottom: "2px solid black",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
  },
  tableRow: {
    borderBottom: "1px solid gray",
  },
  tableCell: {
    padding: "10px",
  },
  unanswered: {
    color: "red",
  },
};

const testStyles = {
  container: {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  testList: {
    listStyleType: "none",
    padding: "0",
  },
  testItem: {
    padding: "12px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
    marginLeft: "10px",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
    transition: "background-color 0.2s",
  },
  deleteButtonHover: {
    backgroundColor: "#cc0000",
  },
};

const resourceStyles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  resourceCard: {
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#420505",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "14px",
  },
  linkHover: {
    textDecoration: "underline",
  },
  filePreview: {
    width: "100px",
    borderRadius: "5px",
    marginTop: "10px",
  },
  video: {
    width: "100%",
    maxWidth: "300px",
    marginTop: "10px",
  },
  audio: {
    marginTop: "10px",
  },
  pdfFrame: {
    width: "100%",
    maxWidth: "300px",
    height: "200px",
    border: "none",
    marginTop: "10px",
  },
  downloadLink: {
    color: "blue",
    textDecoration: "underline",
    display: "block",
    marginTop: "5px",
  },
};

const sessionStyles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    fontSize: "16px",
    textAlign: "left",
  },
  th: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    color: "#333",
  },
  tr: {
    backgroundColor: "#f9f9f9",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  linkHover: {
    textDecoration: "underline",
  },
};

const tableStyles = {
  container: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    fontSize: "16px",
    textAlign: "left",
  },
  headerCell: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderBottom: "2px solid #ddd",
  },
  dataCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  statusRisky: {
    backgroundColor: "",
    border: "2px solid red",
    color: "red",
    fontWeight: "bold",
  },
  statusEligible: {
    color: "green",
    fontWeight: "bold",
  },
  statusCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
  },
  statusText: {
    padding: "5px 10px",
    borderRadius: "50px",
    fontWeight: "normal",
    fontSize: "12px",
    display: "inline-block",
  },
  risky: {
    backgroundColor: "#ffdede",
    color: "red",
    border: "2px solid red",
  },
  eligible: {
    backgroundColor: "#ccffcc",
    color: "green",
    border: "2px solid green",
  },
};

const marksTableStyles = {
  tableContainer: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableData: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  statusCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
  },
  statusText: {
    fontWeight: "normal",

    borderRadius: "50px",
    display: "inline-block",
    fontSize: "12px",
    minWidth: "30px",

    padding: "5px 10px",
  },
  pass: {
    color: "green",
    backgroundColor: "#ccffcc",
    border: "2px solid green",
  },
  fail: {
    color: "red",
    backgroundColor: "#ffcccc",
    border: "2px solid red",
  },
};

// Optional: some basic styling
const styles = {
  logoutButtonStyles: {
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
  container: {
    padding: "2rem",
    fontFamily: "Arial",
  },
  card: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e6ffe8",

    marginTop: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    maxWidth: "500px",
  },
  image: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "1rem",
  },
  details: {
    fontSize: "16px",
  },
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Verdana",
  },
  sidebar: {
    width: "250px",
    background: "#197d23",
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
    backgroundColor: "#11d907",
    borderRadius: "5px",
  },
  main: {
    marginLeft: "250px",
    flex: 1,
    padding: "2rem",
    backgroundColor: "#f1f5f9",
  },
};

export default StudentDashboard;
