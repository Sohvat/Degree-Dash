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


function AppContent() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/';

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