import React, { useState } from 'react';
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

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

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
    // If admin, go to admin dashboard, else go home
    if (loggedInUser.isAdmin) {
      navigateTo(ViewState.ADMIN);
    } else {
      navigateTo(ViewState.HOME);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo(ViewState.HOME);
    localStorage.removeItem('user');
  };

  // Render view based on state
  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <>
            <Hero onNavigate={navigateTo} />
            <ServicesList onNavigate={navigateTo} onBookService={handleBookService} />
            <Testimonials />
            <Portfolio />
            <AboutSection />
            <ContactSection />
            <div className="bg-brand-primary/10 py-16 text-center">
              <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-4">Not sure what you need?</h2>
                <p className="text-gray-300 mb-6">Ask our AI Creative Consultant for ideas on your next project.</p>
                <button 
                  onClick={() => navigateTo(ViewState.AI_CONSULT)}
                  className="bg-brand-primary px-6 py-3 rounded-lg text-white font-bold hover:bg-blue-600 transition-colors"
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
        return user?.isAdmin ? <AdminDashboard /> : (
          <div className="min-h-screen flex items-center justify-center text-center p-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-gray-400 mb-6">You need administrator privileges to view this page.</p>
              <button 
                onClick={() => navigateTo(ViewState.LOGIN)}
                className="bg-brand-primary px-6 py-2 rounded-lg text-white"
              >
                Login as Admin
              </button>
            </div>
          </div>
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
      {/* Hide Navbar on Login screen or Admin Dashboard */}
      {currentView !== ViewState.ADMIN && currentView !== ViewState.LOGIN && (
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

      {currentView !== ViewState.ADMIN && currentView !== ViewState.LOGIN && (
        <Footer onNavigate={navigateTo} />
      )}
      
      {/* Back to Home button for Admin view */}
      {currentView === ViewState.ADMIN && (
        <button 
          onClick={() => navigateTo(ViewState.HOME)}
          className="fixed bottom-4 right-4 bg-white/10 text-white px-4 py-2 rounded-full backdrop-blur hover:bg-white/20 text-xs"
        >
          Exit Studio Mode
        </button>
      )}
    </div>
  );
}

export default App;