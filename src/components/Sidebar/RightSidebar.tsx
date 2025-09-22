"use client";
import {
  Drawer,
  Toolbar,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useSeatMap } from "@/lib/seatmap";
import { useSnackbarMessage } from "@/hooks/useSnackbarMessage";

const drawerWidth = 300;

export default function SeatSidebar() {
  const selectedSeatIds = useSeatMap((s) => s.selectedSeatIds);
  const seats = useSeatMap((s) => s.seats);
  const rows = useSeatMap((s) => s.rows);

  const renameSelectedSeats = useSeatMap((s) => s.renameSelectedSeats);
  const removeSelection = useSeatMap((s) => s.removeSelection);
  const moveSeatsToRow = useSeatMap((s) => s.moveSeatsToRow);
  const recolorSeats = useSeatMap((s) => s.recolorSeats);
  const clearSelection = useSeatMap((s) => s.clearSelection);

  const [prefix, setPrefix] = useState("");
  const [color, setColor] = useState("#cccccc");
  const [targetRow, setTargetRow] = useState("");

  const { showMessage, SnackbarUI } = useSnackbarMessage();

  if (selectedSeatIds.length === 0) return null;

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="h6">
          {selectedSeatIds.length} asiento(s) seleccionados
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {selectedSeatIds.map((sid) => (
            <Chip key={sid} label={seats[sid]?.label} size="small" />
          ))}
        </Stack>

        <TextField
          select
          label="Mover a fila"
          size="small"
          value={targetRow}
          disabled={rows.length === 0}
          onChange={(e) => {
            if (e.target.value === "new-row") {
              const newRowId = useSeatMap.getState().addRow();
              setTargetRow(newRowId);
            } else {
              setTargetRow(e.target.value);
            }
          }}
        >
          {rows.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.label}
            </MenuItem>
          ))}
          <MenuItem value="new-row" sx={{ fontStyle: "italic", color: "primary.main" }}>
            ➕ Crear nueva fila
          </MenuItem>
        </TextField>

        <Button
          variant="contained"
          disabled={!targetRow}
          onClick={() => {
            moveSeatsToRow(targetRow);
            showMessage("Asientos movidos ✔");
          }}
        >
          Mover
        </Button>

        <TextField
          label="Prefijo nuevo"
          size="small"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            renameSelectedSeats(prefix);
            showMessage("Prefijo actualizado ✔");
          }}
        >
          Renombrar
        </Button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            recolorSeats(color);
            showMessage("Color actualizado ✔");
          }}
        >
          Cambiar color
        </Button>

        <Button
          color="error"
          variant="outlined"
          onClick={() => {
            removeSelection();
            showMessage("Asientos eliminados ❌");
          }}
        >
          Eliminar asientos
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            clearSelection();
            useSeatMap.getState().confirmDraftSeat();
            showMessage("Cambios guardados ✔");
          }}
        >
          Listo
        </Button>
      </Stack>

      {SnackbarUI}
    </Drawer>
  );
}