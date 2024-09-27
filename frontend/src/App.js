
import './App.css';
import Signup from './components/Auth/Signup';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './components/Auth/Login';
import Dashboard from './scenes/Dashboard';
import AddCourse from './scenes/courses/AddCourse';
import AddQuiz from './scenes/quizes/AddQuiz';
import AllCourses from './scenes/courses/AllCourses';
import AllQuestions from './scenes/quizes/AllQuestions';
import EnrolledCourses from './scenes/courses/EnrolledCourses';
import TakeTest from './scenes/quizes/TakeTest';
import TestResult from './scenes/quizes/TestResult';
import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';


function App() {
  const location = useLocation();
  const isLoginOrSignup = ['/signup', '/login'].includes(location.pathname);
 
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/add-course' element={<AddCourse />} />
        <Route path='/add-quiz' element={<AddQuiz />} />
        <Route path='/all-courses' element={<AllCourses />} />
        <Route path='/all-questions' element={<AllQuestions />} />
        <Route path='/enrolled-courses' element={<EnrolledCourses />} />
        <Route path='/take-test' element={<TakeTest />} />
        <Route path='/view-result' element={<TestResult />} />
        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
      {!isLoginOrSignup && <Footer />}
    </div>
  );
}

export default App;
