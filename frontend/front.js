"use client";
import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";

export default function IncidentMap() {
    const [incidents, setIncidents] = useState([]);
    const [selected, setSelected] = useState(null);
    const [newIncident, setNewIncident] = useState({ type: "", description: "" });

    useEffect(() => {
        fetch("http://localhost:5000/api/incidents")
            .then((res) => res.json())
            .then(setIncidents);
    }, []);

    const addIncident = async (e) => {
        e.preventDefault();
        const { lng, lat } = newIncident;

        const res = await fetch("http://localhost:5000/api/incidents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newIncident),
        });

        if (res.ok) {
            setIncidents([...incidents, { ...newIncident, id: Date.now() }]);
            setNewIncident({ type: "", description: "" });
        }
    };

    return (
        <div className="w-full h-screen">
            <Map
                mapboxAccessToken="pk.eyJ1IjoicGFzaDMzIiwiYSI6ImNtNnZwczRjMDBhOTAybHB2dTBxNmV0dGcifQ.5PoaKatb6sSvYqFjYnutdg"
                initialViewState={{ longitude: -84.4822, latitude: 42.7018, zoom: 14 }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            >
                {incidents.map((incident) => (
                    <Marker
                        key={incident.id}
                        longitude={incident.longitude}
                        latitude={incident.latitude}
                        onClick={() => setSelected(incident)}
                    >
                        📍
                    </Marker>
                ))}

                {selected && (
                    <Popup
                        longitude={selected.longitude}
                        latitude={selected.latitude}
                        onClose={() => setSelected(null)}
                    >
                        <div>
                            <h3>{selected.type}</h3>
                            <p>{selected.description}</p>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* Simple Form for Reporting */}
            <form onSubmit={addIncident} className="absolute bottom-4 left-4 bg-white p-4">
                <input
                    type="text"
                    placeholder="Incident Type"
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                />
                <button type="submit">Report</button>
            </form>
        </div>
    );
}
