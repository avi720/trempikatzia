from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

app = FastAPI()

# הגדרת CORS - מאפשר לריאקט (שרץ בפורט אחר) לדבר עם פייתון
origins = [
    "http://localhost:5173", # הפורט הסטנדרטי של Vite/React
    "http://localhost:3000", # למקרה שאתה משתמש ב-Create React App
    "*" # או פשוט לאפשר לכולם בשלב הפיתוח
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- מודל הנתונים (מגדיר איזה מידע אנחנו מצפים לקבל) ---
class RideSchema(BaseModel):
    driver_name: str
    destination: str
    departure_minutes: int
    departure_time: str # הריאקט שולח את הזמן המחושב

# --- מסד נתונים בזיכרון ---
rides_db = []
id_counter = 1

# --- נתיבים (Routes) ---

# GET - קבלת כל הנסיעות
@app.get("/api/rides")
def get_rides():
    # מיון הרשימה כך שהחדש ביותר יהיה ראשון (כמו ב-base44)
    # אנחנו משתמשים ב-created_date שנוסיף בצד השרת
    return sorted(rides_db, key=lambda x: x['created_date'], reverse=True)

# POST - יצירת נסיעה חדשה
@app.post("/api/rides")
def create_ride(ride: RideSchema):
    global id_counter
    
    # המרת המידע למילון (Dictionary)
    new_ride = ride.dict()
    
    # הוספת שדות שהשרת מנהל
    new_ride['id'] = id_counter
    new_ride['created_date'] = datetime.now().isoformat()
    
    id_counter += 1
    rides_db.append(new_ride)
    
    print(f"New ride created: {new_ride['driver_name']} to {new_ride['destination']}")
    return new_ride

if __name__ == "__main__":
    import uvicorn
    # הרצת השרת בפורט 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)