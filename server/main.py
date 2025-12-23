from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from typing import List, Optional

app = FastAPI()

# הגדרת CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- מודל הנתונים ---
class RideSchema(BaseModel):
    driver_name: str
    destination: str
    departure_minutes: int
    departure_time: str

# --- מסד נתונים בזיכרון (מתנקה כשהשרת נסגר) ---
rides_db = []
id_counter = 1

# --- נתיבים (Routes) ---

@app.get("/api/rides")
def get_rides():
    global rides_db
    
    # 1. קבלת הזמן הנוכחי ב-UTC (כי הריאקט שולח זמן ב-UTC)
    now_utc = datetime.now(timezone.utc)
    
    # 2. סינון הרשימה: השאר רק נסיעות שעדיין רלוונטיות
    # הלוגיקה: זמן עכשיו < זמן יציאה + 10 דקות
    valid_rides = []
    
    for ride in rides_db:
        try:
            # המרת מחרוזת הזמן חזרה לאובייקט זמן של פייתון
            # ה-replace נדרש כי פייתון לפעמים מתקשה עם ה-Z בסוף המחרוזת
            ride_time = datetime.fromisoformat(ride["departure_time"].replace("Z", "+00:00"))
            
            # בדיקה האם הנסיעה עדיין בתוקף (עד 10 דקות אחרי היציאה)
            if now_utc < ride_time + timedelta(minutes=10):
                valid_rides.append(ride)
            else:
                # אופציונלי: הדפסה ללוג שהנסיעה נמחקה
                print(f"Ride expired and deleted: {ride['driver_name']} to {ride['destination']}")
                
        except Exception as e:
            print(f"Date parsing error: {e}")
            # במקרה של שגיאה נשמור את הנסיעה ליתר ביטחון
            valid_rides.append(ride)

    # 3. עדכון הזיכרון של השרת - הנסיעות הישנות נמחקות לצמיתות ברגע זה
    rides_db = valid_rides
    
    # 4. החזרת הרשימה הנקייה והממוינת
    return sorted(rides_db, key=lambda x: x['departure_time'])

@app.post("/api/rides")
def create_ride(ride: RideSchema):
    global id_counter
    
    new_ride = ride.dict()
    new_ride['id'] = id_counter
    # שמירת תאריך יצירה (לצרכי מיון אם צריך)
    new_ride['created_date'] = datetime.now(timezone.utc).isoformat()
    
    id_counter += 1
    rides_db.append(new_ride)
    
    print(f"New ride created: {new_ride['driver_name']}")
    return new_ride

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
