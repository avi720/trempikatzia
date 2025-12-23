import React, { useState } from 'react';
import PublicDisplay from './Pages/PublicDisplay';
import SendRide from './Pages/SendRide';
import { ArrowRight, Monitor } from 'lucide-react'; // אייקונים חדשים

export default function App() {
    const [currentPage, setCurrentPage] = useState('display'); // 'display' or 'send'

    return (
        <div className="relative w-full h-full">
            {/* כפתור ניווט צף בפינה */}
            <button
                onClick={() => setCurrentPage(currentPage === 'display' ? 'send' : 'display')}
                style={{ top: '25px', right: '15px' }}
                className="fixed top-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/50 hover:bg-white/20 hover:text-white transition-all shadow-xl group"
                title={currentPage === 'display' ? "מעבר לשליחת נסיעה" : "חזרה ללוח"}
            >
                {currentPage === 'display' ? (
                    // אם אנחנו בלוח -> הראה חץ ליציאה/חזרה למסך שליחה
                    <ArrowRight className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
                ) : (
                    // אם אנחנו במסך שליחה -> הראה מסך לחזרה ללוח
                    <Monitor className="w-6 h-6" />
                )}
            </button>

            {/* החלפת המסכים */}
            {currentPage === 'display' ? <PublicDisplay /> : <SendRide />}
        </div>
    );
}