"use client";
import { Stage, Layer, Circle, Ellipse, Label, Tag, Text } from "react-konva";
import { useEffect, useState } from "react";
import { useSeatMap, Row, Seat, darkenColor } from "@/lib/seatmap";
import { SeatTooltip } from "./SeatTooltip";

export default function SeatMapCanvas() {
    const rows = useSeatMap((s) => s.rows);
    const seats = useSeatMap((s) => s.seats);
    const selectedSeatIds = useSeatMap((s) => s.selectedSeatIds);
    const toggleSeatSelection = useSeatMap((s) => s.toggleSeatSelection);
    const generateOvalMap = useSeatMap((s) => s.generateOvalMap);
    const draftSeat = useSeatMap((s) => s.draftSeat);
    const updateDraftSeat = useSeatMap((s) => s.updateDraftSeat);

    const [hoveredSeat, setHoveredSeat] = useState<{
        seat: Seat;
        row: Row;
    } | null>(null);

    useEffect(() => {
        generateOvalMap(600, 400);
    }, [generateOvalMap]);

    return (
        <>
            <Stage width={1200} height={800} style={{ background: "#e0e0e0" }}>
                <Layer>
                    <Ellipse
                        x={600}
                        y={400}
                        radiusX={450}
                        radiusY={300}
                        fill="white"
                        stroke="#ccc"
                        strokeWidth={3}
                    />

                    {rows.map((row) =>
                        row.seatIds.map((sid) => {
                            const seat = seats[sid];
                            const isSelected = selectedSeatIds.includes(seat.id);

                            return (
                                <Circle
                                    key={seat.id}
                                    x={seat.x}
                                    y={seat.y}
                                    radius={10}
                                    fill={isSelected ? "#bdbdbd" : seat.color || row.color}
                                    stroke={darkenColor(seat.color || row.color)}
                                    strokeWidth={2}
                                    onClick={() => toggleSeatSelection(seat.id)}
                                    onMouseEnter={() => setHoveredSeat({ seat, row })}
                                    onMouseLeave={() => setHoveredSeat(null)}
                                />
                            );
                        })
                    )}

                    {draftSeat && (
                        <Circle
                            key="draft-seat"
                            x={draftSeat.x}
                            y={draftSeat.y}
                            radius={12}
                            fill="#ffffff"
                            stroke="#1976d2"
                            strokeWidth={3}
                            dash={[6, 4]}
                            draggable
                            onDragMove={(e) => {
                                updateDraftSeat(e.target.x(), e.target.y());
                            }}
                        />
                    )}

                    {hoveredSeat && <SeatTooltip seat={hoveredSeat.seat} row={hoveredSeat.row} />}
                </Layer>
            </Stage>
        </>
    );
}
