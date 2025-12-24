// api/Client.js

// הפניה לשרת הפייתון המקומי שלך
const API_URL = "/api";

export const base44 = {
    entities: {
        Ride: {
            // יצירת נסיעה חדשה
            create: async (rideData) => {
                try {
                    const response = await fetch(`${API_URL}/rides`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(rideData),
                    });

                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }
                    return await response.json();
                } catch (error) {
                    console.error("Error creating ride:", error);
                    throw error;
                }
            },
            // --- הוספנו את החלק הזה: ניהול משתמשים ---
        User: {
            create: async (userData) => {
                // המרת הגיל למספר (כי מהטופס זה מגיע לפעמים כטקסט)
                const payload = {
                    ...userData,
                    age: parseInt(userData.age)
                };

                const response = await fetch(`${BASE_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to create user: ${errorText}`);
                }
                return response.json();
            }
        },
    
            // קבלת רשימת נסיעות
            list: async (sortOrder = '-created_date') => {
                try {
                    const response = await fetch(`${API_URL}/rides`);
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }
                    return await response.json();
                } catch (error) {
                    console.error("Error fetching rides:", error);
                    return []; // מחזיר רשימה ריקה במקרה של שגיאה כדי שהאתר לא יקרוס
                }
            }
        }
    }
};