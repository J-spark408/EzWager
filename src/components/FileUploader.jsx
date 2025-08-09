import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  FormLabel,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import {
  CloseRounded,
  DescriptionRounded,
  UploadRounded,
} from "@mui/icons-material";
import "../assets/FileResult.css";

export const API = import.meta.env.VITE_API_URL || import.meta.env.LOCAL_URL;

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { pdfUrl, excelUrl }
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    const email = localStorage.getItem("email");
    const authTime = localStorage.getItem("authTime");

    const ONE_MINUTE = 30 * 60 * 1000; // change back to 30 * 60 * 1000 later
    const expired =
      !authTime || Date.now() - parseInt(authTime, 10) > ONE_MINUTE;

    if (!isAuthenticated || expired || !email) {
      localStorage.removeItem("authenticated");
      localStorage.removeItem("authTime");
      localStorage.removeItem("email");
      navigate("/"); // Redirect to Access page
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to add ?inline=1 for inline-open (your backend treats presence of `inline` as inline)
  const inlineUrl = (url) =>
    url.includes("?") ? `${url}&inline=1` : `${url}?inline=1`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file before submitting.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("html_file", file);

    try {
      const response = await fetch(`${API}/`, {
        method: "POST",
        body: formData,
        credentials: "include", // keep if backend checks session
        headers: { Accept: "application/json" },
      });

      // Try to parse JSON either way so we can surface server messages
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "Something went wrong.");
        return;
      }

      // Expecting: { pdf_url, excel_url }
      const { pdf_url, excel_url } = data;
      if (!pdf_url && !excel_url) {
        setError("Server did not return file links. Please try again.");
        return;
      }

      setResult({
        pdfUrl: pdf_url || null,
        excelUrl: excel_url || null,
      });
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      clearFileInput();
      setFile(null);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
    setFile(null);
    clearFileInput();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          margin: "0 auto",
          padding: 3,
          borderRadius: "md",
          boxShadow: "lg",
          textAlign: "center",
        }}
      >
        <Typography level="h2" sx={{ mb: 2 }}>
          Quick Wage Processor
        </Typography>

        {result ? (
          <Typography level="h3" sx={{ mb: 2, color: "success.600" }}>
            ✅ Files Created
          </Typography>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={3} sx={{ mt: 2, px: 1, py: 2 }}>
              <Box sx={{ textAlign: "left" }}>
                <FormLabel
                  htmlFor="file"
                  sx={{
                    fontWeight: "500",
                    fontSize: "1.5rem",
                    mb: 3,
                    display: "block",
                  }}
                >
                  Upload Toast Payroll
                </FormLabel>

                <Box
                  className={shake ? "shake" : ""}
                  sx={{
                    width: "auto",
                    my: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    p: 2,
                    border: error ? "2px solid #ef4444" : "2px solid grey",
                    backgroundColor: error
                      ? "rgba(239,68,68,0.05)"
                      : "transparent",
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                        maxWidth: 350,
                      }}
                    >
                      <Button
                        component="label"
                        variant="solid"
                        size="md"
                        startDecorator={<UploadRounded />}
                        sx={{ px: 2.25, borderRadius: "md", fontWeight: 600 }}
                      >
                        Choose File
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="html_file"
                          hidden
                          accept=".html,.htm"
                          onChange={handleFileChange}
                          onClick={(e) => {
                            // allow re-selecting the same file
                            e.currentTarget.value = "";
                          }}
                        />
                      </Button>

                      {file ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Chip
                            variant="soft"
                            color="neutral"
                            startDecorator={
                              <DescriptionRounded fontSize="small" />
                            }
                            sx={{
                              maxWidth: 320,
                              "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              },
                            }}
                          >
                            {file.name}
                          </Chip>

                          <Tooltip title="Clear selected file">
                            <IconButton
                              variant="plain"
                              color="neutral"
                              onClick={() => {
                                setFile(null);
                                clearFileInput();
                              }}
                              sx={{ "--IconButton-size": "32px" }}
                            >
                              <CloseRounded />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography
                          level="body-sm"
                          sx={{ color: "text.tertiary" }}
                        >
                          No file chosen
                        </Typography>
                      )}
                    </Box>

                    <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                      Accepts <code>.html</code> files. Make sure it’s the
                      payroll export from Toast.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <CardActions sx={{ pt: 1 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  size="lg"
                  variant="solid"
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: "md",
                  }}
                >
                  {loading ? <CircularProgress size="sm" /> : "Submit"}
                </Button>
              </CardActions>
            </Stack>
          </form>
        )}

        {error && (
          <Alert color="danger" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <CardContent>
            <Stack spacing={2} sx={{ alignItems: "center" }}>
              {result.pdfUrl && (
                <Stack spacing={1} sx={{ width: "75%" }}>
                  <Button
                    component="a"
                    href={inlineUrl(result.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="lg"
                  >
                    📂 Open PDF
                  </Button>
                  <Button
                    component="a"
                    href={result.pdfUrl}
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="lg"
                  >
                    ⬇️ Download PDF
                  </Button>
                  <Button
                    component="a"
                    href={result.excelUrl}
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="lg"
                  >
                    ⬇️ Download Excel
                  </Button>
                </Stack>
              )}

              <Button
                onClick={resetForm}
                variant="solid"
                size="md"
                sx={{ mt: 2 }}
              >
                🔁 Upload another
              </Button>
            </Stack>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default FileUploader;
