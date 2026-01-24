import React, { useState } from "react"
import { ref, push } from "firebase/database"
import { database } from "../firebase"

const referenceInDB = ref(database, "rooms");

export default function Header({ totalCapacity, totalUsage, freeCapacity }) {

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
        <div className="header">
            <h1>Room Manager</h1>
            <div className="status-bar">
                <h4>Capacity: {totalCapacity}</h4>
                <h4>Used bads: {totalUsage}</h4>
                <h4>Free bads: {freeCapacity}</h4>
            </div>
            <button className="new-room-btn" onClick={NewRoom}>+</button>
            {showForm && (<div className="new-room-form">
                <p style={{color:"white"}}>NEW ROOM</p>
                <input type="text" placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <input style={{color: "white"}} type="file" placeholder="Room image" accept="image/*" onChange={handleImageChange} />
                {roomImage && (
                    <img
                        src={roomImage}
                        alt="Preview"
                        style={{ width: "100px", marginTop: "10px"}}
                    />
                )}

                <input type="number" placeholder="Room Capacity" value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} />
                <input type="number" disabled={!roomCapacity} placeholder="Room usage" min={0} max={roomCapacity} value={roomUsage} onChange={handleUsageChange} />
                <textarea placeholder="Room note" value={roomNote} rows={4} onChange={(e) => setRoomNote(e.target.value)} />
                <button className="add-room-btn" id="add-room" onClick={AddRoom}>Add Room</button>
            </div>)}
        </div>
    )
}