
import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesList } from './components/ServicesList';
import { Portfolio } from './components/Portfolio';
import { BookingFlow } from './components/BookingFlow';
import { AiConsultant } from './components/AiConsultant';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Testimonials } from './components/Testimonials';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AuthScreen } from './components/AuthScreen';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.WELCOME);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  // Check for persisted user session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // If user exists, skip welcome screen
      setCurrentView(ViewState.HOME);
    }
  }, []);

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    navigateTo(ViewState.BOOKING);
  };

  const handleBookingSuccess = () => {
    navigateTo(ViewState.HOME);
    setSelectedServiceId(undefined);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    
    if (loggedInUser.isAdmin) {
      navigateTo(ViewState.ADMIN);
    } else {
      navigateTo(ViewState.HOME);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigateTo(ViewState.WELCOME);
  };

  const isFullScreen = currentView === ViewState.ADMIN || currentView === ViewState.LOGIN || currentView === ViewState.WELCOME;

  const renderView = () => {
    switch (currentView) {
      case ViewState.WELCOME:
        return <WelcomeScreen onNavigate={navigateTo} />;
      
      case ViewState.HOME:
        return (
          <>
            <Hero onNavigate={navigateTo} />
            <ServicesList onNavigate={navigateTo} onBookService={handleBookService} />
            <Testimonials />
            <Portfolio />
            <AboutSection />
            <ContactSection />
            <div className="bg-brand-primary/10 py-16 text-center border-t border-white/5">
              <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-4">Need Creative Advice?</h2>
                <p className="text-gray-300 mb-6">Ask our AI Consultant for ideas on your next project.</p>
                <button 
                  onClick={() => navigateTo(ViewState.AI_CONSULT)}
                  className="bg-brand-primary px-6 py-3 rounded-lg text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Chat with AI Assistant
                </button>
              </div>
            </div>
          </>
        );

      case ViewState.SERVICES:
        return <ServicesList onNavigate={navigateTo} onBookService={handleBookService} />;
      
      case ViewState.PORTFOLIO:
        return <Portfolio />;
      
      case ViewState.BOOKING:
        return (
          <BookingFlow 
            preSelectedServiceId={selectedServiceId} 
            onSuccess={handleBookingSuccess}
            onCancel={() => navigateTo(ViewState.HOME)}
          />
        );
      
      case ViewState.AI_CONSULT:
        return <AiConsultant />;
      
      case ViewState.ADMIN:
        return (
          <AdminDashboard 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
        );
      
      case ViewState.CONTACT:
        return <ContactSection />;
      
      case ViewState.LOGIN:
        return <AuthScreen onLogin={handleLogin} onNavigate={navigateTo} />;
      
      default:
        return <Hero onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans text-gray-100">
      {!isFullScreen && (
        <Navbar 
          currentView={currentView} 
          onNavigate={navigateTo} 
          user={user}
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-grow">
        {renderView()}
      </main>

      {!isFullScreen && (
        <Footer onNavigate={navigateTo} />
      )}
      
      {/* Quick Exit for Admin */}
      {currentView === ViewState.ADMIN && user?.isAdmin && (
        <button 
          onClick={() => navigateTo(ViewState.HOME)}
          className="fixed bottom-4 right-4 bg-gray-800 text-gray-400 px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-700 hover:text-white text-xs z-50 transition-colors"
        >
          Exit Dashboard View
        </button>
      )}
      {/* Quick Exit for Admin Login Screen */}
      {currentView === ViewState.ADMIN && (!user || !user.isAdmin) && (
        <button 
          onClick={() => navigateTo(ViewState.HOME)}
          className="fixed top-4 left-4 bg-gray-800 text-gray-400 px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-700 hover:text-white text-xs z-50 transition-colors"
        >
          Back to Home
        </button>
      )}
    </div>
  );
}

export default App;
