import Sidebar from "@/components/Sidebar/Sidebar";
import SeatMapCanvas from "@/components/SeatMapCanvas/SeatMapCanvas";
import RightSidebar from "@/components/Sidebar/RightSidebar";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <SeatMapCanvas />
      </Box>
      <RightSidebar />
    </Box>
  );
}
