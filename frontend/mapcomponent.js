import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";

const MAPBOX_TOKEN = "pk.eyJ1IjoicGFzaDMzIiwiYSI6ImNtNnZwczRjMDBhOTAybHB2dTBxNmV0dGcifQ.5PoaKatb6sSvYqFjYnutdg"; // Replace with your Mapbox token

const MapComponent = () => {
    const [viewport, setViewport] = useState({
        latitude: 42.7018, // MSU location
        longitude: -84.4822,
        zoom: 15,
    });

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [issueDescription, setIssueDescription] = useState("");
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    // Fetch reports from backend when component loads
    useEffect(() => {
        fetch("http://localhost:5000/reports")
            .then((response) => response.json())
            .then((data) => setReports(data))
            .catch((error) => console.error("Error fetching reports:", error));
    }, []);

    // Handle map click to select a location
    const handleMapClick = (event) => {
        const { lng, lat } = event.lngLat;
        setSelectedLocation({ latitude: lat, longitude: lng });
        setSelectedReport(null); // Hide any open report popups
    };

    // Submit the issue
    const handleSubmit = () => {
        if (!selectedLocation || issueDescription.trim() === "") {
            alert("Please select a location and enter an issue.");
            return;
        }

        const newReport = {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            description: issueDescription,
        };

        fetch("http://localhost:5000/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReport),
        })
            .then((response) => response.json())
            .then(() => {
                setReports([...reports, newReport]);
                setIssueDescription("");
                setSelectedLocation(null);
            });
    };

    return (
        <div>
            <Map
                initialViewState={viewport}
                style={{ width: "100%", height: "500px" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                onClick={handleMapClick}
                onMove={(evt) => setViewport(evt.viewState)} // Keep viewport updated while zooming/panning
            >
                {/* Show selected location marker (red pin) */}
                {selectedLocation && (
                    <Marker latitude={selectedLocation.latitude} longitude={selectedLocation.longitude} anchor="bottom">
                        <div style={{ color: "red", fontSize: "24px" }}>📍</div>
                    </Marker>
                )}

                {/* Show reported issues as blue markers */}
                {reports.map((report, index) => (
                    <Marker
                        key={index}
                        latitude={report.latitude}
                        longitude={report.longitude}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation(); // Prevent map click from triggering
                            setSelectedReport(report);
                        }}
                    >
                        <div style={{ color: "blue", fontSize: "20px", cursor: "pointer" }}>🔵</div>
                    </Marker>
                ))}

                {/* Show popup when clicking on a blue marker */}
                {selectedReport && (
                    <Popup
                        latitude={selectedReport.latitude}
                        longitude={selectedReport.longitude}
                        closeButton={true}
                        closeOnClick={false}
                        onClose={() => setSelectedReport(null)}
                        anchor="top"
                    >
                        <div>
                            <h4>Issue Report</h4>
                            <p>{selectedReport.description}</p>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* Issue submission form */}
            <div style={{ marginTop: "10px" }}>
                <textarea
                    placeholder="Describe the issue..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    style={{ width: "100%", height: "80px", marginBottom: "10px" }}
                />
                <button onClick={handleSubmit} style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>
                    Submit Issue
                </button>
            </div>
        </div>
    );
};

export default MapComponent;
