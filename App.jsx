import React, { useState, useEffect } from 'react';
import PublicDisplay from './Pages/PublicDisplay';
import SendRide from './Pages/SendRide';
import LoginPage from './Pages/LoginPage';
import OnboardingPage from './Pages/OnboardingPage';
import { ArrowRight, Monitor, LogOut, Trash2 } from 'lucide-react';

export default function App() {
  // --- לוגיקת האתחול החכמה ---
  // במקום סתם להתחיל ב-'login', אנחנו בודקים את הזיכרון של הדפדפן
  const [appState, setAppState] = useState(() => {
    const isLoggedIn = localStorage.getItem('tremp_isLoggedIn');
    const isOnboardingDone = localStorage.getItem('tremp_onboardingDone');

    if (isLoggedIn && isOnboardingDone) return 'display'; // משתמש חוזר ורשום -> ישר לאפליקציה
    if (isLoggedIn && !isOnboardingDone) return 'onboarding'; // מחובר אבל לא מילא פרטים -> אונבורדינג
    return 'login'; // לא מחובר -> התחברות
  });

  // פונקציה שמופעלת כשמשתמש מתחבר בהצלחה
  const handleLoginSuccess = () => {
    localStorage.setItem('tremp_isLoggedIn', 'true');
    
    // בדיקה האם המשתמש הזה כבר מילא פרטים בעבר
    const isOnboardingDone = localStorage.getItem('tremp_onboardingDone');
    if (isOnboardingDone) {
      setAppState('display');
    } else {
      setAppState('onboarding');
    }
  };

  // פונקציה שמופעלת כשהמשתמש מסיים למלא פרטים
  const handleOnboardingComplete = () => {
    localStorage.setItem('tremp_onboardingDone', 'true'); // מסמנים וי בזיכרון
    setAppState('display');
  };

  const handleLogout = () => {
    localStorage.removeItem('tremp_isLoggedIn');
    // לא מוחקים את ה-onboardingDone כדי שאם הוא יתחבר שוב הוא לא יצטרך למלא שוב פרטים
    setAppState('login');
  };

  // --- כפתור למפתחים בלבד: איפוס מלא ---
  const handleHardReset = () => {
    localStorage.clear(); // מוחק הכל
    window.location.reload(); // מרענן את הדף
  };

  // --- תצוגת המסכים ---

  if (appState === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (appState === 'onboarding') {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  // --- האפליקציה הרגילה ---
  return (
    <div className="relative w-full h-full">
      
      {/* כפתורי שליטה (זמניים לפיתוח) */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button 
          onClick={handleLogout}
          className="p-2 bg-slate-800/50 text-slate-300 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-slate-700"
          title="התנתק (משאיר נתונים)"
        >
          <LogOut className="w-4 h-4" />
        </button>
        
        <button 
          onClick={handleHardReset}
          className="p-2 bg-red-900/50 text-red-300 rounded-full hover:bg-red-600 hover:text-white transition-colors border border-red-800"
          title="איפוס מלא (כמו משתמש חדש)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* כפתור הניווט הקיים */}
      <button 
        onClick={() => setAppState(appState === 'display' ? 'send' : 'display')}
        style={{ 
          top: '25px', 
          right: '15px', 
          width: '40px', 
          height: '40px' 
        }} 
        className="fixed z-50 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/50 hover:bg-white/20 hover:text-white transition-all shadow-xl group"
      >
        {appState === 'display' ? (
          <ArrowRight style={{ width: '18px', height: '18px' }} className="transform group-hover:-translate-x-1 transition-transform" />
        ) : (
          <Monitor style={{ width: '18px', height: '18px' }} />
        )}
      </button>

      {appState === 'display' ? <PublicDisplay /> : <SendRide />}
    </div>
  );
}