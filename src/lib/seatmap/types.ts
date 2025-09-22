export type Seat = {
  id: string;
  label: string;
  rowId: string;
  x: number;
  y: number;
  color: string;
};

export type DraftSeat = {
  id: string;
  x: number;
  y: number;
};

export type Row = {
  id: string;
  label: string;
  seatIds: string[];
  color: string;
  seatPrefix?: string;
};

export type SeatMapState = {
  rows: Row[];
  seats: Record<string, Seat>;
  selectedSeatIds: string[];
  selectedRowIds: string[];

  addRow: () => string;
  removeRow: (rowId: string) => void;

  toggleSeatSelection: (seatId: string) => void;
  toggleRowSelection: (rowId: string) => void;
  clearSelection: () => void;
  reset: () => void;
  removeSelection: () => void;

  renameRow: (rowId: string, newLabel: string, newColor: string) => void;
  renameRowSeats: (rowId: string, prefix: string) => void;
  renameSelectedSeats: (prefix: string) => void;

  exportMap: (nombreMapa: string) => string;
  importMap: (data: any) => void;
  generateOvalMap: (centerX: number, centerY: number) => void;

  addSeatToRow: (rowId: string) => void;
  removeSeatFromRow: (rowId: string) => void;
  recolorSeats: (color: string) => void;
  moveSeatsToRow: (targetRowId: string) => void;

  draftSeat: DraftSeat | null;
  startDraftSeat: () => void;
  updateDraftSeat: (x: number, y: number) => void;
  confirmDraftSeat: () => void;
  cancelDraftSeat: () => void;
};
