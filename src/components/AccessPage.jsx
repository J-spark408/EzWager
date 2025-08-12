import React from "react";
import { Box } from "@mui/joy";
import AccessInput from "./AccessInput";

const AccessPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <AccessInput />
    </Box>
  );
};

export default AccessPage;
