"use client";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    ListSubheader,
    Collapse,
    Stack,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from "@mui/material";
import { useState } from "react";
import {
    AddCircleOutline as AddCircleOutlineIcon,
    EditOutlined as EditOutlinedIcon,
    Settings as SettingsIcon,
    SaveAltOutlined as SaveAltOutlinedIcon,
    RestorePageOutlined as RestorePageOutlinedIcon,
    RestartAltOutlined as RestartAltOutlinedIcon,
    ExpandLess,
    ExpandMore,
    Remove as RemoveIcon,
    Add as AddIcon,
    AddLocationAlt as AddLocationAltIcon,
} from "@mui/icons-material";
import { Row, useSeatMap } from "@/lib/seatmap";
import { exportJSON, importJSON } from "@/lib/utils/file";
import RowItem from "./RowItem";

const drawerWidth = 260;

export default function Sidebar() {
    const [open, setOpen] = useState<string | null>(null);
    const [mapName, setMapName] = useState("");

    const [editRow, setEditRow] = useState<Row | null>(null);

    const rows = useSeatMap((s) => s.rows);
    const addRow = useSeatMap((s) => s.addRow);
    const removeRow = useSeatMap((s) => s.removeRow);
    const exportMap = useSeatMap((s) => s.exportMap);
    const importMap = useSeatMap((s) => s.importMap);
    const reset = useSeatMap((s) => s.reset);

    const addSeatToRow = useSeatMap((s) => s.addSeatToRow);
    const removeSeatFromRow = useSeatMap((s) => s.removeSeatFromRow);


    const toggle = (section: string) => {
        setOpen(open === section ? null : section);
    };

    const handleExport = () => {
        if (!mapName) return;
        exportJSON(mapName, exportMap(mapName));
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) importJSON(file, importMap);
    };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                        borderRight: "1px solid #eaeaea",
                    },
                }}
            >
                <Toolbar sx={{ px: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        component="img"
                        src="/favicon.ico"
                        alt="SeatMap Icon"
                        sx={{ width: 40, height: 40, borderRadius: 25 }}
                    />
                    <Typography variant="h6" fontWeight={700}>
                        SeatMap Builder
                    </Typography>
                </Toolbar>

                <List
                    subheader={
                        <ListSubheader
                            component="div"
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                lineHeight: 1.5,
                                color: "grey.500",
                                letterSpacing: 0.5,
                            }}
                        >
                            TOOLS
                        </ListSubheader>
                    }
                    sx={{ px: 1 }}
                >
                    <ListItemButton onClick={() => toggle("add")}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Filas" />
                        {open === "add" ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open === "add"} timeout="auto" unmountOnExit>
                        <Stack spacing={1} sx={{ pl: 4, pr: 2, pb: 1 }}>
                            <Button variant="contained" size="small" onClick={() => addRow()}>
                                + Nueva fila
                            </Button>

                            {rows.map((row) => (
                                <RowItem
                                    key={row.id}
                                    row={row}
                                    onEdit={() => setEditRow(row)}
                                    onRemoveSeat={() => removeSeatFromRow(row.id)}
                                    onAddSeat={() => addSeatToRow(row.id)}
                                />
                            ))}

                        </Stack>
                    </Collapse>

                    <ListItemButton onClick={() => toggle("export")}>
                        <ListItemIcon>
                            <SaveAltOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Exportar" />
                        {open === "export" ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open === "export"} timeout="auto" unmountOnExit>
                        <Stack spacing={1} sx={{ pl: 4, pr: 2, pb: 1 }}>
                            <TextField
                                size="small"
                                label="Nombre del mapa"
                                value={mapName}
                                onChange={(e) => setMapName(e.target.value)}
                            />
                            <Button variant="contained" size="small" onClick={handleExport}>
                                Extraer JSON
                            </Button>
                        </Stack>
                    </Collapse>

                    <ListItemButton>
                        <ListItemIcon>
                            <RestorePageOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <label style={{ cursor: "pointer", width: "100%" }}>
                            <input
                                type="file"
                                accept="application/json"
                                style={{ display: "none" }}
                                onChange={handleImport}
                            />
                            <ListItemText primary="Importar" />
                        </label>
                    </ListItemButton>

                    {/* Nuevo mapa */}
                    <ListItemButton onClick={reset}>
                        <ListItemIcon>
                            <RestartAltOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Nuevo mapa" />
                    </ListItemButton>

                    <ListItemButton disabled={rows.length === 0} onClick={() => useSeatMap.getState().startDraftSeat()}>
                        <ListItemIcon>
                            <AddLocationAltIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Asiento nuevo" />
                    </ListItemButton>
                </List>
            </Drawer>

            <Dialog open={!!editRow} onClose={() => setEditRow(null)} fullWidth>
                <DialogTitle>Editar fila: {editRow?.label}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Nombre de fila"
                            value={editRow?.label || ""}
                            onChange={(e) =>
                                setEditRow((prev) => prev ? { ...prev, label: e.target.value } : null)
                            }
                        />
                        <TextField
                            fullWidth
                            label="Prefijo de asientos"
                            value={editRow?.seatPrefix || ""}
                            onChange={(e) =>
                                setEditRow((prev) =>
                                    prev ? { ...prev, seatPrefix: e.target.value } : null
                                )
                            }
                        />
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2">Color:</Typography>
                            <input
                                type="color"
                                value={editRow?.color || "#bdbdbd"}
                                onChange={(e) =>
                                    setEditRow((prev) =>
                                        prev ? { ...prev, color: e.target.value } : null
                                    )
                                }
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditRow(null)}>Cancelar</Button>
                    <Button
                        color="error"
                        onClick={() => {
                            if (editRow) removeRow(editRow.id);
                            setEditRow(null);
                        }}
                    >
                        Eliminar fila
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (editRow) {
                                useSeatMap.getState().renameRow(
                                    editRow.id,
                                    editRow.label,
                                    editRow.color
                                );
                                useSeatMap.getState().renameRowSeats(
                                    editRow.id,
                                    editRow.seatPrefix || ""
                                );
                            }
                            setEditRow(null);
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
