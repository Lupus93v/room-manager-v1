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
            {showForm && (<div
                style={{
                    border: "solid red 1px",
                    width: "50%",
                }}>
                <input type="text" placeholder="Ime sobe" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <input type="file" placeholder="Slike sobe" accept="image/*" onChange={handleImageChange} />
                {roomImage && (
                    <img
                        src={roomImage}
                        alt="Preview"
                        style={{ width: "100px", marginTop: "10px" }}
                    />
                )}

                <input type="number" placeholder="Kapacitet sobe" value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} />
                <input type="number" disabled={!roomCapacity} placeholder="Popunjenost sobe" min={0} max={roomCapacity} value={roomUsage} onChange={handleUsageChange} />
                <input type="text" placeholder="Napomena" value={roomNote} onChange={(e) => setRoomNote(e.target.value)} />
                <button id="add-room" onClick={AddRoom}>Add Room</button>
            </div>)}
        </div>
    )
}