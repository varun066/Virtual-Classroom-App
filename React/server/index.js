const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Initialize app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://varunbp98:lpFrNsL6B1vOSJ4x@cluster0.fyl3o.mongodb.net/VirtualClassRoom",
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// Admin Model
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profileImage: String,
  rollNumber: String,
});
const Admin = mongoose.model("Admin", adminSchema);

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profileImage: String,
  rollNumber: String,
  isApproved: { type: Boolean, default: false },
});
const Student = mongoose.model("Student", studentSchema);

const teacherSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profileImage: String,
  rollNumber: String,
  isApproved: { type: Boolean, default: false },
});
const Teacher = mongoose.model("Teacher", teacherSchema);

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  periods: { type: Number, required: true }, // Added field
});

const Subject = mongoose.model("Subject", subjectSchema);

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ===== Admin Signup =====
app.post(
  "/api/admin/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existing = await Admin.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const count = await Admin.countDocuments();

      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        profileImage: req.file ? req.file.filename : "",
        rollNumber: `A${count + 1}`,
      });

      await newAdmin.save();
      res
        .status(201)
        .json({ message: "Admin registered", rollNumber: newAdmin.rollNumber });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ===== Admin Login =====
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      name: admin.name,
      email: admin.email,
      rollNumber: admin.rollNumber,
      profileImage: admin.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== Student Signup =====
