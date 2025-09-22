import { create } from "zustand";
import { SeatMapState, Row, Seat } from "./types";
import { randomColor, generateSeatId, generateRowId } from "../utils/colors";

export const useSeatMap = create<SeatMapState>((set, get) => ({
    rows: [],
    seats: {},
    selectedSeatIds: [],
    selectedRowIds: [],
    draftSeat: null,

    addRow: () => {
        let newRowId = "";
        set((state) => {
            const rowIndex = state.rows.length;
            newRowId = `row-${rowIndex}`;

            const newRow: Row = {
                id: newRowId,
                label: String.fromCharCode(65 + rowIndex),
                seatIds: [],
                color: randomColor(),
                seatPrefix: String.fromCharCode(65 + rowIndex),
            };

            return {
                rows: [...state.rows, newRow],
            };
        });
        return newRowId;
    },



    addSeatToRow: (rowId: string) => {
        set((state) => {
            const row = state.rows.find((r) => r.id === rowId);
            if (!row) return state;

            if (row.seatIds.length >= 25) {
                alert(`⚠️ La fila ${row.label} ya alcanzó el máximo de 25 asientos.`);
                return state;
            }

            const centerX = 600;
            const centerY = 400;
            const rowIndex = state.rows.findIndex((r) => r.id === rowId);

            const radiusX = 150 + rowIndex * 25;
            const radiusY = 100 + rowIndex * 20;

            const maxRadiusX = 450;
            const maxRadiusY = 300;
            if (radiusX >= maxRadiusX || radiusY >= maxRadiusY) {
                alert(`⚠️ En la fila ${row.label} no se pueden agregar más asientos.`);
                return state;
            }

            const newSeats = { ...state.seats };
            const seatCount = row.seatIds.length + 1;

            row.seatIds.forEach((sid, i) => {
                const angle = (i / seatCount) * 2 * Math.PI;
                newSeats[sid] = {
                    ...newSeats[sid],
                    x: centerX + radiusX * Math.cos(angle),
                    y: centerY + radiusY * Math.sin(angle),
                };
            });

            const newSeatId = `${rowId}-${row.seatIds.length}`;
            const angle = ((seatCount - 1) / seatCount) * 2 * Math.PI;
            newSeats[newSeatId] = {
                id: newSeatId,
                label: `${row.seatPrefix || row.label}${seatCount}`,
                rowId,
                x: centerX + radiusX * Math.cos(angle),
                y: centerY + radiusY * Math.sin(angle),
                color: row.color,
            };


            const updatedRow = {
                ...row,
                seatIds: [...row.seatIds, newSeatId],
            };

            return {
                ...state,
                seats: newSeats,
                rows: state.rows.map((r) => (r.id === rowId ? updatedRow : r)),
            };
        });
    },

    removeSeatFromRow: (rowId: string) => {
        set((state) => {
            const row = state.rows.find((r) => r.id === rowId);
            if (!row || row.seatIds.length === 0) return state;

            const newSeats = { ...state.seats };
            const lastSeatId = row.seatIds[row.seatIds.length - 1];
            delete newSeats[lastSeatId];

            const updatedRow = {
                ...row,
                seatIds: row.seatIds.slice(0, -1),
            };

            const centerX = 600;
            const centerY = 400;
            const rowIndex = state.rows.findIndex((r) => r.id === rowId);
            const radiusX = 150 + rowIndex * 25;
            const radiusY = 100 + rowIndex * 20;
            const seatCount = updatedRow.seatIds.length;

            updatedRow.seatIds.forEach((sid, i) => {
                const angle = (i / seatCount) * 2 * Math.PI;
                newSeats[sid] = {
                    ...newSeats[sid],
                    x: centerX + radiusX * Math.cos(angle),
                    y: centerY + radiusY * Math.sin(angle),
                    color: row.color,
                };

            });

            return {
                ...state,
                seats: newSeats,
                rows: state.rows.map((r) => (r.id === rowId ? updatedRow : r)),
            };
        });
    },

    removeRow: (rowId) => {
        const { rows, seats } = get();
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;

        const newSeats = { ...seats };
        row.seatIds.forEach((sid) => delete newSeats[sid]);

        set({
            rows: rows.filter((r) => r.id !== rowId),
            seats: newSeats,
        });
    },

    toggleSeatSelection: (seatId) => {
        const { selectedSeatIds } = get();
        set({
            selectedSeatIds: selectedSeatIds.includes(seatId)
                ? selectedSeatIds.filter((id) => id !== seatId)
                : [...selectedSeatIds, seatId],
        });
    },

    toggleRowSelection: (rowId) => {
        const { selectedRowIds } = get();
        set({
            selectedRowIds: selectedRowIds.includes(rowId)
                ? selectedRowIds.filter((id) => id !== rowId)
                : [...selectedRowIds, rowId],
        });
    },

    clearSelection: () => {
        set({ selectedSeatIds: [], selectedRowIds: [] });
    },

    reset: () => {
        set({
            rows: [],
            seats: {},
            selectedSeatIds: [],
            selectedRowIds: [],
            draftSeat: null,
        });
    },


    removeSelection: () => {
        const { rows, seats, selectedSeatIds } = get();
        if (selectedSeatIds.length === 0) return;

        const newSeats = { ...seats };
        let updatedRows = rows.map((row) => ({
            ...row,
            seatIds: row.seatIds.filter((sid) => !selectedSeatIds.includes(sid)),
        }));

        selectedSeatIds.forEach((sid) => delete newSeats[sid]);
        updatedRows = updatedRows.filter((row) => row.seatIds.length > 0);

        set({
            rows: updatedRows,
            seats: newSeats,
            selectedSeatIds: [],
        });
    },

    renameRow: (rowId, newLabel, newColor) => {
        const { rows, seats } = get();
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;

        const updatedRows = rows.map((r) =>
            r.id === rowId ? { ...r, label: newLabel, color: newColor } : r
        );

        const newSeats = { ...seats };
        row.seatIds.forEach((sid) => {
            newSeats[sid] = {
                ...newSeats[sid],
                color: newColor,
            };
        });

        set({ rows: updatedRows, seats: newSeats });
    },


    renameRowSeats: (rowId, newPrefix) => {
        const { rows, seats } = get();
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;

        const newSeats = { ...seats };
        row.seatIds.forEach((sid, index) => {
            newSeats[sid] = {
                ...newSeats[sid],
                label: `${newPrefix}${index + 1}`,
            };
        });

        const updatedRows = rows.map((r) =>
            r.id === rowId ? { ...r, seatPrefix: newPrefix } : r
        );

        set({ seats: newSeats, rows: updatedRows });
    },


    renameSelectedSeats: (prefix) => {
        const { selectedSeatIds, seats } = get();
        if (selectedSeatIds.length === 0) return;

        const newSeats = { ...seats };
        selectedSeatIds.forEach((sid, index) => {
            newSeats[sid] = {
                ...newSeats[sid],
                label: `${prefix}${index + 1}`,
            };
        });

        set({ seats: newSeats });
    },



    exportMap: (nombreMapa) => {
        const { rows, seats } = get();

        const data = {
            nombreMapa,
            timestamp: new Date().toISOString(),
            rows,
            seats,
        };

        return JSON.stringify(data, null, 2);
    },

    importMap: (data) => {
        try {
            if (!data || !data.rows || !data.seats) {
                throw new Error("Formato inválido");
            }

            set({
                rows: data.rows,
                seats: data.seats,
                selectedSeatIds: [],
                selectedRowIds: [],
            });
        } catch (e) {
            alert("Error al importar JSON: " + (e as Error).message);
        }
    },


    generateOvalMap: (centerX, centerY) => {
        set({
            rows: [],
            seats: {},
            selectedSeatIds: [],
            selectedRowIds: [],
        });
        return { centerX, centerY, radiusX: 450, radiusY: 300 };
    },
    recolorSeats: (color: string) => {
        const { selectedSeatIds, seats } = get();
        if (selectedSeatIds.length === 0) return;

        const newSeats = { ...seats };
        selectedSeatIds.forEach((sid) => {
            newSeats[sid] = { ...newSeats[sid], color };
        });

        set({ seats: newSeats });
    },

    moveSeatsToRow: (targetRowId: string) => {
        const { rows, seats, selectedSeatIds } = get();
        if (selectedSeatIds.length === 0) return;

        const newSeats = { ...seats };
        const updatedRows = rows.map((row) => {
            let seatIds = [...row.seatIds];
            if (row.id === targetRowId) {
                seatIds = [...seatIds, ...selectedSeatIds];
            } else {
                seatIds = seatIds.filter((sid) => !selectedSeatIds.includes(sid));
            }
            return { ...row, seatIds };
        });

        selectedSeatIds.forEach((sid) => {
            newSeats[sid] = { ...newSeats[sid], rowId: targetRowId };
        });

        set({ rows: updatedRows, seats: newSeats });
    },

    startDraftSeat: () => {
        set({ draftSeat: { id: "draft-seat", x: 600, y: 400 } });

        set({ selectedSeatIds: ["draft-seat"] });
    },

    updateDraftSeat: (x, y) => {
        const { draftSeat } = get();
        if (!draftSeat) return;
        set({ draftSeat: { ...draftSeat, x, y } });
    },

    confirmDraftSeat: (rowId?: string, prefix?: string, color?: string) => {
        const { draftSeat, seats, rows } = get();
        if (!draftSeat) return;

        const newSeatId = `custom-${Date.now()}`;

        const seatPrefix = prefix || "S";

        const newSeat: Seat = {
            id: newSeatId,
            label: `${seatPrefix}${Object.keys(seats).length + 1}`,
            rowId: rowId || "free",
            x: draftSeat.x,
            y: draftSeat.y,
            color: color || "#bdbdbd",
        };


        let updatedRows = rows;
        if (rowId) {
            updatedRows = rows.map((r) =>
                r.id === rowId ? { ...r, seatIds: [...r.seatIds, newSeatId] } : r
            );
        }

        set({
            seats: { ...seats, [newSeatId]: newSeat },
            draftSeat: null,
            selectedSeatIds: [newSeatId],
            rows: updatedRows,
        });
    },






    cancelDraftSeat: () => {
        set({ draftSeat: null });
    },
}));
