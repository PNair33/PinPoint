"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";


mapboxgl.accessToken = "pk.eyJ1IjoicGFzaDMzIiwiYSI6ImNtNnZwczRjMDBhOTAybHB2dTBxNmV0dGcifQ.5PoaKatb6sSvYqFjYnutdg";

export default function PinPointApp() {
    const [role, setRole] = useState(null);

    if (!role) {
        return <LandingPage setRole={setRole} />;
    }

    return <MapPage role={role} />;
}

// 🎯 LANDING PAGE
function LandingPage({ setRole }) {
    return (
        <div style={styles.landingContainer}>
            <img src="/Users/parameswar/Spartahack app/logo.png" alt="PinPoint Logo" width={150} height={150} />
            <h1 style={styles.title}>Welcome to PinPoint</h1>
            <p style={styles.subtitle}>Choose your role to continue:</p>
            <button onClick={() => setRole("student")} style={styles.button}>Use as Student</button>
            <button onClick={() => setRole("admin")} style={{ ...styles.button, backgroundColor: "#e74c3c" }}>
                Use as Administrator
            </button>
        </div>
    );
}

// 🎯 MAP PAGE WITH ROLE-BASED ACCESS
function MapPage({ role }) {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const mapInstance = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-84.482, 42.722],
            zoom: 14
        });

        setMap(mapInstance);

        return () => mapInstance.remove();
    }, []);

    const addPin = (lng, lat) => {
        if (!map) return;

        const newMarker = new mapboxgl.Marker({ color: "red" })
            .setLngLat([lng, lat])
            .addTo(map);

        if (role === "admin") {
            newMarker.getElement().addEventListener("click", () => removePin(newMarker));
        }

        setMarkers((prev) => [...prev, newMarker]);
    };

    useEffect(() => {
        if (map) {
            map.on("click", (e) => {
                if (role === "student" || role === "admin") {
                    addPin(e.lngLat.lng, e.lngLat.lat);
                }
            });
        }
    }, [map]);

    const removePin = (marker) => {
        if (role === "admin") {
            marker.remove();
            setMarkers((prev) => prev.filter((m) => m !== marker));
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>PinPoint: {role === "admin" ? "Administrator Panel" : "Student Panel"}</h1>
            <p style={styles.subtitle}>Click to add an incident. {role === "admin" && "Click a pin to remove it."}</p>
            <div id="map" style={styles.map}></div>
            {role === "admin" && markers.length > 0 && (
                <button onClick={() => markers.forEach((m) => m.remove())} style={styles.clearButton}>
                    Clear All Pins
                </button>
            )}
        </div>
    );
}

// 🎨 STYLING
const styles = {
    landingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#ecf0f1",
    },
    logo: {
        width: "150px",
        height: "150px",
        marginBottom: "20px",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#2c3e50",
    },
    subtitle: {
        fontSize: "16px",
        color: "#555",
        marginBottom: "20px",
    },
    button: {
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        padding: "12px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
    },
    map: {
        width: "100%",
        maxWidth: "1000px",
        height: "500px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        marginBottom: "20px",
    },
    clearButton: {
        marginTop: "10px",
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        cursor: "pointer",
    }
};
