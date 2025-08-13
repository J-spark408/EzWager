import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const Step = ({ n, title, body, children }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Chip label={n} size="small" sx={{ fontWeight: 600 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        {body && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {body}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
}

const InstructionModal = ({ open, onClose }) => {
  const theme = React.useMemo(
    () =>
      createTheme({
        shape: { borderRadius: 2 },
        components: {
          MuiDialog: {
            styleOverrides: {
              paper: { borderRadius: 5 },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { textTransform: "none", borderRadius: 4, width: "25%" },
            },
          },
        },
      }),
    []
  );

  return (
    <Modal open={open} onClose={onClose}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog
          open={open}
          onClose={() => onClose}
          aria-labelledby="toast-payroll-instructions-title"
          keepMounted
        >
          <DialogTitle id="toast-payroll-instructions-title">
            Download the payroll report (Toast Payroll)
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <Step n={1} title="Login to Toast Payroll" />

              <Divider flexItem />

              <Step
                n={2}
                title="Search for the employee"
                body="On the employee's profile, click on the Pay History tab."
              />

              <Divider flexItem />

              <Step
                n={3}
                title="Run the report"
                body="Click Run Report, choose the date range, then hit View Report."
              >
                <Alert
                  icon={<HourglassBottomIcon fontSize="small" />}
                  severity="info"
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Wait a moment while it pulls out the report.
                </Alert>
              </Step>

              <Divider flexItem />

              <Step
                n={4}
                title="Save the page"
                body="Right‑click anywhere on the report and click ''Save As'', then save the file."
              />

              <Alert
                icon={<UploadFileIcon />}
                severity="success"
                sx={{ mt: 1 }}
              >
                Now you can upload this file!
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="contained" size="large">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </Modal>
  );
};

export default InstructionModal;
