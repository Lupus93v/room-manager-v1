import { useOutletContext } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ref, remove, update, onValue } from "firebase/database";
import { database } from "../firebase";

const referenceInDB = ref(database, "rooms");

export default function HomePage() {
    const { setTotalCapacity, setTotalUsage } = useOutletContext();
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [editError, setEditError] = useState("");

    useEffect(() => {
        const unsubscribe = onValue(referenceInDB, (snapshot) => {
            const snapshotValues = snapshot.val();

            if (snapshotValues) {
                const roomsArray = Object.entries(snapshotValues).map(
                    ([id, room]) => ({ id, ...room })
                );

                setRooms(roomsArray);

                const capacitySum = roomsArray.reduce(
                    (sum, room) => sum + Number(room.capacity || 0),
                    0
                );

                const usageSum = roomsArray.reduce(
                    (sum, room) => sum + Number(room.usage || 0),
                    0
                );

                setTotalCapacity(capacitySum);
                setTotalUsage(usageSum);
            } else {
                setRooms([]);
                setTotalCapacity(0);
                setTotalUsage(0);
            }
        });

        return () => unsubscribe();
    }, [setTotalCapacity, setTotalUsage]);

    const handleEditUsageChange = (e) => {
        const value = Number(e.target.value);

        if (value <= Number(editRoom.capacity)) {
            setEditRoom({ ...editRoom, usage: value });
        }
    };

    const handleEditCapacityChange = (e) => {
        const newCapacity = Number(e.target.value);

        if (newCapacity >= Number(editRoom.usage)) {
            setEditRoom({ ...editRoom, capacity: newCapacity });
            setEditError("");
        } else {
            setEditError("Kapacitet ne može biti manji od broja korištenih kreveta!");
        }
    };



    function saveEdit() {
    const roomRef = ref(database, `rooms/${editRoom.id}`);

    const updatedData = {
        ...editRoom
    };

    if (editImage) {
        updatedData.image = editImage;
    } else {
        delete updatedData.image;
    }

    update(roomRef, updatedData);

    setEditRoom(null);
    setEditImage(null);
}

    function deleteRoom(roomId) {
        const confirmDelete = window.confirm("Da li si siguran da želiš obrisati sobu?");

        if (!confirmDelete) return;

        const roomRef = ref(database, `rooms/${roomId}`);
        remove(roomRef);

        setPopupVisible(false);
        setSelectedRoom(null);
        setEditRoom(null);
    }


    return (
        <div className="rooms-list">
            {rooms.map((room) => (
                <div
                    className="room-div"
                    key={room.id}
                    onClick={() => {
                        setSelectedRoom(room);
                        setPopupVisible(true);
                    }}
                >
                    <img src={room.image} alt={room.name} />
                    <h3>{room.name}</h3>
                    <p>Kapacitet: {room.capacity}</p>
                    <p>Popunjenost: {room.usage}</p>
                    <p>Napomena: {room.note}</p>
                    {room.picture && <img src={room.picture} alt={room.name} style={{ width: "100px" }} />}
                </div>
            ))}

            {popupVisible && selectedRoom && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        border: "1px solid black",
                        padding: "20px",
                        zIndex: 1000
                    }}
                >
                    <button onClick={() => setEditRoom(selectedRoom)}>Uredi</button>
                    <button
                        style={{ backgroundColor: "red", color: "white" }}
                        onClick={() => deleteRoom(selectedRoom.id)}
                    >
                        Delete
                    </button>
                    <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                            setPopupVisible(false);
                            setSelectedRoom(null);
                            setEditRoom(null);
                        }}
                    >
                        Close
                    </button>

                    {editRoom && (
                        <div className="modal">
                            <input
                                type="text"
                                value={editRoom.name}
                                onChange={(e) =>
                                    setEditRoom({ ...editRoom, name: e.target.value })
                                }
                            />

                            <input
                                type="number"
                                value={editRoom.capacity}
                                onChange={handleEditCapacityChange}
                            />
                            {editError && (
                                <div style={{
                                    color: "white",
                                    backgroundColor: "red",
                                    padding: "5px 10px",
                                    marginTop: "10px",
                                    borderRadius: "5px"
                                }}>
                                    {editError}
                                </div>
                            )}

                            <input
                                type="number"
                                value={editRoom.usage}
                                onChange={handleEditUsageChange}
                            />

                            <input
                                type="text"
                                value={editRoom.note}
                                onChange={(e) =>
                                    setEditRoom({ ...editRoom, note: e.target.value })
                                }
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setEditImage(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            {editImage && <img src={editImage} width="100" alt={"soba"}/>}

                            <button onClick={saveEdit}>Save</button>
                            <button onClick={() => setEditRoom(null)}>Cancel</button>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}
