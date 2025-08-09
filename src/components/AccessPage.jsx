import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
  Input,
  Button,
  Alert,
  CircularProgress,
} from "@mui/joy";
import ForgotPinModal from "./ForgotPinModal";

export const API = import.meta.env.VITE_API_URL || "https://96e1ba4d28b6.ngrok-free.app/";

const AccessPage = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (val) =>
    /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})*$/.test(val.trim());

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    const authTime = localStorage.getItem("authTime");
    const THIRTY_MINS = 1 * 60 * 1000;

    const expired =
      !authTime || Date.now() - parseInt(authTime, 10) > THIRTY_MINS;

    if (isAuthenticated && !expired) {
      navigate("/upload");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    if (!isEmailValid(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/check-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: normalizedEmail,
          pin,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const now = Date.now();
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("authTime", now.toString());
        localStorage.setItem("email", normalizedEmail);
        navigate("/upload");
      } else {
        setError("Email and PIN do not match. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try later.");
    } finally {
      setLoading(false);
    }
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
          maxWidth: 360,
          width: "100%",
          p: 3,
          borderRadius: "lg",
          boxShadow: "md",
        }}
      >
        <Typography level="h4" sx={{ mb: 2, textAlign: "center" }}>
          Access Your EzWage
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailErr) setEmailErr("");
              }}
              slotProps={{
                input: {
                  style: { textAlign: "center" },
                  pattern:
                    "^[^\\s@]+@[^\\s@]+\\.[A-Za-z]{2,}(?:\\.[A-Za-z]{2,})*$",
                  autoComplete: "email",
                },
              }}
              placeholder="you@company.com"
              type="email"
              size="lg"
            />
            {emailErr && <FormHelperText>{emailErr}</FormHelperText>}
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>PIN</FormLabel>
            <Input
              type="password"
              placeholder="********"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              size="lg"
              slotProps={{
                input: {
                  maxLength: 10,
                  style: { textAlign: "center", letterSpacing: "0.35em" },
                },
              }}
            />
          </FormControl>

          {error && (
            <Alert color="danger" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            color="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size="sm" color="neutral" />
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            variant="none"
            size="sm"
            sx={{ mt: 2, display: "flex", justifySelf: "center" }}
            onClick={() => setForgotOpen(true)}
          >
            Forgot PIN?
          </Button>

          <ForgotPinModal
            open={forgotOpen}
            onClose={() => setForgotOpen(false)}
            initialEmail={email}
          />
        </form>
      </Card>
    </Box>
  );
};

export default AccessPage;
