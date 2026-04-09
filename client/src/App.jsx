import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SmartCampus from './pages/SmartCampus';
import Academics from './pages/Academics';
import People from './pages/People';
import LearningLMS from './pages/LearningLMS';
import MentalHealth from './pages/MentalHealth';
import PredictiveLearning from './pages/PredictiveLearning';
import Attendance from './pages/Attendance';
import ExamsResults from './pages/ExamsResults';
import FeesFinance from './pages/FeesFinance';
import Communication from './pages/Communication';
import Requests from './pages/Requests';
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import OnlineTests from './pages/OnlineTests';

import './index.css';

import AnimatedShaderBackground from './components/ui/animated-shader-background';

import TransportationHub from './pages/TransportationHub';

function App() {
  return (
    <Router>
      <AnimatedShaderBackground />
      <AnimatedRoutes />
    </Router>
  );
}

const AnimatedRoutes = () => {  
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/smart-campus" element={<SmartCampus />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/people" element={<People />} />
          <Route path="/learning-lms" element={<LearningLMS />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/predictive-learning" element={<PredictiveLearning />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/exams-results" element={<ExamsResults />} />
          <Route path="/fees-finance" element={<FeesFinance />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/online-tests" element={<OnlineTests />} />
          <Route path="/transportation-intelligence" element={<TransportationHub />} />
        </Route>
      </Routes>
  );
};

export default App;
