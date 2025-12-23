import React, { useState, useEffect, useRef } from "react";
import { base44 } from "../api/Client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import PublicDisplayHeader from "../Components/publicdisplay/PublicDisplayHeader";
import RideCard from "../Components/publicdisplay/RideCard";
import NoRidesMessage from "../Components/publicdisplay/NoRidesMessage";
import CurrentTimeDisplay from "../Components/publicdisplay/CurrentTimeDisplay";

export default function PublicDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
    const containerRef = useRef(null);

    // עדכון השעה
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: rides = [] } = useQuery({
        queryKey: ['rides'],
        queryFn: async () => {
            const allRides = await base44.entities.Ride.list('-created_date');
            const now = new Date();
            return allRides.filter(ride => {
                const departureTime = new Date(ride.departure_time);
                return now < new Date(departureTime.getTime() + 10 * 60 * 1000);
            }).sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));
        },
        refetchInterval: 2000,
        initialData: []
    });

    // --- לוגיקת גלילה אוטומטית ---
    useEffect(() => {
        const container = containerRef.current;
        // תיקון: הוספנו תנאי שעוצר את הגלילה אם אין נסיעות (rides.length === 0)
        if (!container || !isAutoScrollEnabled || rides.length === 0) return;

        let scrollInterval;
        let resetTimeout;

        const startScrolling = () => {
            if (container.scrollHeight <= container.clientHeight) return;

            scrollInterval = setInterval(() => {
                if (container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
                    clearInterval(scrollInterval);
                    resetTimeout = setTimeout(() => {
                        container.scrollTo({ top: 0, behavior: 'smooth' });
                        setTimeout(startScrolling, 3000);
                    }, 3000);
                } else {
                    container.scrollTop += 1;
                }
            }, 50);
        };

        startScrolling();

        return () => {
            clearInterval(scrollInterval);
            clearTimeout(resetTimeout);
        };
    }, [rides, isAutoScrollEnabled]);

    const getTimeDisplay = (departureTime) => {
        const diffMinutes = Math.floor((new Date(departureTime) - currentTime) / 1000 / 60);
        if (diffMinutes <= 0) return `יצא לפני: ${Math.abs(diffMinutes)} דק'`;
        if (diffMinutes < 1) return "יוצא עכשיו";
        return `יוצא בעוד: ${diffMinutes} דקות`;
    };

    const getTimeColor = (departureTime) => {
        const diffMinutes = Math.floor((new Date(departureTime) - currentTime) / 1000 / 60);
        if (diffMinutes <= 0) return "from-red-500 to-rose-600";
        if (diffMinutes <= 5) return "from-amber-500 to-orange-600";
        return "from-teal-500 to-cyan-600";
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden relative">
            <div
                onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
                className="fixed top-6 left-6 z-50 flex items-center gap-4 px-5 py-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-xl cursor-pointer hover:bg-black/30 transition-all select-none group"
            >
                <span className="text-white/90 font-medium text-lg">גלילה אוטומטית</span>

                {/* המסילה של המתג */}
                <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${isAutoScrollEnabled ? 'bg-teal-500' : 'bg-slate-600 group-hover:bg-slate-500'
                    }`}>
                    {/* הכפתור עצמו (העיגול הלבן) */}
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isAutoScrollEnabled ? '-translate-x-6' : 'translate-x-0'
                        }`} />
                </div>
            </div>

            <div className="pt-8 px-8 flex-shrink-0">
                <PublicDisplayHeader />
            </div>

            <AnimatePresence mode="popLayout">
                {rides.length === 0 ? (
                    <NoRidesMessage />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 w-full">
                        {rides.map((ride) => (
                            <RideCard
                                key={ride.id}
                                ride={ride}
                                currentTime={currentTime}
                                getTimeDisplay={getTimeDisplay}
                                getTimeColor={getTimeColor}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <div className="flex-shrink-0">
                <CurrentTimeDisplay currentTime={currentTime} />
            </div>
        </div>
    );
}