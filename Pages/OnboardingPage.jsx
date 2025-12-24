import { base44 } from "../Api/Client"; // שים לב לנתיב המדויק שלך (Api / services)
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { User, MapPin, Calendar, CheckCircle } from 'lucide-react';

export default function OnboardingPage({ onComplete }) {
  // ניהול המידע בטופס
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    age: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        console.log("שולח נתונים לשרת...", formData);
        
        // שליחה לשרת הפייתון
        await base44.entities.User.create(formData);
        
        console.log("המשתמש נשמר בהצלחה!");
        onComplete(); // רק אם השמירה הצליחה, עוברים הלאה

    } catch (error) {
        console.error("שגיאה בשמירת המשתמש:", error);
        alert("הייתה בעיה בשמירת הפרטים. נסה שוב.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-center text-teal-400">ברוכים הבאים! 👋</CardTitle>
          <p className="text-center text-slate-400 text-sm">בוא נכיר אותך קצת כדי שהנסיעות יהיו בטוחות יותר</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 mr-1">שם פרטי</label>
                <div className="relative">
                  <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    className="w-full p-2 pr-9 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:ring-1 focus:ring-teal-500"
                    placeholder="ישראל"
                    required
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 mr-1">שם משפחה</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:ring-1 focus:ring-teal-500"
                  placeholder="ישראלי"
                  required
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 mr-1">כתובת מגורים</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  className="w-full p-2 pr-9 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:ring-1 focus:ring-teal-500"
                  placeholder="רחוב, עיר"
                  required
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 mr-1">גיל</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                <input 
                  type="number" 
                  min="16"
                  max="120"
                  className="w-full p-2 pr-9 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:ring-1 focus:ring-teal-500"
                  placeholder="18"
                  required
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white p-2 rounded-md font-bold transition-all shadow-lg flex justify-center items-center gap-2"
            >
              סיימתי, בוא נתחיל!
              <CheckCircle className="w-5 h-5" />
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}