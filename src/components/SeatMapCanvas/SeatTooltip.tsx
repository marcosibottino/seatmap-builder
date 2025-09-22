import { Label, Tag, Text } from "react-konva";
import { Seat, Row } from "@/lib/seatmap";

export function SeatTooltip({ seat, row }: { seat: Seat; row: Row }) {
  return (
    <Label x={seat.x + 12} y={seat.y - 12}>
      <Tag fill="black" opacity={0.7} />
      <Text
        text={`Fila: ${row.label}\nAsiento: ${seat.label}`}
        fontSize={12}
        fill="white"
        padding={4}
      />
    </Label>
  );
}
