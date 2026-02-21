import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Signup from './pages/Signup';
import CourseDetail from './pages/CourseDetail';
import Professor from './pages/ProfessorDetail';
import AllCourses from './pages/AllCourses';
import AllProfessors from './pages/AllProfessors';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';


function AppContent() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/privacy' || location.pathname === '/terms';

    return (
        <>
            {!hideNavbar && <Navbar/>}
            <Routes>
                <Route path="/" element={<Signup/>}/>
                <Route path="/home" element={

                    <Home/>

                }/>
                <Route path="/courses/:id" element={<CourseDetail/>}/>
                <Route path="/professors/:id" element={<Professor/>}/>
                <Route path="/courses" element={<AllCourses/>}/>
                <Route path="/professors" element={<AllProfessors/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/terms" element={<Terms/>}/>
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent/>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;