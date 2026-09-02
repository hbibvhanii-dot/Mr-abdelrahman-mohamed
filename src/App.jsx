import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Crown,
  Download,
  FileText,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Library,
  Lock,
  LogOut,
  MessageSquareText,
  PencilRuler,
  School,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trash2,
  UserCog,
  UserRound,
  Users,
  Video,
  Wand2,
  BookMarked,
  ListTodo,
  BarChart3,
  Award,
  PlayCircle,
  Plus,
  Edit3,
  CalendarDays,
  Clock3,
  UserPlus,
  CheckCheck,
  BellRing,
  RefreshCw,
} from 'lucide-react'
import { canUseSupabase, loadPlatformFromSupabase, savePlatformToSupabase } from './lib/supabase'

const STORAGE_KEY = 'mr-abdelrahman-platform'
const TEACHER_PASSWORD = 'mr-abdelrahman123'

const defaultPlatform = {
  students: [
    {
      id: 'stu-1',
      name: 'أمينة حسن',
      email: 'amina.hassan@example.com',
      level: 'متوسط',
      joinDate: '2025-01-10',
      status: 'active',
      progress: 72,
      lastActivity: 'قبل ساعتين',
      code: 'STU-8K4P-29MX',
      personalFile: {
        examResults: [
          { id: 'ex-1', title: 'اختبار القواعد', score: 88, date: '2026-08-10' },
          { id: 'ex-2', title: 'اختبار الاستماع', score: 92, date: '2026-08-18' },
        ],
        attendance: [
          { id: 'att-1', date: '2026-08-20', status: 'حاضر' },
          { id: 'att-2', date: '2026-08-21', status: 'غائب' },
          { id: 'att-3', date: '2026-08-22', status: 'حاضر' },
        ],
        monthlyFees: [
          { id: 'fee-1', month: 'أغسطس', amount: 250, status: 'مدفوع' },
          { id: 'fee-2', month: 'سبتمبر', amount: 250, status: 'قيد الدفع' },
        ],
      },
    },
    {
      id: 'stu-2',
      name: 'عمر صالح',
      email: 'omar.saleh@example.com',
      level: 'مبتدئ',
      joinDate: '2025-02-18',
      status: 'active',
      progress: 56,
      lastActivity: 'أمس',
      code: 'STU-3Q8A-12ER',
      personalFile: {
        examResults: [
          { id: 'ex-3', title: 'اختبار المفردات', score: 76, date: '2026-08-12' },
        ],
        attendance: [
          { id: 'att-4', date: '2026-08-20', status: 'حاضر' },
          { id: 'att-5', date: '2026-08-21', status: 'حاضر' },
          { id: 'att-6', date: '2026-08-22', status: 'متأخر' },
        ],
        monthlyFees: [
          { id: 'fee-3', month: 'أغسطس', amount: 250, status: 'مدفوع' },
        ],
      },
    },
    {
      id: 'stu-3',
      name: 'سارة علي',
      email: 'sara.ali@example.com',
      level: 'متقدم',
      joinDate: '2024-12-04',
      status: 'paused',
      progress: 88,
      lastActivity: 'قبل 3 أيام',
      code: 'STU-9FD2-44BG',
      personalFile: {
        examResults: [
          { id: 'ex-4', title: 'اختبار الكتابة', score: 95, date: '2026-08-14' },
          { id: 'ex-5', title: 'اختبار المحادثة', score: 90, date: '2026-08-19' },
        ],
        attendance: [
          { id: 'att-7', date: '2026-08-20', status: 'حاضر' },
          { id: 'att-8', date: '2026-08-21', status: 'حاضر' },
          { id: 'att-9', date: '2026-08-22', status: 'حاضر' },
        ],
        monthlyFees: [
          { id: 'fee-4', month: 'أغسطس', amount: 250, status: 'مدفوع' },
          { id: 'fee-5', month: 'سبتمبر', amount: 250, status: 'مدفوع' },
        ],
      },
    },
  ],
  codes: [
    { id: 'code-1', code: 'STU-8K4P-29MX', studentId: 'stu-1', studentName: 'Amina Hassan', status: 'active', createdAt: '2025-01-10' },
    { id: 'code-2', code: 'STU-3Q8A-12ER', studentId: 'stu-2', studentName: 'Omar Saleh', status: 'active', createdAt: '2025-02-18' },
    { id: 'code-3', code: 'STU-9FD2-44BG', studentId: 'stu-3', studentName: 'Sara Ali', status: 'disabled', createdAt: '2024-12-04' },
    { id: 'code-4', code: 'STU-7MKV-76AZ', studentId: null, studentName: 'Unassigned', status: 'active', createdAt: '2025-03-09' },
  ],
  courses: [
    { id: 'g1', title: 'General English', description: 'Build fluency and confidence in everyday communication.', level: 'Beginner', lessons: 12, progress: 68, category: 'general', accent: 'cyan', price: 250, isPaid: true },
    { id: 'g2', title: 'Grammar', description: 'Master grammar rules and sentence structure with clarity.', level: 'Intermediate', lessons: 14, progress: 82, category: 'grammar', accent: 'purple', price: 320, isPaid: true },
    { id: 'g3', title: 'Vocabulary', description: 'Expand your word power for conversations and writing.', level: 'Intermediate', lessons: 10, progress: 74, category: 'vocabulary', accent: 'blue', price: 220, isPaid: true },
    { id: 'g4', title: 'Listening', description: 'Understand spoken English in conversations and audio contexts.', level: 'Intermediate', lessons: 9, progress: 58, category: 'listening', accent: 'green', price: 260, isPaid: true },
    { id: 'g5', title: 'Speaking', description: 'Improve pronunciation, fluency, and confidence in speech.', level: 'Advanced', lessons: 11, progress: 63, category: 'speaking', accent: 'orange', price: 280, isPaid: true },
    { id: 'g6', title: 'Writing', description: 'Develop writing clarity for essays, emails, and tasks.', level: 'Intermediate', lessons: 8, progress: 81, category: 'writing', accent: 'pink', price: 300, isPaid: true },
  ],
  lessons: [
    { id: 'l1', title: 'Present Simple Tense', description: 'Daily actions and true statements in English.', difficulty: 'Beginner', duration: '18 min', category: 'Grammar', completed: true, type: 'Lesson', link: 'https://www.youtube.com/watch?v=7F3XHBRmWS4' },
    { id: 'l2', title: 'Past Simple', description: 'Talk about completed events in the past.', difficulty: 'Beginner', duration: '22 min', category: 'Grammar', completed: true, type: 'Video', link: 'https://www.youtube.com/watch?v=3v6x0yV9B0Q' },
    { id: 'l3', title: 'Future Tenses', description: 'Learn talking about plans and predictions.', difficulty: 'Intermediate', duration: '25 min', category: 'Grammar', completed: false, type: 'Lesson', link: '' },
    { id: 'l4', title: 'Vocabulary Building', description: 'Strengthen your everyday word bank.', difficulty: 'Beginner', duration: '20 min', category: 'Vocabulary', completed: true, type: 'Link', link: 'https://example.com/vocabulary' },
    { id: 'l5', title: 'Listening Practice', description: 'Train your ears to recognize key phrases.', difficulty: 'Intermediate', duration: '28 min', category: 'Listening', completed: false, type: 'Video', link: 'https://example.com/listening-practice' },
    { id: 'l6', title: 'Speaking Skills', description: 'Speak with rhythm, confidence, and structure.', difficulty: 'Intermediate', duration: '24 min', category: 'Speaking', completed: true, type: 'Lesson', link: '' },
    { id: 'l7', title: 'Writing Skills', description: 'Organize your ideas into polished sentences.', difficulty: 'Upper-Intermediate', duration: '30 min', category: 'Writing', completed: false, type: 'Lesson', link: '' },
  ],
  assignments: [
    { id: 'a1', title: 'Grammar Check', subject: 'Grammar', description: 'Complete mixed grammar exercises and sentence corrections.', dueDate: '2026-09-02', status: 'Pending', completed: false },
    { id: 'a2', title: 'Vocabulary Quiz', subject: 'Vocabulary', description: 'Match words to meanings and complete short tasks.', dueDate: '2026-08-30', status: 'Completed', completed: true },
    { id: 'a3', title: 'Listening Challenge', subject: 'Listening', description: 'Listen and answer questions based on short recordings.', dueDate: '2026-09-05', status: 'Pending', completed: false },
  ],
  quizzes: [
    { id: 'q1', title: 'Grammar Quick Quiz', subject: 'Grammar', score: 90, status: 'Excellent' },
    { id: 'q2', title: 'Listening Check', subject: 'Listening', score: 84, status: 'Strong' },
  ],
  resources: [
    { id: 'r1', title: 'Grammar Essentials PDF', description: 'Core rules to improve accuracy in daily English.', fileType: 'PDF', category: 'Grammar' },
    { id: 'r2', title: 'Daily Vocabulary Set', description: 'High-frequency words for communication and reading.', fileType: 'DOCX', category: 'Vocabulary' },
    { id: 'r3', title: 'Listening Audio Pack', description: 'Short audio clips with transcripts.', fileType: 'MP3', category: 'Listening' },
    { id: 'r4', title: 'Speaking Practice Cards', description: 'Topics and prompts for practice sessions.', fileType: 'PDF', category: 'Speaking' },
    { id: 'r5', title: 'Writing Templates', description: 'Sentence and paragraph patterns for writing tasks.', fileType: 'DOCX', category: 'Writing' },
  ],
  achievements: [
    { id: 'ach-1', title: 'Quiz Master', icon: 'star', description: 'Completed 3 quizzes with excellent results.', unlocked: true },
    { id: 'ach-2', title: 'Listening Pro', icon: 'audio', description: 'Achieved strong listening comprehension scores.', unlocked: true },
    { id: 'ach-3', title: 'Vocabulary Star', icon: 'book', description: 'Expanded vocabulary across key topics.', unlocked: false },
    { id: 'ach-4', title: 'Speaking Champion', icon: 'spark', description: 'Completed speaking tasks with confidence.', unlocked: true },
    { id: 'ach-5', title: 'Perfect Score', icon: 'award', description: 'Scored 100% in a challenge.', unlocked: false },
    { id: 'ach-6', title: 'Fast Learner', icon: 'bolt', description: 'Improved quickly in under 30 days.', unlocked: true },
  ],
}

