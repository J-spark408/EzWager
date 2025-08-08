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

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    const email = localStorage.getItem("email");
    const authTime = localStorage.getItem("authTime");

    const THIRTY_MINUTES = 1 * 60 * 1000; // 30 mins
    const expired =
      !authTime || Date.now() - parseInt(authTime, 10) > THIRTY_MINUTES;

    if (!isAuthenticated || expired || !email) {
      // Clear expired values
      localStorage.removeItem("authenticated");
      localStorage.removeItem("authTime");
      localStorage.removeItem("email");
      navigate("/"); // Redirect to PIN page
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const clearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        let msg = "Something went wrong.";
        try {
          const data = await response.json();
          if (data?.error) msg = data.error;
        } catch (_) {}
        setError(msg);
        return;
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const links = doc.querySelectorAll("a");

      const allLinks = Array.from(links).map((link) => ({
        href: link.href,
        text: link.textContent,
      }));

      // Separate file links from "Upload another"
      const fileLinks = allLinks.filter(
        (l) => !l.text.includes("Upload another")
      );
      const uploadLink = allLinks.find((l) =>
        l.text.includes("Upload another")
      );

      setResult({ fileLinks, uploadLink });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      clearFile();
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main>
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
                    border: error ? "2px solid #ef4444" : "2px solid grey", // 🔴 when error
                    backgroundColor: error
                      ? "rgba(239,68,68,0.05)"
                      : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        component="label"
                        variant="solid"
                        size="md"
                        startDecorator={<UploadRounded />}
                        sx={{
                          px: 2.25,
                          borderRadius: "md",
                          fontWeight: 600,
                        }}
                      >
                        Choose File
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="html_file"
                          hidden
                          accept=".html"
                          onChange={handleFileChange}
                          onClick={(e) => {
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
                              maxWidth: 320, // control width of chip
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
                              onClick={() => setFile(null)}
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

                    {/* Helper text */}
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
            <ul>
              {result.fileLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
            {result.uploadLink && (
              <div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    resetForm();
                  }}
                  className="upload-another"
                >
                  {result.uploadLink.text}
                </a>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </main>
  );
};

export default FileUploader;