app.post(
  "/api/student/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existing = await Student.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const count = await Student.countDocuments();

      const newStudent = new Student({
        name,
        email,
        password: hashedPassword,
        profileImage: req.file ? req.file.filename : "",
        rollNumber: `S${count + 1}`,
        isApproved: false,
      });

      await newStudent.save();
      res
        .status(201)
        .json({
          message: "Student registered. Awaiting admin approval.",
          rollNumber: newStudent.rollNumber,
        });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ===== Student Login =====
app.post("/api/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!student.isApproved) {
      return res
        .status(403)
        .json({
          message:
            "Your account is not approved yet. Please wait for admin approval.",
        });
    }

    res.status(200).json({
      message: "Login successful",
      id: student._id,
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      profileImage: student.profileImage,
      isApproved: student.isApproved, // 👈 add this!
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== Teacher Signup =====
app.post(
  "/api/teacher/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existing = await Teacher.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const count = await Teacher.countDocuments();

      const newTeacher = new Teacher({
        name,
        email,
        password: hashedPassword,
        profileImage: req.file ? req.file.filename : "",
        rollNumber: `T${count + 1}`,
        isApproved: false,
      });

      await newTeacher.save();
      res
        .status(201)
        .json({
          message: "Teacher registered. Awaiting admin approval.",
          rollNumber: newTeacher.rollNumber,
        });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ===== Teacher Login =====
app.post("/api/teacher/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!teacher.isApproved) {
      return res
        .status(403)
        .json({
          message:
            "Your account is not approved yet. Please wait for admin approval.",
        });
    }

    res.status(200).json({
      message: "Login successful",
      name: teacher.name,
      email: teacher.email,
      rollNumber: teacher.rollNumber,
      profileImage: teacher.profileImage,
      isApproved: teacher.isApproved, // 👈 add this!
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all students
app.get("/api/admin/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Get all teachers
app.get("/api/admin/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

// Approve Student
app.put("/api/admin/students/:id/approve", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.status(200).json({ message: "Student approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Student
app.put("/api/admin/students/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const student = await Student.findByIdAndUpdate(id, updates, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Approve Teacher
app.put("/api/admin/teachers/:id/approve", async (req, res) => {
  try {
    await Teacher.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.status(200).json({ message: "Teacher approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Teacher
app.put("/api/admin/teachers/:id", async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Subject
app.post("/api/admin/subjects", async (req, res) => {
  try {
    const { name, code, periods } = req.body;

    if (!name || !code || periods === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSubject = new Subject({ name, code, periods });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all subjects
app.get("/api/admin/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update subject
app.put("/api/admin/subjects/:id", async (req, res) => {
  try {
    const { name, code, periods } = req.body;
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, code, periods },
      { new: true, runValidators: true }
    );
    res.json({ message: "Subject updated", subject: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// Delete subject
app.delete("/subjects/:id", async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  files: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  //adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  announcedBy: { type: String, required: true }, // changed from adminName to announcedBy
});

const Announcement = mongoose.model("Announcement", announcementSchema);

//file upload for announcements
const announcementStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/announcements/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadAnnouncement = multer({ storage: announcementStorage });

// POST: Add announcement
app.post(
  "/api/admin/announcements",
  uploadAnnouncement.array("files"),
  async (req, res) => {
    try {
      const { title, message, link, announcedBy } = req.body;
      const fileNames = req.files.map((file) => file.filename);

      const newAnnouncement = new Announcement({
        title,
        message,
        link,
        //adminId,
        announcedBy,
        createdAt: new Date(),
        files: fileNames,
      });

      await newAnnouncement.save();
      res.status(201).json({ message: "Announcement added successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating announcement", error: err.message });
    }
  }
);

app.get("/api/admin/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/admin/announcements/:id", async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Announcement not found" });
    res.status(200).json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Class = mongoose.model("Class", classSchema);

// Create a new class
app.post("/api/admin/classes", async (req, res) => {
  try {
    const { className, teacher, students, subjects } = req.body;

    if (!className || !teacher) {
      return res
        .status(400)
        .json({ message: "Class name and teacher are required" });
    }

    const newClass = new Class({
      className,
      teacher,
      students,
      subjects,
    });

    await newClass.save();
    res
      .status(201)
      .json({ message: "Class created successfully", class: newClass });
  } catch (err) {
    console.error("Error creating class:", err);
    res
      .status(500)
      .json({ message: "Error creating class", error: err.message });
  }
});

app.get("/api/admin/classes", async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacher", "name")
      .populate("students", "name")
      .populate("subjects", "name");
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// PUT route to update a class
app.put("/api/admin/classes/:id", async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        className: req.body.className,
        teacher: req.body.teacher,
        students: req.body.students,
        subjects: req.body.subjects,
      },
      { new: true }
    ).populate("teacher students subjects");

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(updatedClass);
  } catch (err) {
    console.error("Error updating class:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const quireSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quire = mongoose.model("Quire", quireSchema);

// GET all quires
app.get("/api/quires", async (req, res) => {
  try {
    const data = await Quire.find();
    res.json(data);
  } catch (err) {
    console.error("Error fetching quires:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new quire
app.post("/api/Quires", async (req, res) => {
  try {
    const { question } = req.body;
    const newQuire = new Quire({ question });
    await newQuire.save();
    res.status(201).json(newQuire);
  } catch (err) {
    console.error("Error creating quire:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT answer to a quire
app.put("/api/Quires/:id", async (req, res) => {
  try {
    const { answer } = req.body;
    const updatedQuire = await Quire.findByIdAndUpdate(
      req.params.id,
      { answer },
      { new: true }
    );

    res.json(updatedQuire);
  } catch (err) {
    console.error("Error updating quire:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const sessionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model("Session", sessionSchema);

app.post("/api/sessions", async (req, res) => {
  try {
    const { classId, teacherId, subject, from, to, link } = req.body;

    if (!classId || !teacherId || !subject || !from || !to || !link) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newSession = new Session({
      classId,
      teacherId,
      subject,
      from,
      to,
      link,
    });

    await newSession.save();

    res
      .status(201)
      .json({ message: "Session added successfully.", session: newSession });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("classId", "className") // populates class name
      .populate("teacherId", "name email"); // populates teacher name and email

    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  presentCount: { type: Number, default: 0 },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

app.post("/api/attendance/mark-present", async (req, res) => {
  const { studentId, subjectId } = req.body;

  try {
    const attendance = await Attendance.findOneAndUpdate(
      { studentId, subjectId },
      { $inc: { presentCount: 1 } },
      { new: true, upsert: true } // Create if not exist
    );
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

app.get("/api/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("studentId", "name")
      .populate("subjectId", "name periods");

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const markSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  marks: { type: Number, required: true },
});

markSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

const Mark = mongoose.model("Mark", markSchema);

// Assign or update mark
app.post("/api/marks/assign", async (req, res) => {
  const { studentId, subjectId, marks } = req.body;

  try {
    let mark = await Mark.findOne({ studentId, subjectId });

    if (mark) {
      mark.marks = marks;
      await mark.save();
    } else {
      mark = new Mark({ studentId, subjectId, marks });
      await mark.save();
    }

    res.status(200).json({ message: "Mark assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get marks for a particular subject
app.get("/api/marks/:subjectId", async (req, res) => {
  try {
    const marks = await Mark.find({ subjectId: req.params.subjectId })
      .populate("studentId", "name")
      .populate("subjectId", "name");
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Assign or update marks
app.post("/api/marks/assign", async (req, res) => {
  const { studentId, subjectId, marks } = req.body;

  try {
    const existing = await Mark.findOne({ studentId, subjectId });

    if (existing) {
      existing.marks = marks;
      await existing.save();
      return res.json({ message: "Marks updated successfully" });
    }

    const newMark = new Mark({ studentId, subjectId, marks });
    await newMark.save();
    res.json({ message: "Marks assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  links: [String], // Optional external links
  files: [String], // Array of uploaded file paths
  uploadedAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model("Resource", resourceSchema);

// File storage config
const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const RUpload = multer({ storage: resourceStorage });

app.use("/uploads", express.static("uploads"));

// Upload resource (with file or just a link)
app.post(
  "/api/resources/upload",
  RUpload.array("files", 10),
  async (req, res) => {
    try {
      const { title, description, links } = req.body;
      const filePaths = req.files.map((file) => file.path);

      const newResource = new Resource({
        title,
        description,
        links: links ? JSON.parse(links) : [],
        files: filePaths,
      });

      await newResource.save();
      res
        .status(201)
        .json({
          message: "Resource uploaded successfully",
          resource: newResource,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// Get all resources
app.get("/api/resources", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching resources" });
  }
});

const testSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  scheduledOn: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Test = mongoose.model("Test", testSchema);

// Add a new test
app.post("/api/tests/add", async (req, res) => {
  try {
    const { testName, scheduledOn, link } = req.body;
    const newTest = new Test({ testName, scheduledOn, link });
    await newTest.save();
    res.status(201).json({ message: "Test added successfully", test: newTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding test" });
  }
});

// Get all tests
app.get("/api/tests/all", async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tests" });
  }
});

// Delete a test
app.delete("/api/tests/delete/:id", async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting test" });
  }
});

//studentdashboard
app.get("/api/students/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find().lean();
    res.status(200).json(
      attendance.map((record) => ({
        ...record,
        studentId: record.studentId.toString(), // Convert ObjectId to string
      }))
    );
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/students/marks", async (req, res) => {
  try {
    const marks = await Mark.find();
    res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Quire.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Add a new question
app.post("/api/questions", async (req, res) => {
  try {
    const { question } = req.body;
    const newQuestion = new Quire({ question });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error adding question" });
  }
});

// Multer Storage Configuration
const storageConfig = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadVideos = multer({ storage: storageConfig });

const LectureSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  videos: [{ type: String, required: true }],
});

const Lecture = mongoose.model("Lecture", LectureSchema);

// API route to upload lectures
app.post(
  "/api/lectures/upload",
  uploadVideos.array("videos", 10),
  async (req, res) => {
    try {
      const { topic, description } = req.body;
      const videoPaths = req.files.map((file) => file.path);

      const newLecture = new Lecture({
        topic,
        description,
        videos: videoPaths,
      });

      await newLecture.save();
      res
        .status(201)
        .json({
          message: "Lectures uploaded successfully!",
          lecture: newLecture,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading lectures" });
    }
  }
);

app.get("/api/lectures/all", async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.status(200).json(lectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching lectures" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
