import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"; // וודא שהנתיב תואם למה שיש אצלך
import { Mail, Lock, LogIn } from 'lucide-react';
import { base44 } from "../Api/Client"; // וודא שהנתיב נכון

export default function LoginPage({ onLoginSuccess, onRegisterClick }) {
  
  const handleLogin = (e) => {
    e.preventDefault();
    // כאן בעתיד נבדוק את הפרטים מול השרת
    // כרגע נדמה שההתחברות הצליחה ונעביר לדף מילוי הפרטים
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">התחברות לטרמפיקציה</CardTitle>
          <CardDescription className="text-slate-400">
            הזן את פרטיך כדי להתחיל לתפוס טרמפים
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* כפתורי התחברות חברתית */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white text-black hover:bg-slate-200 transition-colors font-medium text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              גוגל
            </button>
            <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#1864D9] transition-colors font-medium text-sm">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 bg-white rounded-full" alt="Facebook" />
              פייסבוק
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">או דרך אימייל</span>
            </div>
          </div>

          {/* טופס התחברות רגיל */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="כתובת אימייל"
                  className="w-full p-2 pr-10 rounded-md bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="סיסמה"
                  className="w-full p-2 pr-10 rounded-md bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              התחבר
            </button>
          </form>

          <div className="text-center text-sm text-slate-400 mt-4">
            אין לך חשבון?{' '}
            <span 
              onClick={onRegisterClick}
              className="text-teal-400 cursor-pointer hover:underline font-bold"
            >
              הירשם עכשיו
            </span>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}