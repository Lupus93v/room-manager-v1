import React from "react"
import { translations } from "../lang/translations";

export default function Header({ language, totalCapacity, totalUsage, freeCapacity }) {

    const t = translations[language];

    return (
        <div className="header">
            <h1>{t.title}</h1>
            <div className="status-bar">
                <h4>{t.capacity}: {totalCapacity}</h4>
                <h4>{t.usedBeds}: {totalUsage}</h4>
                <h4>{t.freeBeds}: {freeCapacity}</h4>
            </div>
        </div>
    )
}