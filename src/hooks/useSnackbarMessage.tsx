"use client";
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export function useSnackbarMessage() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const showMessage = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const SnackbarUI = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={2000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  return { showMessage, SnackbarUI };
}
