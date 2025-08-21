import React from "react";
import { Box, TextField, Typography } from "@mui/material";

const FileInput = ({ setDateLoss, setClaimNumber }) => {
  return (
    <Box display="grid" gap={1.25}>
      <Typography>Claim # (optional):</Typography>
      <TextField
        size="small"
        onChange={(e) => {
          const upper = e.target.value.toUpperCase();
          setClaimNumber(upper);
        }}
        inputProps={{ maxLength: 10 }}
        sx={{ "& input": { textTransform: "uppercase" } }}
      />

      <Typography>Date of Loss (optional):</Typography>
      <TextField
        size="small"
        onChange={(e) => {
          setDateLoss(e.target.value);
        }}
        inputProps={{ inputMode: "numeric", maxLength: 10 }}
      />
    </Box>
  );
};

export default FileInput;