function isValidPlatformData(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Array.isArray(value.students) &&
      Array.isArray(value.codes) &&
      Array.isArray(value.courses) &&
      Array.isArray(value.lessons) &&
      Array.isArray(value.assignments) &&
      Array.isArray(value.quizzes) &&
      Array.isArray(value.resources) &&
      Array.isArray(value.achievements),
  )
}

function getInitialPlatform() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultPlatform

    const parsed = JSON.parse(saved)
    if (isValidPlatformData(parsed)) {
      return parsed
    }

    return defaultPlatform
  } catch {
    return defaultPlatform
  }
}

async function hydratePlatformFromSupabase(setPlatform) {
  if (!canUseSupabase()) return

  try {
    const externalData = await loadPlatformFromSupabase()
    if (isValidPlatformData(externalData)) {
      setPlatform(externalData)
    }
  } catch (error) {
    console.error('Failed to hydrate platform from Supabase:', error)
  }
}

function getUniqueCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 10; i += 1) code += chars[Math.floor(Math.random() * chars.length)]
  return `STU-${code.slice(0, 4)}-${code.slice(4, 8)}`
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('en-US')} ر.س`
}

function App() {
  const [platform, setPlatform] = useState(getInitialPlatform)
  const [platformHydrated, setPlatformHydrated] = useState(() => !canUseSupabase())
  const [auth, setAuth] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('mr-platform-auth') || 'null')
      return session || { role: null, studentId: null, teacher: false }
    } catch {
      return { role: null, studentId: null, teacher: false }
    }
  })

  useEffect(() => {
    hydratePlatformFromSupabase(setPlatform).finally(() => {
      setPlatformHydrated(true)
    })
  }, [])

  useEffect(() => {
    if (!platformHydrated) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(platform))
    } catch (error) {
      console.error('Failed to save platform to localStorage:', error)
    }

    if (canUseSupabase()) {
      savePlatformToSupabase(platform)
    }
  }, [platform, platformHydrated])

  useEffect(() => {
    try {
      localStorage.setItem('mr-platform-auth', JSON.stringify(auth))
    } catch (error) {
      console.error('Failed to save auth session to localStorage:', error)
    }
  }, [auth])

  const student = platform.students.find((item) => item.id === auth.studentId) || null

  const loginStudent = (studentCode) => {
    const normalized = studentCode.trim().toUpperCase()
    const activeCode = platform.codes.find(
      (code) => code.code === normalized && code.status === 'active' && code.studentId,
    )

    if (activeCode) {
      const matchedStudent = platform.students.find((s) => s.id === activeCode.studentId)
      if (matchedStudent) {
        setAuth({ role: 'student', studentId: matchedStudent.id, teacher: false })
        return { ok: true, message: 'Welcome back!' }
      }
    }

    return { ok: false, message: 'Invalid student code or code is disabled.' }
  }

  const loginTeacher = (password) => {
    if (password === TEACHER_PASSWORD) {
      setAuth({ role: 'teacher', studentId: null, teacher: true })
      return { ok: true }
    }
    return { ok: false, message: 'Incorrect teacher password.' }
  }

  const logout = () => {
    setAuth({ role: null, studentId: null, teacher: false })
  }

  const generateStudentCode = (studentName = 'Unassigned') => {
    let nextCode = getUniqueCode()
    while (platform.codes.some((item) => item.code === nextCode)) {
      nextCode = getUniqueCode()
    }

    const newCode = {
      id: `code-${Date.now()}`,
      code: nextCode,
      studentId: null,
      studentName,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    setPlatform((current) => ({ ...current, codes: [newCode, ...current.codes] }))
    return newCode
  }

  const assignCodeToStudent = (codeId, studentId) => {
    setPlatform((current) => ({
      ...current,
      codes: current.codes.map((code) =>
        code.id === codeId
          ? {
              ...code,
              studentId,
              status: 'active',
              studentName: current.students.find((student) => student.id === studentId)?.name || code.studentName,
            }
          : code,
      ),
    }))
  }

  const toggleCodeStatus = (codeId) => {
    setPlatform((current) => ({
      ...current,
      codes: current.codes.map((code) =>
        code.id === codeId ? { ...code, status: code.status === 'active' ? 'disabled' : 'active' } : code,
      ),
    }))
  }

  const deleteCode = (codeId) => {
    setPlatform((current) => ({
      ...current,
      codes: current.codes.filter((code) => code.id !== codeId),
    }))
  }

  const addStudent = (newStudent) => {
    const studentRecord = {
      id: `stu-${Date.now()}`,
      name: newStudent.name,
      email: newStudent.email,
      level: newStudent.level,
      joinDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      progress: 0,
      lastActivity: 'الآن',
      code: newStudent.code || 'not assigned',
      personalFile: {
        examResults: [],
        attendance: [],
        monthlyFees: [],
        purchasedCourses: [],
      },
    }

    setPlatform((current) => ({
      ...current,
      students: [...current.students, studentRecord],
    }))

    if (newStudent.code) {
      setPlatform((current) => ({
        ...current,
        codes: current.codes.map((code) =>
          code.code === newStudent.code ? { ...code, studentId: studentRecord.id, studentName: newStudent.name } : code,
        ),
      }))
    }
  }

  const addStudentRecord = (studentId, section, item) => {
    setPlatform((current) => ({
      ...current,
      students: current.students.map((student) => {
        if (student.id !== studentId) return student
        const currentFile = student.personalFile || { examResults: [], attendance: [], monthlyFees: [], purchasedCourses: [] }
        return {
          ...student,
          personalFile: {
            ...currentFile,
            [section]: [...(currentFile[section] || []), item],
          },
        }
      }),
    }))
  }

  const purchaseCourse = (studentId, courseId, paymentMethod = 'cash', status = 'paid') => {
    setPlatform((current) => {
      const course = current.courses.find((item) => item.id === courseId)
      const nextPayment = {
        id: `payment-${Date.now()}`,
        courseId,
        courseTitle: course?.title || 'Course',
        amount: Number(course?.price || 0),
        paymentMethod,
        status,
        purchasedAt: new Date().toISOString(),
      }

      return {
        ...current,
        students: current.students.map((student) => {
          if (student.id !== studentId) return student
          const currentFile = student.personalFile || { examResults: [], attendance: [], monthlyFees: [], purchasedCourses: [], coursePayments: [] }
          const existingPayments = currentFile.coursePayments || []
          const hasPaidAccess = existingPayments.some((payment) => payment.courseId === courseId && payment.status === 'paid')
          const purchasedCourses = Array.from(new Set([...(currentFile.purchasedCourses || []), courseId]))

          return {
            ...student,
            personalFile: {
              ...currentFile,
              purchasedCourses: status === 'paid' ? purchasedCourses : currentFile.purchasedCourses || [],
              coursePayments: hasPaidAccess ? existingPayments : [...existingPayments, nextPayment],
            },
          }
        }),
      }
    })
  }

  const updateCoursePaymentStatus = (studentId, courseId, status) => {
    setPlatform((current) => ({
      ...current,
      students: current.students.map((student) => {
        if (student.id !== studentId) return student
        const currentFile = student.personalFile || { examResults: [], attendance: [], monthlyFees: [], purchasedCourses: [], coursePayments: [] }
        const coursePayments = (currentFile.coursePayments || []).map((payment) =>
          payment.courseId === courseId ? { ...payment, status } : payment,
        )
        const purchasedCourses = status === 'paid'
          ? Array.from(new Set([...(currentFile.purchasedCourses || []), courseId]))
          : (currentFile.purchasedCourses || []).filter((id) => id !== courseId)

        return {
          ...student,
          personalFile: {
            ...currentFile,
            purchasedCourses,
            coursePayments,
          },
        }
      }),
    }))
  }

  const addCourse = (course) => {
    const price = Number(course.price) || 0
    const newCourse = {
      id: `course-${Date.now()}`,
      title: course.title,
      description: course.description,
      level: course.level,
      lessons: Number(course.lessons) || 0,
      progress: 0,
      category: course.category || 'general',
      accent: 'blue',
      price,
      isPaid: price > 0,
    }
    setPlatform((current) => ({ ...current, courses: [newCourse, ...current.courses] }))
  }

  const addLesson = (lesson) => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      duration: `${lesson.duration} min`,
      category: lesson.category,
      completed: false,
      type: lesson.type || 'Lesson',
      link: lesson.link || '',
    }
    setPlatform((current) => ({ ...current, lessons: [newLesson, ...current.lessons] }))
  }

  const addQuiz = (quiz) => {
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      title: quiz.title,
      subject: quiz.subject,
      description: quiz.description,
      score: Number(quiz.score) || 0,
      status: 'Ready',
      duration: `${quiz.duration || 15} min`,
      link: quiz.link || '',
    }
    setPlatform((current) => ({ ...current, quizzes: [newQuiz, ...current.quizzes] }))
  }

  const addAssignment = (assignment) => {
    const newAssignment = {
      id: `assignment-${Date.now()}`,
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      status: 'Pending',
      completed: false,
    }
    setPlatform((current) => ({ ...current, assignments: [newAssignment, ...current.assignments] }))
  }

  const deleteStudent = (studentId) => {
    setPlatform((current) => ({
      ...current,
      students: current.students.filter((student) => student.id !== studentId),
      codes: current.codes.map((code) =>
        code.studentId === studentId ? { ...code, studentId: null, studentName: 'Unassigned', status: 'active' } : code,
      ),
    }))
  }

  const updateStudentStatus = (studentId, status) => {
    setPlatform((current) => ({
      ...current,
      students: current.students.map((student) =>
        student.id === studentId ? { ...student, status } : student,
      ),
    }))
  }

  const deleteCourse = (courseId) => {
    setPlatform((current) => ({ ...current, courses: current.courses.filter((course) => course.id !== courseId) }))
  }

  const deleteLesson = (lessonId) => {
    setPlatform((current) => ({ ...current, lessons: current.lessons.filter((lesson) => lesson.id !== lessonId) }))
  }

  const deleteAssignment = (assignmentId) => {
    setPlatform((current) => ({
      ...current,
      assignments: current.assignments.filter((assignment) => assignment.id !== assignmentId),
    }))
  }

  const deleteResource = (resourceId) => {
    setPlatform((current) => ({
      ...current,
      resources: current.resources.filter((resource) => resource.id !== resourceId),
    }))
  }

  const addResource = (resource) => {
    const newResource = {
      id: `resource-${Date.now()}`,
      title: resource.title,
      description: resource.description,
      fileType: resource.fileType,
      category: resource.category,
      link: resource.link || '',
    }
    setPlatform((current) => ({ ...current, resources: [newResource, ...current.resources] }))
  }

  const getStudentWithCode = (studentId) => {
    const studentEntry = platform.students.find((student) => student.id === studentId)
    const codeEntry = platform.codes.find((code) => code.studentId === studentId)
    return { studentEntry, codeEntry }
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student-login" element={<StudentLoginPage loginStudent={loginStudent} />} />
      <Route path="/teacher-login" element={<TeacherLoginPage loginTeacher={loginTeacher} />} />

      <Route element={<ProtectedRoute allowedRole="student" auth={auth} />}>
        <Route path="/student/dashboard" element={<StudentDashboardPage student={student} platform={platform} logout={logout} />} />
        <Route path="/student/courses" element={<StudentCoursesPage platform={platform} student={student} logout={logout} purchaseCourse={purchaseCourse} />} />
        <Route path="/student/course/:courseId" element={<StudentCourseDetailPage platform={platform} student={student} logout={logout} purchaseCourse={purchaseCourse} />} />
        <Route path="/student/lessons" element={<StudentLessonsPage platform={platform} student={student} logout={logout} />} />
        <Route path="/student/lesson/:lessonId" element={<StudentLessonDetailPage platform={platform} student={student} logout={logout} />} />
        <Route path="/student/assignments" element={<StudentAssignmentsPage platform={platform} student={student} logout={logout} />} />
        <Route path="/student/progress" element={<StudentProgressPage platform={platform} student={student} logout={logout} />} />
        <Route path="/student/achievements" element={<StudentAchievementsPage platform={platform} student={student} logout={logout} />} />
        <Route path="/student/resources" element={<StudentResourcesPage platform={platform} student={student} logout={logout} />} />
        <Route path="/student/profile" element={<StudentProfilePage student={student} platform={platform} logout={logout} />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="teacher" auth={auth} />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage platform={platform} logout={logout} />} />
        <Route path="/teacher/students" element={<StudentsPage platform={platform} addStudent={addStudent} deleteStudent={deleteStudent} updateStudentStatus={updateStudentStatus} logout={logout} />} />
        <Route path="/teacher/student/:studentId" element={<StudentManagementDetailPage platform={platform} addStudentRecord={addStudentRecord} logout={logout} />} />
        <Route path="/teacher/student-codes" element={<StudentCodesPage platform={platform} generateStudentCode={generateStudentCode} assignCodeToStudent={assignCodeToStudent} toggleCodeStatus={toggleCodeStatus} deleteCode={deleteCode} logout={logout} />} />
        <Route path="/teacher/attendance" element={<TeacherAttendancePage platform={platform} addStudentRecord={addStudentRecord} logout={logout} />} />
        <Route path="/teacher/fees" element={<TeacherFeesPage platform={platform} addStudentRecord={addStudentRecord} logout={logout} />} />
        <Route path="/teacher/subscriptions" element={<TeacherSubscriptionsPage platform={platform} updateCoursePaymentStatus={updateCoursePaymentStatus} logout={logout} />} />
        <Route path="/teacher/reports" element={<TeacherReportsPage platform={platform} logout={logout} />} />
        <Route path="/teacher/courses" element={<CourseManagementPage platform={platform} addCourse={addCourse} deleteCourse={deleteCourse} logout={logout} />} />
        <Route path="/teacher/lessons" element={<LessonManagementPage platform={platform} addLesson={addLesson} deleteLesson={deleteLesson} logout={logout} />} />
        <Route path="/teacher/quizzes" element={<TeacherQuizPage platform={platform} addQuiz={addQuiz} logout={logout} />} />
        <Route path="/teacher/assignments" element={<AssignmentManagementPage platform={platform} addAssignment={addAssignment} deleteAssignment={deleteAssignment} logout={logout} />} />
        <Route path="/teacher/progress" element={<TeacherProgressPage platform={platform} logout={logout} />} />
        <Route path="/teacher/resources" element={<ResourcesManagementPage platform={platform} addResource={addResource} deleteResource={deleteResource} logout={logout} />} />
        <Route path="/teacher/settings" element={<TeacherSettingsPage logout={logout} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ProtectedRoute({ auth, allowedRole }) {
  if (!auth.role) {
    return <Navigate to={allowedRole === 'student' ? '/student-login' : '/teacher-login'} replace />
  }

  if (auth.role !== allowedRole) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

function AppShell({ children, sidebar, topbarTitle, logout }) {
  const location = useLocation()

  return (
    <div className='app-shell'>
      <aside className='sidebar'>
        <div className='brand-block'>
          <div className='brand-icon'><GraduationCap size={20} /></div>
          <div>
            <div className='brand-title'>Mr Abdelrahman</div>
            <div className='brand-subtitle'>ENGLISH LEARNING</div>
          </div>
        </div>
        <nav className='sidebar-nav'>
          {sidebar.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className='nav-icon'>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className='logout-button' onClick={logout}>
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <main className='main-panel'>
        <header className='top-header'>
          <div>
            <div className='eyebrow'>Platform</div>
            <h1>{topbarTitle}</h1>
          </div>
          <div className='header-actions'>
            <span className='badge soft'>{location.pathname.includes('/student') ? 'Student Area' : 'Teacher Area'}</span>
            <button className='primary-button small'>Upgrade</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}

function getTeacherSidebar() {
  return [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/teacher/students', label: 'Students', icon: <Users size={16} /> },
    { to: '/teacher/student-codes', label: 'Student Codes', icon: <KeyRound size={16} /> },
    { to: '/teacher/attendance', label: 'Attendance', icon: <CheckCheck size={16} /> },
    { to: '/teacher/fees', label: 'Fees', icon: <BriefcaseBusiness size={16} /> },
    { to: '/teacher/subscriptions', label: 'Subscriptions', icon: <CreditCard size={16} /> },
    { to: '/teacher/reports', label: 'Reports', icon: <BarChart3 size={16} /> },
    { to: '/teacher/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/teacher/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/teacher/quizzes', label: 'Quizzes', icon: <Sparkles size={16} /> },
    { to: '/teacher/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/teacher/progress', label: 'Student Progress', icon: <BarChart3 size={16} /> },
    { to: '/teacher/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/teacher/settings', label: 'Settings', icon: <Settings size={16} /> },
  ]
}

function HomePage() {
  return (
    <div className='page-shell'>
      <header className='landing-header'>
        <div className='brand-row'>
          <div className='brand-icon large'><GraduationCap size={24} /></div>
          <div>
            <div className='brand-title'>Mr Abdelrahman Mohamed</div>
            <div className='brand-subtitle'>ENGLISH LEARNING PLATFORM</div>
          </div>
        </div>

        <nav className='header-nav'>
          <Link to='/'>Home</Link>
          <Link to='/student-login'>Student Login</Link>
          <Link to='/teacher-login'>Teacher Login</Link>
        </nav>
      </header>

      <section className='hero-section'>
        <div className='hero-copy'>
          <span className='eyebrow'>Learn. Practice. Achieve.</span>
          <h1>Master English. Unlock Opportunities.</h1>
          <p>
            A modern English learning platform designed to help students learn, practice, improve their skills,
            and achieve their goals.
          </p>
          <div className='cta-row'>
            <Link className='primary-button' to='/student-login'>Student Access</Link>
            <Link className='secondary-button' to='/teacher-login'>Teacher Access</Link>
          </div>
          <div className='hero-stats'>
            <div className='mini-stat'><BookOpen size={18} /> <strong>6+ Courses</strong></div>
            <div className='mini-stat'><GraduationCap size={18} /> <strong>Flexible Learning</strong></div>
            <div className='mini-stat'><Sparkles size={18} /> <strong>Modern Tools</strong></div>
          </div>
        </div>

        <div className='hero-visual'>
          <div className='lesson-card card-1'>
            <BookOpen size={32} />
            <div>
              <strong>Book</strong>
              <small>Study plan</small>
            </div>
          </div>
          <div className='lesson-card card-2'>
            <GraduationCap size={30} />
            <div>
              <strong>Skills</strong>
              <small>Progress driven</small>
            </div>
          </div>
          <div className='lesson-card card-3'>
            <PencilRuler size={28} />
            <div>
              <strong>Writing</strong>
              <small>Practice daily</small>
            </div>
          </div>
          <div className='orb orb-1'></div>
          <div className='orb orb-2'></div>
        </div>
      </section>

      <section className='auth-grid'>
        <div className='auth-panel'>
          <div className='panel-icon blue'><UserRound size={28} /></div>
          <h3>Student Login</h3>
          <p>Enter your student code to access your learning platform.</p>
          <div className='form-group'>
            <label>Student Code</label>
            <input type='text' placeholder='STU-8K4P-29MX' />
          </div>
          <Link className='primary-button full' to='/student-login'>Access Platform</Link>
        </div>

        <div className='auth-panel'>
          <div className='panel-icon purple'><Lock size={28} /></div>
          <h3>Teacher Login</h3>
          <p>Private access for Mr Abdelrahman Mohamed</p>
          <div className='form-group'>
            <label>Teacher Password</label>
            <input type='password' placeholder='Enter teacher password' />
          </div>
          <Link className='primary-button full' to='/teacher-login'>Teacher Login</Link>
        </div>
      </section>
    </div>
  )
}

function StudentLoginPage({ loginStudent }) {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = loginStudent(value)
    if (result.ok) {
      navigate('/student/dashboard')
      return
    }
    setMessage(result.message)
  }

  return (
    <div className='auth-page'>
      <div className='auth-card large'>
        <div className='auth-header'>
          <div className='panel-icon blue'><UserRound size={26} /></div>
          <div>
            <span className='eyebrow'>Student Access</span>
            <h2>Student Login</h2>
          </div>
        </div>

        <p>Enter your student code to access your learning platform.</p>

        <form onSubmit={handleSubmit} className='form-stack'>
          <div className='form-group'>
            <label>Student Code</label>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              type='text'
              placeholder='STU-8K4P-29MX'
            />
          </div>
          <button type='submit' className='primary-button full'>Access Platform</button>
        </form>

        {message && <div className='message-bad'>{message}</div>}
        <div className='helper-row'>
          <Link to='/'>Back Home</Link>
          <Link to='/teacher-login'>Teacher Login</Link>
        </div>
      </div>
    </div>
  )
}

function TeacherLoginPage({ loginTeacher }) {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = loginTeacher(password)
    if (result.ok) {
      navigate('/teacher/dashboard')
      return
    }
    setMessage(result.message)
  }

  return (
    <div className='auth-page'>
      <div className='auth-card large'>
        <div className='auth-header'>
          <div className='panel-icon purple'><Lock size={24} /></div>
          <div>
            <span className='eyebrow'>Private Access</span>
            <h2>Teacher Login</h2>
          </div>
        </div>

        <p>Private access for Mr Abdelrahman Mohamed</p>

        <form onSubmit={handleSubmit} className='form-stack'>
          <div className='form-group'>
            <label>Teacher Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type='password'
              placeholder='Enter teacher password'
            />
          </div>
          <button type='submit' className='primary-button full'>Teacher Login</button>
        </form>

        {message && <div className='message-bad'>{message}</div>}
        <div className='helper-row'>
          <Link to='/'>Back Home</Link>
          <Link to='/student-login'>Student Login</Link>
        </div>
      </div>
    </div>
  )
}

function StudentDashboardPage({ student, platform, logout }) {
  const stats = [
    { label: 'Lessons Completed', value: '14', icon: <BookOpen size={18} /> },
    { label: 'Assignments Completed', value: '6', icon: <CheckCircle2 size={18} /> },
    { label: 'Overall Progress', value: '72%', icon: <Target size={18} /> },
    { label: 'Achievements', value: '4', icon: <Award size={18} /> },
  ]

  const studentSidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  return (
    <AppShell sidebar={studentSidebar} topbarTitle='Student Dashboard' logout={logout}>
      <section className='welcome-box'>
        <div>
          <span className='eyebrow'>Welcome</span>
          <h2>Welcome, {student?.name || 'Student'}!</h2>
          <p>Keep learning, keep improving, and achieve your goals.</p>
        </div>
        <div className='badge accent'>Level: {student?.level || 'Intermediate'}</div>
      </section>

      <section className='stats-grid'>
        {stats.map((stat) => (
          <div key={stat.label} className='stat-card'>
            <div className='stat-icon'>{stat.icon}</div>
            <div>
              <h4>{stat.value}</h4>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className='content-grid two-col'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>My Courses</h3>
            <Link to='/student/courses'><span className='chip'>View all</span></Link>
          </div>
          <div className='course-list'>
            {platform.courses.slice(0, 3).map((course) => (
              <div key={course.id} className='course-item'>
                <div className='course-icon accent-purple'><BookOpen size={18} /></div>
                <div className='course-copy'>
                  <strong>{course.title}</strong>
                  <small>{course.description}</small>
                  <div className='mini-meta'>
                    <span>{course.level}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className='progress-bar'><span style={{ width: `${course.progress}%` }} /></div>
                </div>
                <Link className='text-link' to={`/student/course/${course.id}`}>Continue Learning</Link>
              </div>
            ))}
          </div>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>Motivation</h3>
          </div>
          <div className='motivation-card'>
            <Crown size={28} />
            <h4>Consistency is the key</h4>
            <p>Every lesson you complete brings you closer to fluency, confidence, and stronger communication.</p>
            <Link className='secondary-button' to='/student/lessons'>Continue Learning</Link>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function StudentCoursesPage({ platform, student, logout, purchaseCourse }) {
  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({})
  const payments = student?.personalFile?.coursePayments || []

  return (
    <AppShell sidebar={sidebar} topbarTitle='All Courses' logout={logout}>
      <div className='cards-grid'>
        {platform.courses.map((course) => {
          const hasPaidAccess = payments.some((payment) => payment.courseId === course.id && payment.status === 'paid')
          const isPaidCourse = Number(course.price || 0) > 0

          return (
            <div key={course.id} className='info-card'>
              <div className='info-card-header'>
                <div className='course-icon accent-blue'><BookOpen size={18} /></div>
                <span className='chip'>{course.level}</span>
                <span className={`chip ${isPaidCourse ? 'warn' : 'success'}`}>{isPaidCourse ? `${formatCurrency(course.price)}` : 'مجاني'}</span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className='meta-line'>
                <span>{course.lessons} lessons</span>
                <span>{course.progress}%</span>
              </div>
              <div className='progress-bar'><span style={{ width: `${course.progress}%` }} /></div>
              {isPaidCourse && !hasPaidAccess ? (
                <div className='form-stack'>
                  <select value={selectedPaymentMethod[course.id] || 'cash'} onChange={(event)=> setSelectedPaymentMethod({ ...selectedPaymentMethod, [course.id]: event.target.value })}>
                    <option value='cash'>Cash</option>
                    <option value='transfer'>Bank Transfer</option>
                    <option value='card'>Card</option>
                  </select>
                  <button type='button' className='primary-button' onClick={() => purchaseCourse(student.id, course.id, selectedPaymentMethod[course.id] || 'cash', 'paid')}>
                    Buy for {formatCurrency(course.price)}
                  </button>
                </div>
              ) : (
                <Link className='primary-button' to={`/student/course/${course.id}`}>Open Course</Link>
              )}
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}

function StudentCourseDetailPage({ platform, student, logout, purchaseCourse }) {
  const { courseId } = useParams()
  const course = platform.courses.find((item) => item.id === courseId)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  if (!course) return <Navigate to='/student/courses' replace />

  const hasPaidAccess = (student?.personalFile?.coursePayments || []).some((payment) => payment.courseId === course.id && payment.status === 'paid')
  const hasAccess = Number(course.price || 0) === 0 || hasPaidAccess

  return (
    <AppShell sidebar={sidebar} topbarTitle={course.title} logout={logout}>
      <div className='detail-panel'>
        <div className='detail-box'>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <div className='meta-row'>
            <span>Level: {course.level}</span>
            <span>Lessons: {course.lessons}</span>
            <span>Progress: {course.progress}%</span>
            <span>Price: {Number(course.price || 0) > 0 ? formatCurrency(course.price) : 'Free'}</span>
          </div>
          <div className='progress-bar large'><span style={{ width: `${course.progress}%` }} /></div>
          {hasAccess ? (
            <Link className='primary-button' to='/student/lessons'>Continue to Lessons</Link>
          ) : (
            <div className='form-stack'>
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option value='cash'>Cash</option>
                <option value='transfer'>Bank Transfer</option>
                <option value='card'>Card</option>
              </select>
              <button type='button' className='primary-button' onClick={() => purchaseCourse(student.id, course.id, paymentMethod, 'paid')}>
                Pay {formatCurrency(course.price)} and unlock this course
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

function StudentLessonsPage({ platform, student, logout }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', 'Grammar', 'Vocabulary', 'Listening', 'Speaking', 'Writing']
  const filteredLessons = platform.lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || lesson.category === category
    return matchesSearch && matchesCategory
  })

  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  return (
    <AppShell sidebar={sidebar} topbarTitle='Lessons' logout={logout}>
      <div className='toolbar'>
        <div className='search-box'>
          <Search size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search lesson' />
        </div>
        <div className='filter-row'>
          {categories.map((item) => (
            <button key={item} className={`filter-button ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className='cards-grid'>
        {filteredLessons.map((lesson) => (
          <div key={lesson.id} className='info-card'>
            <div className='info-card-header'>
              <div className='course-icon accent-cyan'><BookOpen size={18} /></div>
              <span className='chip'>{lesson.category}</span>
              <span className='chip soft'>{lesson.type || 'Lesson'}</span>
            </div>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <div className='meta-row'>
              <span>Difficulty: {lesson.difficulty}</span>
              <span>{lesson.duration}</span>
            </div>
            <div className='action-row'>
              <Link className='primary-button' to={`/student/lesson/${lesson.id}`}>Start Lesson</Link>
              {lesson.link ? <a className='secondary-button' href={lesson.link} target='_blank' rel='noreferrer'>Open Link</a> : null}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}

function StudentLessonDetailPage({ platform, student, logout }) {
  const { lessonId } = useParams()
  const lesson = platform.lessons.find((item) => item.id === lessonId)

  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  if (!lesson) return <Navigate to='/student/lessons' replace />

  return (
    <AppShell sidebar={sidebar} topbarTitle={lesson.title} logout={logout}>
      <div className='detail-panel'>
        <div className='detail-box'>
          <h2>{lesson.title}</h2>
          <p>{lesson.description}</p>
          <div className='meta-row'>
            <span>{lesson.category}</span>
            <span>{lesson.difficulty}</span>
            <span>{lesson.type || 'Lesson'}</span>
            <span>{lesson.duration}</span>
          </div>
          <div className='lesson-content'>
            <div className='lesson-point'>1. Learn the key grammar rule and examples.</div>
            <div className='lesson-point'>2. Practice using the new form in sentences.</div>
            <div className='lesson-point'>3. Complete a quick activity to check your understanding.</div>
          </div>
          {lesson.link ? (
            <a className='primary-button' href={lesson.link} target='_blank' rel='noreferrer'>Open Lesson Resource</a>
          ) : null}
          <Link className='secondary-button' to='/student/lessons'>Finish Lesson</Link>
        </div>
      </div>
    </AppShell>
  )
}

function StudentAssignmentsPage({ platform, student, logout }) {
  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  const [tab, setTab] = useState('All')
  const tabs = ['All', 'Pending', 'Completed']
  const filteredAssignments = platform.assignments.filter((assignment) => tab === 'All' || assignment.status === tab)

  return (
    <AppShell sidebar={sidebar} topbarTitle='Assignments & Quizzes' logout={logout}>
      <div className='tab-row'>
        {tabs.map((item) => (
          <button key={item} className={`tab-button ${tab === item ? 'selected' : ''}`} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className='cards-grid'>
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className='info-card'>
            <div className='info-card-header'>
              <div className='course-icon accent-purple'><FileText size={18} /></div>
              <span className='chip'>{assignment.status}</span>
            </div>
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <div className='meta-row'>
              <span>Subject: {assignment.subject}</span>
              <span>Due: {assignment.dueDate}</span>
            </div>
            <button className='primary-button'>Start Assignment</button>
          </div>
        ))}
      </div>

      <div className='panel'>
        <div className='panel-header'>
          <h3>Short Quizzes</h3>
        </div>
        <div className='quiz-list'>
          {platform.quizzes.map((quiz) => (
            <div key={quiz.id} className='quiz-item'>
              <div className='quiz-title'>{quiz.title}</div>
              <div className='meta-row'>
                <span>{quiz.subject}</span>
                <span>{quiz.score}%</span>
              </div>
              <button className='secondary-button'>Take Quiz</button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function StudentProgressPage({ platform, student, logout }) {
  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  const skills = [
    { label: 'Grammar', value: 82 },
    { label: 'Vocabulary', value: 74 },
    { label: 'Listening', value: 68 },
    { label: 'Speaking', value: 76 },
    { label: 'Writing', value: 80 },
  ]

  return (
    <AppShell sidebar={sidebar} topbarTitle='تقدمي' logout={logout}>
      <div className='stats-grid'>
        {[
          { label: 'التقدم العام', value: '72%' },
          { label: 'الدروس المكتملة', value: '14' },
          { label: 'الواجبات المكتملة', value: '6' },
          { label: 'متوسط الدرجات', value: '86%' },
        ].map((item) => (
          <div key={item.label} className='stat-card'>
            <h4>{item.value}</h4>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      <div className='content-grid two-col'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>تقدم المهارات</h3>
          </div>
          <div className='skill-list'>
            {skills.map((skill) => (
              <div key={skill.label} className='skill-row'>
                <div className='skill-label'>{skill.label}</div>
                <div className='progress-bar'><span style={{ width: `${skill.value}%` }} /></div>
                <div className='skill-value'>{skill.value}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>النشاط الأخير</h3>
          </div>
          <ul className='activity-list'>
            <li>تم إكمال درس Present Simple.</li>
            <li>تم إنهاء اختبار المفردات.</li>
            <li>تم إرسال واجب Grammar Check.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  )
}

function StudentAchievementsPage({ platform, student, logout }) {
  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  return (
    <AppShell sidebar={sidebar} topbarTitle='Achievements' logout={logout}>
      <div className='cards-grid'>
        {platform.achievements.map((achievement) => (
          <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`}>
            <div className='achievement-icon'>
              {achievement.icon === 'star' && <Star size={20} />}
              {achievement.icon === 'audio' && <Video size={20} />}
              {achievement.icon === 'book' && <BookOpen size={20} />}
              {achievement.icon === 'spark' && <Sparkles size={20} />}
              {achievement.icon === 'award' && <Award size={20} />}
              {achievement.icon === 'bolt' && <Target size={20} />}
            </div>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            <span className='chip'>{achievement.unlocked ? 'Unlocked' : 'Locked'}</span>
          </div>
        ))}
      </div>
    </AppShell>
  )
}

function StudentResourcesPage({ platform, student, logout }) {
  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  return (
    <AppShell sidebar={sidebar} topbarTitle='Resources' logout={logout}>
      <div className='cards-grid'>
        {platform.resources.map((resource) => (
          <div key={resource.id} className='info-card'>
            <div className='info-card-header'>
              <div className='course-icon accent-green'><Library size={18} /></div>
              <span className='chip'>{resource.category}</span>
            </div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <div className='meta-line'>
              <span>{resource.fileType}</span>
              <span>{resource.link ? 'Link available' : 'Download'}</span>
            </div>
            {resource.link ? (
              <a className='primary-button' href={resource.link} target='_blank' rel='noreferrer'><Download size={16} /> Open</a>
            ) : (
              <button className='primary-button'><Download size={16} /> Download</button>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  )
}

function StudentProfilePage({ student, platform, logout }) {
  const code = platform.codes.find((item) => item.studentId === student?.id)
  const sidebar = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/courses', label: 'Courses', icon: <BookMarked size={16} /> },
    { to: '/student/lessons', label: 'Lessons', icon: <Video size={16} /> },
    { to: '/student/assignments', label: 'Assignments', icon: <ListTodo size={16} /> },
    { to: '/student/progress', label: 'My Progress', icon: <BarChart3 size={16} /> },
    { to: '/student/achievements', label: 'Achievements', icon: <Award size={16} /> },
    { to: '/student/resources', label: 'Resources', icon: <Library size={16} /> },
    { to: '/student/profile', label: 'My Profile', icon: <UserRound size={16} /> },
  ]

  return (
    <AppShell sidebar={sidebar} topbarTitle='ملفي الشخصي' logout={logout}>
      <div className='profile-card'>
        <div className='profile-avatar'>{student?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
        <div className='profile-body'>
          <h2>{student?.name}</h2>
          <div className='detail-grid'>
            <div><span>كود الطالب</span><strong>{code?.code || 'N/A'}</strong></div>
            <div><span>البريد الإلكتروني</span><strong>{student?.email}</strong></div>
            <div><span>المستوى</span><strong>{student?.level}</strong></div>
            <div><span>تاريخ الانضمام</span><strong>{student?.joinDate}</strong></div>
          </div>
          <div className='action-row'>
            <button className='primary-button'>تعديل الملف</button>
            <button className='secondary-button'>تغيير كلمة المرور</button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function TeacherDashboardPage({ platform, logout }) {
  const teacherSidebar = getTeacherSidebar()

  const totalRevenue = platform.students.reduce((sum, student) => {
    const payments = student.personalFile?.coursePayments || []
    return sum + payments.filter((payment) => payment.status === 'paid').reduce((total, payment) => total + Number(payment.amount || 0), 0)
  }, 0)

  const stats = [
    { label: 'إجمالي الطلاب', value: platform.students.length },
    { label: 'الطلاب النشطون', value: platform.students.filter((student) => student.status === 'active').length },
    { label: 'أكواد الطلاب', value: platform.codes.length },
    { label: 'الكورسات', value: platform.courses.length },
    { label: 'الدروس', value: platform.lessons.length },
    { label: 'الواجبات', value: platform.assignments.length },
    { label: 'إيراد الكورسات', value: `${formatCurrency(totalRevenue)}` },
  ]

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='لوحة تحكم المعلم' logout={logout}>
      <section className='stats-grid wide'>
        {stats.map((item) => (
          <div key={item.label} className='stat-card'>
            <div className='stat-icon'><BarChart3 size={18} /></div>
            <div>
              <h4>{item.value}</h4>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className='content-grid two-col'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>النشاط الأخير للطلاب</h3>
          </div>
          <ul className='activity-list'>
            <li>أمينة حسن أكملت تحدي الاستماع.</li>
            <li>عمر صالح بدأ مراجعة المفردات.</li>
            <li>سارة علي أرسلت واجب الكتابة.</li>
          </ul>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>الطلاب الذين يحتاجون متابعة</h3>
          </div>
          <div className='attention-list'>
            {platform.students.slice(0, 2).map((student) => (
              <div key={student.id} className='attention-item'>
                <div>
                  <strong>{student.name}</strong>
                  <small>{student.level}</small>
                </div>
                <span className='chip warn'>{student.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function StudentsPage({ platform, addStudent, deleteStudent, updateStudentStatus, logout }) {
  const teacherSidebar = getTeacherSidebar()

  const [form, setForm] = useState({ name: '', email: '', level: 'Beginner', code: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name || !form.email) return
    const studentCode = form.code || getUniqueCode()
    const existing = platform.students.find((item) => item.email === form.email)
    if (existing) {
      updateStudentStatus(existing.id, 'active')
      return
    }

    addStudent({ name: form.name, email: form.email, level: form.level, code: studentCode })
    setForm({ name: '', email: '', level: 'Beginner', code: '' })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='إدارة الطلاب' logout={logout}>
      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>إضافة طالب جديد</h3>
          </div>
          <form onSubmit={handleSubmit} className='form-stack'>
            <div className='form-group'>
              <label>اسم الطالب</label>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder='اسم الطالب بالكامل' />
            </div>
            <div className='form-group'>
              <label>البريد الإلكتروني</label>
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder='example@email.com' />
            </div>
            <div className='form-group'>
              <label>المستوى</label>
              <select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>
                <option>مبتدئ</option>
                <option>متوسط</option>
                <option>متقدم</option>
              </select>
            </div>
            <div className='form-group'>
              <label>كود الطالب</label>
              <input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder='اختياري' />
            </div>
            <button type='submit' className='primary-button'>إضافة الطالب</button>
          </form>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>قائمة الطلاب</h3>
          </div>
          <div className='list-table'>
            {platform.students.map((student) => (
              <div key={student.id} className='table-row'>
                <div>
                  <strong>{student.name}</strong><br />
                  <small>{student.code}</small>
                </div>
                <div>{student.level}</div>
                <div>{student.progress}%</div>
                <div>{student.lastActivity}</div>
                <div>
                  <span className={`chip ${student.status === 'active' ? 'success' : 'warn'}`}>{student.status === 'active' ? 'نشط' : 'موقوف'}</span>
                </div>
                <div className='row-actions'>
                  <Link to={`/teacher/student/${student.id}`}>ملف الطالب</Link>
                  <button className='mini-button' onClick={() => updateStudentStatus(student.id, student.status === 'active' ? 'paused' : 'active')}>
                    {student.status === 'active' ? 'تعطيل' : 'تفعيل'}
                  </button>
                  <button className='mini-button danger' onClick={() => deleteStudent(student.id)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function StudentManagementDetailPage({ platform, addStudentRecord, logout }) {
  const { studentId } = useParams()
  const student = platform.students.find((item) => item.id === studentId)

  const [examForm, setExamForm] = useState({ title: '', score: '', date: '' })
  const [attendanceForm, setAttendanceForm] = useState({ date: '', status: 'حاضر' })
  const [feeForm, setFeeForm] = useState({ month: '', amount: '', status: 'مدفوع' })

  if (!student) return <Navigate to='/teacher/students' replace />

  const file = student.personalFile || { examResults: [], attendance: [], monthlyFees: [] }

  const handleExamSubmit = (event) => {
    event.preventDefault()
    if (!examForm.title || !examForm.score) return
    addStudentRecord(student.id, 'examResults', {
      id: `exam-${Date.now()}`,
      title: examForm.title,
      score: Number(examForm.score),
      date: examForm.date || new Date().toISOString().slice(0, 10),
    })
    setExamForm({ title: '', score: '', date: '' })
  }

  const handleAttendanceSubmit = (event) => {
    event.preventDefault()
    if (!attendanceForm.date) return
    addStudentRecord(student.id, 'attendance', {
      id: `attendance-${Date.now()}`,
      date: attendanceForm.date,
      status: attendanceForm.status,
    })
    setAttendanceForm({ date: '', status: 'حاضر' })
  }

  const handleFeeSubmit = (event) => {
    event.preventDefault()
    if (!feeForm.month || !feeForm.amount) return
    addStudentRecord(student.id, 'monthlyFees', {
      id: `fee-${Date.now()}`,
      month: feeForm.month,
      amount: Number(feeForm.amount),
      status: feeForm.status,
    })
    setFeeForm({ month: '', amount: '', status: 'مدفوع' })
  }

  return (
    <div className='page-shell'>
      <div className='detail-box wide'>
        <h2>{student.name}</h2>
        <div className='detail-grid'>
          <div><span>البريد الإلكتروني</span><strong>{student.email}</strong></div>
          <div><span>الكود</span><strong>{student.code}</strong></div>
          <div><span>المستوى</span><strong>{student.level}</strong></div>
          <div><span>التقدم</span><strong>{student.progress}%</strong></div>
        </div>
        <Link className='primary-button' to='/teacher/students'>العودة إلى الطلاب</Link>
      </div>

      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'><h3>درجة الاختبارات</h3></div>
          <form onSubmit={handleExamSubmit} className='form-stack'>
            <div className='form-group'>
              <label>اسم الاختبار</label>
              <input value={examForm.title} onChange={(event) => setExamForm({ ...examForm, title: event.target.value })} placeholder='مثال: اختبار القواعد' />
            </div>
            <div className='form-group'>
              <label>الدرجة</label>
              <input type='number' min='0' max='100' value={examForm.score} onChange={(event) => setExamForm({ ...examForm, score: event.target.value })} placeholder='90' />
            </div>
            <div className='form-group'>
              <label>التاريخ</label>
              <input type='date' value={examForm.date} onChange={(event) => setExamForm({ ...examForm, date: event.target.value })} />
            </div>
            <button type='submit' className='primary-button'>إضافة درجة</button>
          </form>
          <div className='list-table compact'>
            {file.examResults.map((item) => (
              <div key={item.id} className='table-row'>
                <div><strong>{item.title}</strong></div>
                <div>{item.score}/100</div>
                <div>{item.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='panel'>
          <div className='panel-header'><h3>الحضور والغياب</h3></div>
          <form onSubmit={handleAttendanceSubmit} className='form-stack'>
            <div className='form-group'>
              <label>التاريخ</label>
              <input type='date' value={attendanceForm.date} onChange={(event) => setAttendanceForm({ ...attendanceForm, date: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>الحالة</label>
              <select value={attendanceForm.status} onChange={(event) => setAttendanceForm({ ...attendanceForm, status: event.target.value })}>
                <option>حاضر</option>
                <option>غائب</option>
                <option>متأخر</option>
                <option>إجازة</option>
              </select>
            </div>
            <button type='submit' className='primary-button'>إضافة حضور</button>
          </form>
          <div className='list-table compact'>
            {file.attendance.map((item) => (
              <div key={item.id} className='table-row'>
                <div>{item.date}</div>
                <div><span className={`chip ${item.status === 'حاضر' ? 'success' : item.status === 'غائب' ? 'warn' : 'soft'}`}>{item.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='panel'>
        <div className='panel-header'><h3>المصاريف الشهرية</h3></div>
        <form onSubmit={handleFeeSubmit} className='form-stack inline-form'>
          <div className='form-group'>
            <label>الشهر</label>
            <input value={feeForm.month} onChange={(event) => setFeeForm({ ...feeForm, month: event.target.value })} placeholder='أغسطس' />
          </div>
          <div className='form-group'>
            <label>المبلغ</label>
            <input type='number' value={feeForm.amount} onChange={(event) => setFeeForm({ ...feeForm, amount: event.target.value })} placeholder='250' />
          </div>
          <div className='form-group'>
            <label>الحالة</label>
            <select value={feeForm.status} onChange={(event) => setFeeForm({ ...feeForm, status: event.target.value })}>
              <option>مدفوع</option>
              <option>قيد الدفع</option>
              <option>متأخر</option>
            </select>
          </div>
          <button type='submit' className='primary-button'>إضافة مصروف</button>
        </form>
        <div className='list-table compact'>
          {file.monthlyFees.map((item) => (
            <div key={item.id} className='table-row'>
              <div><strong>{item.month}</strong></div>
              <div>{item.amount} ر.س</div>
              <div><span className={`chip ${item.status === 'مدفوع' ? 'success' : item.status === 'متأخر' ? 'warn' : 'soft'}`}>{item.status}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeacherAttendancePage({ platform, addStudentRecord, logout }) {
  const teacherSidebar = getTeacherSidebar()
  const [form, setForm] = useState({ studentId: '', date: '', status: 'حاضر' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.studentId || !form.date) return
    addStudentRecord(form.studentId, 'attendance', {
      id: `attendance-${Date.now()}`,
      date: form.date,
      status: form.status,
    })
    setForm({ studentId: '', date: '', status: 'حاضر' })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='الحضور والغياب' logout={logout}>
      <div className='panel'>
        <div className='panel-header'>
          <h3>تسجيل حضور اليوم</h3>
        </div>
        <form onSubmit={handleSubmit} className='form-stack inline-form'>
          <div className='form-group'>
            <label>اسم الطالب</label>
            <select value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })}>
              <option value=''>اختر طالب</option>
              {platform.students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>التاريخ</label>
            <input type='date' value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          </div>
          <div className='form-group'>
            <label>الحالة</label>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>حاضر</option>
              <option>غائب</option>
              <option>متأخر</option>
              <option>إجازة</option>
            </select>
          </div>
          <button type='submit' className='primary-button'>حفظ الحضور</button>
        </form>
      </div>

      <div className='panel'>
        <div className='panel-header'><h3>ملخص الحضور</h3></div>
        <div className='list-table'>
          {platform.students.map((student) => {
            const records = student.personalFile?.attendance || []
            const presentCount = records.filter((item) => item.status === 'حاضر').length
            const absentCount = records.filter((item) => item.status === 'غائب').length
            return (
              <div key={student.id} className='table-row'>
                <div><strong>{student.name}</strong></div>
                <div>{presentCount} حاضر</div>
                <div>{absentCount} غائب</div>
                <div>{records.length} إجمالي</div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}

function TeacherFeesPage({ platform, addStudentRecord, logout }) {
  const teacherSidebar = getTeacherSidebar()
  const [form, setForm] = useState({ studentId: '', month: '', amount: '', status: 'مدفوع' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.studentId || !form.month || !form.amount) return
    addStudentRecord(form.studentId, 'monthlyFees', {
      id: `fee-${Date.now()}`,
      month: form.month,
      amount: Number(form.amount),
      status: form.status,
    })
    setForm({ studentId: '', month: '', amount: '', status: 'مدفوع' })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='المصاريف الشهرية' logout={logout}>
      <div className='panel'>
        <div className='panel-header'>
          <h3>تسجيل مصروفات الطالب</h3>
        </div>
        <form onSubmit={handleSubmit} className='form-stack inline-form'>
          <div className='form-group'>
            <label>اسم الطالب</label>
            <select value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })}>
              <option value=''>اختر طالب</option>
              {platform.students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>الشهر</label>
            <input value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} placeholder='أغسطس' />
          </div>
          <div className='form-group'>
            <label>المبلغ</label>
            <input type='number' value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder='250' />
          </div>
          <div className='form-group'>
            <label>الحالة</label>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>مدفوع</option>
              <option>قيد الدفع</option>
              <option>متأخر</option>
            </select>
          </div>
          <button type='submit' className='primary-button'>حفظ المصروف</button>
        </form>
      </div>

      <div className='panel'>
        <div className='panel-header'><h3>مؤشرات المصاريف</h3></div>
        <div className='list-table'>
          {platform.students.map((student) => {
            const fees = student.personalFile?.monthlyFees || []
            const total = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
            const paid = fees.filter((fee) => fee.status === 'مدفوع').length
            return (
              <div key={student.id} className='table-row'>
                <div><strong>{student.name}</strong></div>
                <div>{total} ر.س</div>
                <div>{paid} مدفوع</div>
                <div>{fees.length} سجل</div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}

function TeacherReportsPage({ platform, logout }) {
  const teacherSidebar = getTeacherSidebar()
  const totalStudents = platform.students.length
  const presentEntries = platform.students.reduce((total, student) => total + (student.personalFile?.attendance || []).filter((item) => item.status === 'حاضر').length, 0)
  const paidEntries = platform.students.reduce((total, student) => total + (student.personalFile?.monthlyFees || []).filter((item) => item.status === 'مدفوع').length, 0)
  const unpaidEntries = platform.students.reduce((total, student) => total + (student.personalFile?.monthlyFees || []).filter((item) => item.status !== 'مدفوع').length, 0)
  const courseRevenue = platform.students.reduce((sum, student) => {
    const payments = student.personalFile?.coursePayments || []
    return sum + payments.filter((payment) => payment.status === 'paid').reduce((total, payment) => total + Number(payment.amount || 0), 0)
  }, 0)

  const summaryCards = [
    { label: 'إجمالي الطلاب', value: totalStudents },
    { label: 'الحضور', value: `${presentEntries} يوم` },
    { label: 'المدفوع', value: paidEntries },
    { label: 'غير المدفوع', value: unpaidEntries },
    { label: 'إيراد الكورسات', value: formatCurrency(courseRevenue) },
  ]

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='التقارير الشهرية' logout={logout}>
      <div className='stats-grid'>
        {summaryCards.map((card) => (
          <div key={card.label} className='stat-card'>
            <div className='stat-icon'><BarChart3 size={18} /></div>
            <div>
              <h4>{card.value}</h4>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='panel'>
        <div className='panel-header'><h3>قائمة الطلاب</h3></div>
        <div className='list-table'>
          {platform.students.map((student) => {
            const attendance = student.personalFile?.attendance || []
            const fees = student.personalFile?.monthlyFees || []
            const attendanceRate = attendance.length ? Math.round((attendance.filter((item) => item.status === 'حاضر').length / attendance.length) * 100) : 0
            const feeState = fees.some((fee) => fee.status === 'قيد الدفع' || fee.status === 'متأخر') ? 'ينبه' : 'ممتاز'
            return (
              <div key={student.id} className='table-row'>
                <div><strong>{student.name}</strong></div>
                <div>{attendanceRate}% حضور</div>
                <div>{fees.length} مصروف</div>
                <div><span className={`chip ${feeState === 'ممتاز' ? 'success' : 'warn'}`}>{feeState}</span></div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}

function TeacherSubscriptionsPage({ platform, updateCoursePaymentStatus, logout }) {
  const teacherSidebar = getTeacherSidebar()
  const payments = platform.students.flatMap((student) => {
    const records = student.personalFile?.coursePayments || []
    return records.map((payment) => ({
      studentId: student.id,
      studentName: student.name,
      courseId: payment.courseId,
      courseTitle: payment.courseTitle,
      amount: Number(payment.amount || 0),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      purchasedAt: payment.purchasedAt,
    }))
  })

  const totalRevenue = payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)
  const paidCount = payments.filter((item) => item.status === 'paid').length
  const pendingCount = payments.filter((item) => item.status !== 'paid').length

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='إدارة الاشتراكات' logout={logout}>
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-icon'><CreditCard size={18} /></div>
          <div>
            <h4>{formatCurrency(totalRevenue)}</h4>
            <p>إجمالي الإيرادات</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'><CheckCircle2 size={18} /></div>
          <div>
            <h4>{paidCount}</h4>
            <p>اشتراكات مدفوعة</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'><BriefcaseBusiness size={18} /></div>
          <div>
            <h4>{pendingCount}</h4>
            <p>في الانتظار</p>
          </div>
        </div>
      </div>

      <div className='panel'>
        <div className='panel-header'><h3>سجل اشتراكات الطلاب</h3></div>
        <div className='list-table'>
          {payments.length === 0 ? (
            <div className='table-row'><div>لا توجد اشتراكات حتى الآن</div></div>
          ) : (
            payments.map((item, index) => (
              <div key={`${item.studentName}-${item.courseTitle}-${index}`} className='table-row'>
                <div><strong>{item.studentName}</strong></div>
                <div>{item.courseTitle}</div>
                <div>{formatCurrency(item.amount)}</div>
                <div>{item.paymentMethod}</div>
                <div>
                  <select value={item.status} onChange={(event) => updateCoursePaymentStatus(item.studentId, item.courseId, event.target.value)}>
                    <option value='paid'>مدفوع</option>
                    <option value='pending'>قيد الدفع</option>
                  </select>
                </div>
                <div>{new Date(item.purchasedAt).toLocaleDateString('en-CA')}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}

function StudentCodesPage({ platform, generateStudentCode, assignCodeToStudent, toggleCodeStatus, deleteCode, logout }) {
  const teacherSidebar = getTeacherSidebar()

  const [form, setForm] = useState({ name: '', studentId: '' })

  const handleGenerate = () => {
    const name = form.studentId
      ? platform.students.find((student) => student.id === form.studentId)?.name || 'غير مسند'
      : form.name || 'غير مسند'
    const created = generateStudentCode(name)
    if (form.studentId) {
      assignCodeToStudent(created.id, form.studentId)
    }
    setForm({ name: '', studentId: '' })
  }

  const handleCopy = async (code) => {
    await navigator.clipboard.writeText(code)
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='أكواد الطلاب' logout={logout}>
      <div className='panel'>
        <div className='panel-header'>
          <h3>توليد كود طالب جديد</h3>
        </div>
        <div className='form-stack inline-form'>
          <div className='form-group'>
            <label>اسم الطالب</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder='اسم الطالب' />
          </div>
          <div className='form-group'>
            <label>اختيار طالب موجود</label>
            <select value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })}>
              <option value=''>- لا يوجد -</option>
              {platform.students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
          <button className='primary-button' onClick={handleGenerate}>+ إنشاء كود جديد</button>
        </div>
      </div>

      <div className='list-table'>
        {platform.codes.map((code) => (
          <div key={code.id} className='table-row'>
            <div><strong>{code.code}</strong></div>
            <div>{code.studentName || 'غير مسند'}</div>
            <div><span className={`chip ${code.status === 'active' ? 'success' : 'warn'}`}>{code.status === 'active' ? 'نشط' : 'معطل'}</span></div>
            <div>{code.createdAt}</div>
            <div className='row-actions'>
              <button className='mini-button' onClick={() => handleCopy(code.code)}>نسخ</button>
              <select defaultValue='' onChange={(event) => event.target.value && assignCodeToStudent(code.id, event.target.value)}>
                <option value=''>ربط بكود طالب</option>
                {platform.students.map((student) => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
              <button className='mini-button' onClick={() => toggleCodeStatus(code.id)}>{code.status === 'active' ? 'تعطيل' : 'تفعيل'}</button>
              <button className='mini-button danger' onClick={() => deleteCode(code.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}

function CourseManagementPage({ platform, addCourse, deleteCourse, logout }) {
  const [form, setForm] = useState({ title: '', description: '', level: 'Beginner', lessons: 8, category: 'general', price: 0 })
  const teacherSidebar = getTeacherSidebar()

  const handleSubmit = (event) => {
    event.preventDefault()
    addCourse(form)
    setForm({ title: '', description: '', level: 'Beginner', lessons: 8, category: 'general', price: 0 })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='Course Management' logout={logout}>
      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>Add Course</h3>
          </div>
          <form onSubmit={handleSubmit} className='form-stack'>
            <div className='form-group'>
              <label>Course Title</label>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Level</label>
              <select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Lessons</label>
              <input type='number' value={form.lessons} onChange={(event) => setForm({ ...form, lessons: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Price (SAR)</label>
              <input type='number' min='0' value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </div>
            <button type='submit' className='primary-button'>Add Course</button>
          </form>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>Course List</h3>
          </div>
          <div className='list-table'>
            {platform.courses.map((course) => (
              <div key={course.id} className='table-row'>
                <div><strong>{course.title}</strong></div>
                <div>{course.level}</div>
                <div>{course.lessons} lessons</div>
                <div>{Number(course.price || 0) > 0 ? `${formatCurrency(course.price)} ` : 'Free'}</div>
                <div className='row-actions'>
                  <button className='mini-button'>Edit</button>
                  <button className='mini-button danger' onClick={() => deleteCourse(course.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function LessonManagementPage({ platform, addLesson, deleteLesson, logout }) {
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'Beginner', duration: 20, category: 'Grammar', type: 'Lesson', link: '' })
  const teacherSidebar = getTeacherSidebar()

  const handleSubmit = (event) => {
    event.preventDefault()
    addLesson(form)
    setForm({ title: '', description: '', difficulty: 'Beginner', duration: 20, category: 'Grammar', type: 'Lesson', link: '' })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='Lesson Management' logout={logout}>
      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>Add Lesson</h3>
          </div>
          <form onSubmit={handleSubmit} className='form-stack'>
            <div className='form-group'>
              <label>Lesson Title</label>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Type</label>
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option>Lesson</option>
                <option>Video</option>
                <option>Link</option>
                <option>Quiz</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Video / Link URL</label>
              <input
                value={form.link}
                onChange={(event) => setForm({ ...form, link: event.target.value })}
                placeholder='https://youtube.com/... or https://example.com/...'
              />
            </div>
            <div className='form-group'>
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Upper-Intermediate</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Category</label>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                <option>Grammar</option>
                <option>Vocabulary</option>
                <option>Listening</option>
                <option>Speaking</option>
                <option>Writing</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Duration</label>
              <input type='number' value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
            </div>
            <button type='submit' className='primary-button'>Add Lesson</button>
          </form>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>Lesson List</h3>
          </div>
          <div className='list-table'>
            {platform.lessons.map((lesson) => (
              <div key={lesson.id} className='table-row'>
                <div><strong>{lesson.title}</strong></div>
                <div>{lesson.category}</div>
                <div>{lesson.type}</div>
                <div>{lesson.duration}</div>
                <div className='row-actions'>
                  {lesson.link ? <a className='mini-button' href={lesson.link} target='_blank' rel='noreferrer'>Open</a> : <button className='mini-button'>Publish</button>}
                  <button className='mini-button danger' onClick={() => deleteLesson(lesson.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function TeacherQuizPage({ platform, addQuiz, logout }) {
  const [form, setForm] = useState({ title: '', subject: 'Grammar', description: '', duration: 15, link: '' })
  const teacherSidebar = getTeacherSidebar()

  const handleSubmit = (event) => {
    event.preventDefault()
    addQuiz(form)
    setForm({ title: '', subject: 'Grammar', description: '', duration: 15, link: '' })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='Quiz Management' logout={logout}>
      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>Add Quiz</h3>
          </div>
          <form onSubmit={handleSubmit} className='form-stack'>
            <div className='form-group'>
              <label>Quiz Title</label>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Subject</label>
              <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}>
                <option>Grammar</option>
                <option>Vocabulary</option>
                <option>Listening</option>
                <option>Speaking</option>
                <option>Writing</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Duration (minutes)</label>
              <input type='number' value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Quiz Link / Resource</label>
              <input value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} placeholder='https://example.com/quiz' />
            </div>
            <button type='submit' className='primary-button'>Add Quiz</button>
          </form>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>Quiz List</h3>
          </div>
          <div className='list-table'>
            {platform.quizzes.map((quiz) => (
              <div key={quiz.id} className='table-row'>
                <div><strong>{quiz.title}</strong></div>
                <div>{quiz.subject}</div>
                <div>{quiz.duration || '15 min'}</div>
                <div className='row-actions'>
                  {quiz.link ? <a className='mini-button' href={quiz.link} target='_blank' rel='noreferrer'>Open</a> : <button className='mini-button'>Ready</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function AssignmentManagementPage({ platform, addAssignment, deleteAssignment, logout }) {
  const [form, setForm] = useState({ title: '', subject: 'Grammar', description: '', dueDate: '2026-09-10' })
  const teacherSidebar = getTeacherSidebar()

  const handleSubmit = (event) => {
    event.preventDefault()
    addAssignment(form)
    setForm({ title: '', subject: 'Grammar', description: '', dueDate: '2026-09-10' })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='Assignment Management' logout={logout}>
      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>Create Assignment</h3>
          </div>
          <form onSubmit={handleSubmit} className='form-stack'>
            <div className='form-group'>
              <label>Title</label>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Subject</label>
              <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}>
                <option>Grammar</option>
                <option>Vocabulary</option>
                <option>Listening</option>
                <option>Speaking</option>
                <option>Writing</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Due Date</label>
              <input type='date' value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
            </div>
            <button type='submit' className='primary-button'>Create Assignment</button>
          </form>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>Assignments</h3>
          </div>
          <div className='list-table'>
            {platform.assignments.map((assignment) => (
              <div key={assignment.id} className='table-row'>
                <div><strong>{assignment.title}</strong></div>
                <div>{assignment.subject}</div>
                <div>{assignment.dueDate}</div>
                <div className='row-actions'>
                  <button className='mini-button'>Grade</button>
                  <button className='mini-button danger' onClick={() => deleteAssignment(assignment.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function TeacherProgressPage({ platform, logout }) {
  const teacherSidebar = getTeacherSidebar()

  const skills = [
    { label: 'Grammar', value: 82 },
    { label: 'Vocabulary', value: 74 },
    { label: 'Listening', value: 68 },
    { label: 'Speaking', value: 76 },
    { label: 'Writing', value: 80 },
  ]

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='Student Progress' logout={logout}>
      <div className='panel'>
        <div className='panel-header'>
          <h3>Student Overview</h3>
        </div>
        <div className='skill-list'>
          {skills.map((skill) => (
            <div key={skill.label} className='skill-row'>
              <div className='skill-label'>{skill.label}</div>
              <div className='progress-bar'><span style={{ width: `${skill.value}%` }} /></div>
              <div className='skill-value'>{skill.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function ResourcesManagementPage({ platform, addResource, deleteResource, logout }) {
  const [form, setForm] = useState({ title: '', description: '', fileType: 'PDF', category: 'Grammar', link: '' })
  const teacherSidebar = getTeacherSidebar()

  const handleSubmit = (event) => {
    event.preventDefault()
    addResource(form)
    setForm({ title: '', description: '', fileType: 'PDF', category: 'Grammar', link: '' })
  }

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='Resources Management' logout={logout}>
      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>Add Resource</h3>
          </div>
          <form onSubmit={handleSubmit} className='form-stack'>
            <div className='form-group'>
              <label>Title</label>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className='form-group'>
              <label>File Type</label>
              <select value={form.fileType} onChange={(event) => setForm({ ...form, fileType: event.target.value })}>
                <option>PDF</option>
                <option>DOCX</option>
                <option>MP3</option>
                <option>Video</option>
                <option>Link</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Video / Link URL</label>
              <input
                value={form.link}
                onChange={(event) => setForm({ ...form, link: event.target.value })}
                placeholder='https://youtube.com/...'
              />
            </div>
            <div className='form-group'>
              <label>Category</label>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                <option>Grammar</option>
                <option>Vocabulary</option>
                <option>Listening</option>
                <option>Speaking</option>
                <option>Writing</option>
              </select>
            </div>
            <button type='submit' className='primary-button'>Add Resource</button>
          </form>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>Resource Library</h3>
          </div>
          <div className='list-table'>
            {platform.resources.map((resource) => (
              <div key={resource.id} className='table-row'>
                <div><strong>{resource.title}</strong></div>
                <div>{resource.fileType}</div>
                <div>{resource.category}</div>
                <div className='row-actions'>
                  {resource.link ? <a className='mini-button' href={resource.link} target='_blank' rel='noreferrer'>Open</a> : <button className='mini-button'>View</button>}
                  <button className='mini-button danger' onClick={() => deleteResource(resource.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function TeacherSettingsPage({ logout }) {
  const teacherSidebar = getTeacherSidebar()

  return (
    <AppShell sidebar={teacherSidebar} topbarTitle='Settings' logout={logout}>
      <div className='two-panel-wrap'>
        <div className='panel'>
          <div className='panel-header'>
            <h3>Account Details</h3>
          </div>
          <div className='form-stack'>
            <div className='form-group'>
              <label>Name</label>
              <input value='Mr Abdelrahman Mohamed' readOnly />
            </div>
            <div className='form-group'>
              <label>Email</label>
              <input value='mr@englishplatform.com' readOnly />
            </div>
            <div className='form-group'>
              <label>Current Password</label>
              <input type='password' value='********' readOnly />
            </div>
          </div>
        </div>

        <div className='panel'>
          <div className='panel-header'>
            <h3>Platform Settings</h3>
          </div>
          <div className='form-stack'>
            <div className='toggle-row'>
              <span>New student notifications</span>
              <button className='secondary-button'>Enabled</button>
            </div>
            <div className='toggle-row'>
              <span>Weekly reports</span>
              <button className='secondary-button'>Enabled</button>
            </div>
            <div className='toggle-row'>
              <span>Auto-save progress</span>
              <button className='secondary-button'>Enabled</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default App
