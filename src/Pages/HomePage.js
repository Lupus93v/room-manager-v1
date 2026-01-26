import { useOutletContext } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ref, remove, update, onValue } from "firebase/database";
import { database } from "../firebase";
import { translations } from "../lang/translations";

const referenceInDB = ref(database, "rooms");

export default function HomePage() {
    const { setTotalCapacity, setTotalUsage } = useOutletContext();
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [editError, setEditError] = useState("");
    const { language } = useOutletContext();
    const t = translations[language];

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
    setPopupVisible(false)
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
                    <h2>{room.name}</h2>
                    <p>{t.capacity} {room.capacity}</p>
                    <p>{t.usedBeds} {room.usage}</p>
                    <p className="note">{t.note} {room.note}</p>
                    {room.picture && <img src={room.picture} alt={room.name} style={{ width: "100px" }} />}
                </div>
            ))}

            {popupVisible && selectedRoom && (
                <div className="room-popup">
                    <button onClick={() => setEditRoom(selectedRoom)}>{t.edit}</button>
                    <button
                        style={{ backgroundColor: "red", color: "white" }}
                        onClick={() => deleteRoom(selectedRoom.id)}
                    >
                        {t.delete}
                    </button>
                    <button
                        onClick={() => {
                            setPopupVisible(false);
                            setSelectedRoom(null);
                            setEditRoom(null);
                        }}
                    >
                        {t.close}
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
                            style={{color:"white"}}
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

                            <button onClick={saveEdit}>{t.save}</button>
                            <button onClick={() => setEditRoom(null)}>{t.cancel}</button>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}
