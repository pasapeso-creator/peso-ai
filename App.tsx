import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ToastProvider, useToast } from './components/Toast';
import { authService, UserProfile } from './services/authService';
import { supabase } from './services/supabase';

// Pages
import Assignment from './pages/Assignment';
import Report from './pages/Report';
import PresentationPage from './pages/PresentationPage';
import Quiz from './pages/Quiz';
import Sheet from './pages/Sheet';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';
import Home from './pages/Home';
import ServicesSelector from './pages/ServicesSelector';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Footer from './components/Footer';

// Types
import { AppRoute } from './types';

// Protected Route Component
const ProtectedRoute = ({ children, isAdminOnly = false, user }: { children: React.ReactNode, isAdminOnly?: boolean, user: UserProfile | null }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (isAdminOnly && !user.is_admin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Check active session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await checkUser();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const profile = await authService.getCurrentProfile();
      setUserProfile(profile);
      if (profile) {
        const { data: reqs } = await supabase.from('subscription_requests').select('*').eq('user_id', profile.id);
        setRequests(reqs || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeductCredits = async () => {
    if (!userProfile) return false;
    
    if (userProfile.credits > 0) {
      try {
        await authService.deductCredits(userProfile.id, 1);
        setUserProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    } else {
      showToast("رصيدك خلص يا بطل! اشحن عشان تكمل", "error");
      navigate('/subscription');
      return false;
    }
  };

  const handleRequestSubscription = async (phone: string, plan: 'monthly' | 'quarterly') => {
    if (!userProfile) return;
    
    // Insert request to Supabase
    const { error } = await supabase.from('subscription_requests').insert({
      user_id: userProfile.id,
      phone_number: phone,
      plan_type: plan
    });

    if (error) {
      showToast("حصل مشكلة في إرسال الطلب", "error");
    } else {
      showToast("تم استلام طلبك وهنراجعه فوراً", "success", 4000, "/logo.png");
    }
  };

  // Map current path to AppRoute
  const getAppRouteFromPath = (path: string): AppRoute => {
    switch (path) {
      case '/': return AppRoute.HOME;
      case '/start': return AppRoute.HOME;
      case '/assignment': return AppRoute.ASSIGNMENT;
      case '/report': return AppRoute.REPORT;
      case '/presentation': return AppRoute.PRESENTATION;
      case '/quiz': return AppRoute.QUIZ;
      case '/sheet': return AppRoute.SHEET;
      case '/subscription': return AppRoute.SUBSCRIPTION;
      case '/settings': return AppRoute.SETTINGS;
      default: return AppRoute.HOME;
    }
  };

  const handleNavigate = (route: AppRoute) => {
    const pathMap: Record<AppRoute, string> = {
      [AppRoute.HOME]: '/',
      [AppRoute.ASSIGNMENT]: '/assignment',
      [AppRoute.REPORT]: '/report',
      [AppRoute.PRESENTATION]: '/presentation',
      [AppRoute.QUIZ]: '/quiz',
      [AppRoute.SHEET]: '/sheet',
      [AppRoute.SUBSCRIPTION]: '/subscription',
      [AppRoute.SETTINGS]: '/settings',
      [AppRoute.PROFILE]: '/profile',
    };
    navigate(pathMap[route]);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
  }

  // If no user and not on login page, redirect logic is handled by ProtectedRoute, 
  // but for root layout we want to show Sidebar only if logged in?
  // User requested: "Login with Google then ... Dashboard"
  // Let's hide Sidebar if not logged in
  
  if (!userProfile && location.pathname !== '/login') {
     return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {userProfile && location.pathname !== '/login' && (
        <Sidebar 
          currentRoute={getAppRouteFromPath(location.pathname)} 
          onNavigate={handleNavigate} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          credits={userProfile.credits}
          isSubscribed={userProfile.is_subscribed}
          userName={userProfile.full_name || 'User'}
        />
      )}
      
      <main className={`
        transition-all duration-300 ease-in-out
        ${userProfile && location.pathname !== '/login' ? 'md:mr-64 p-4 md:p-8 pt-20 md:pt-8' : 'w-full'}
      `}>
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute user={userProfile}><Home /></ProtectedRoute>} />
            <Route path="/start" element={<ProtectedRoute user={userProfile}><ServicesSelector isSubscribed={userProfile?.is_subscribed} /></ProtectedRoute>} />
            
            <Route path="/assignment" element={<ProtectedRoute user={userProfile}><Assignment onDeductCredits={handleDeductCredits} /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute user={userProfile}><Report onDeductCredits={handleDeductCredits} /></ProtectedRoute>} />
            <Route path="/presentation" element={<ProtectedRoute user={userProfile}><PresentationPage onDeductCredits={handleDeductCredits} /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute user={userProfile}><Quiz onDeductCredits={handleDeductCredits} /></ProtectedRoute>} />
            <Route path="/sheet" element={<ProtectedRoute user={userProfile}><Sheet onDeductCredits={handleDeductCredits} /></ProtectedRoute>} />
            
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute user={userProfile}>
                  <Subscription 
                    userCredits={{ 
                      available: userProfile?.credits || 0, 
                      isSubscribed: userProfile?.is_subscribed || false, 
                      pendingRequest: requests.some(r => r.status === 'pending') 
                    }} 
                    onRequestSub={handleRequestSubscription} 
                  />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/settings" element={<ProtectedRoute user={userProfile}><Settings /></ProtectedRoute>} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<ProtectedRoute user={userProfile} isAdminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute user={userProfile}><Profile /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {userProfile && <Footer />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
