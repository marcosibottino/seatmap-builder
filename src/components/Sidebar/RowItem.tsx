// components/RowItem.tsx
import { Stack, IconButton, Typography, Box } from "@mui/material";
import { Remove as RemoveIcon, Add as AddIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Row } from "@/lib/seatmap";

type RowItemProps = {
  row: Row;
  onEdit: () => void;
  onRemoveSeat: () => void;
  onAddSeat: () => void;
};

export default function RowItem({ row, onEdit, onRemoveSeat, onAddSeat }: RowItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ background: "#f9f9f9", p: 1, borderRadius: 1 }}>
      <Stack sx={{ flex: 1, cursor: "pointer" }} onClick={onEdit}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: row.color || "#bdbdbd",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <Typography variant="body2">{row.label} ({row.seatIds.length})</Typography>
        {row.seatPrefix && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            Prefijo asientos: {row.seatPrefix}
          </Typography>
        )}
      </Stack>
      <IconButton size="small" onClick={onRemoveSeat} disabled={row.seatIds.length === 0}>
        <RemoveIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onAddSeat} disabled={row.seatIds.length >= 25}>
        <AddIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onEdit}>
        <SettingsIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
