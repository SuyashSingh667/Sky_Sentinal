import React, { useEffect, useState, useMemo } from 'react';
import { Viewer, Entity, PolylineGraphics } from 'resium';
import * as Cesium from 'cesium';
import * as satellite from 'satellite.js';
import { Cartesian3, Color } from 'cesium';

// Import Cesium CSS
import "cesium/Build/Cesium/Widgets/widgets.css";

const CesiumGlobe = ({ satellites = [], debris = [], onObjectSelect }) => {
    const [positions, setPositions] = useState({});

    // Memoize orbits generation to avoid recalculating on every frame unless objects change
    const objects = useMemo(() => [...satellites, ...debris], [satellites, debris]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const newPositions = {};

            objects.forEach((obj) => {
                // Mock TLE for now if not provided (in a real app, you'd fetch real TLEs)
                // This is a placeholder to demonstrate satellite.js integration.
                // If your object has a tle parameter, use it:
                if (obj.tleLine1 && obj.tleLine2) {
                    const satrec = satellite.twoline2satrec(obj.tleLine1, obj.tleLine2);
                    const positionAndVelocity = satellite.propagate(satrec, now);
                    const positionEci = positionAndVelocity.position;

                    if (positionEci) {
                        const gmst = satellite.gstime(now);
                        const positionGd = satellite.eciToGeodetic(positionEci, gmst);

                        // Convert to Cesium Cartesian3
                        const position = Cartesian3.fromRadians(
                            positionGd.longitude,
                            positionGd.latitude,
                            positionGd.height * 1000 // height in meters
                        );
                        newPositions[obj.id] = position;
                    }
                } else {
                    // Fallback for objects without TLE (using lat/lon/alt from state)
                    // Using manual movement for demo purposes if no TLE
                    const time = now.getTime() / 1000;
                    const position = Cartesian3.fromDegrees(
                        obj.longitude + (obj.velocity || 0) * (time % 3600) / 3600, // rudimentary movement
                        obj.latitude,
                        (obj.altitude || 400) * 1000
                    );
                    newPositions[obj.id] = position;
                }
            });

            setPositions(newPositions);
        }, 1000 / 60); // 60 FPS update

        return () => clearInterval(interval);
    }, [objects]);

    return (
        <Viewer full>
            <div className="absolute top-4 left-4 z-50 bg-black/50 p-2 text-white rounded">
                Cesium Globe Active
            </div>

            {/* Render Objects */}
            {objects.map((obj) => (
                <Entity
                    key={obj.id}
                    name={obj.name}
                    position={positions[obj.id]}
                    point={{ pixelSize: 10, color: obj.type === 'satellite' ? Color.CYAN : Color.RED }}
                    description={`Type: ${obj.type}\nAltitude: ${obj.altitude} km`}
                    onClick={() => onObjectSelect && onObjectSelect(obj)}
                />
            ))}
        </Viewer>
    );
};

export default CesiumGlobe;
