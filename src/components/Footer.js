import React, { useState } from "react"
import { ref, push } from "firebase/database"
import { database } from "../firebase"
import { translations } from "../lang/translations";

const referenceInDB = ref(database, "rooms");

export default function Footer({ language, setLanguage }) {

    const t = translations[language];
    const [showForm, setShowForm] = useState(false)
    const [roomImage, setRoomImage] = useState(null)
    const [roomName, setRoomName] = useState("");
    const [roomCapacity, setRoomCapacity] = useState("")
    const [roomUsage, setRoomUsage] = useState("")
    const [roomNote, setRoomNote] = useState("")

    const handleUsageChange = (e) => {
        const value = Number(e.target.value);

        if (value <= Number(roomCapacity)) {
            setRoomUsage(value);
        }
    };

    function NewRoom() {
        setShowForm(prev => !prev)
    }

    function AddRoom() {
        const roomObject = {
            image: roomImage,
            name: roomName,
            capacity: roomCapacity,
            usage: roomUsage,
            note: roomNote
        }
        push(referenceInDB, roomObject)

        setRoomName("");
        setRoomImage("");
        setRoomCapacity("");
        setRoomUsage("");
        setRoomNote("");
        setShowForm(false);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const imageURL = URL.createObjectURL(file);
            setRoomImage(imageURL);
        }
    };

    return (
        <div className="footer">
            <button
                className="lang-btn" onClick={() => setLanguage(language === "en" ? "sr" : "en")}
            >
                {language === "en" ? "СР" : "EN"}
            </button>
            <h5>Lupus Solutions</h5>
            <button className="new-room-btn" onClick={NewRoom}>+</button>
            {showForm && (<div className="new-room-form">
                <p style={{ color: "white" }}>{t.newRoom}</p>
                <input type="text" placeholder={t.roomName} value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <input style={{ color: "white" }} type="file" placeholder={roomImage} accept="image/*" onChange={handleImageChange} />
                {roomImage && (
                    <img
                        src={roomImage}
                        alt="Preview"
                        style={{ width: "100px", marginTop: "10px" }}
                    />
                )}

                <input type="number" placeholder={t.roomCapacity} value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} />
                <input type="number" disabled={!roomCapacity} placeholder={t.roomUsage} min={0} max={roomCapacity} value={roomUsage} onChange={handleUsageChange} />
                <textarea placeholder={t.roomNote} value={roomNote} rows={4} onChange={(e) => setRoomNote(e.target.value)} />
                <button className="add-room-btn" id="add-room" onClick={AddRoom}>{t.addRoom}</button>
            </div>)}
        </div>
    )
}