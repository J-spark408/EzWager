import { Card, Typography } from "@mui/joy";
import FileUpload from "../FileUploader";

const UploadBoard = () => {
  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 3,
        borderRadius: "lg",
        boxShadow: "lg",
        textAlign: "center",
      }}
    >
      <Typography level="h2" sx={{ mb: 2 }}>
        Quick Wage Processor
      </Typography>
      <FileUpload />
    </Card>
  );
};

export default UploadBoard;
