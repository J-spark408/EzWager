import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
} from "@mui/joy";

export const API =
  import.meta.env.VITE_API_URL || "https://96e1ba4d28b6.ngrok-free.app/";

const ForgotPinModal = ({ open, onClose, initialEmail = "" }) => {
  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  const isEmailValid = (val) =>
    /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})*$/.test(val.trim());

  useEffect(() => {
    if (!open) {
      setEmail((initialEmail || "").trim().toLowerCase());
      setSending(false);
      setDone(false);
      setError("");
      setCooldown(0);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [open, initialEmail]);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setCooldown((c) => (c > 0 ? c - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [cooldown]);

  const handleSend = async () => {
    setError("");
    setDone(false);

    const normalizedEmail = email.trim().toLowerCase();
    if (!isEmailValid(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (cooldown > 0) return;

    setSending(true);

    try {
      const res = await fetch(`${API}/api/forgot-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const text = await res.text();

      if (res.status === 404) {
        setError("We couldn't find that email. Please check and try again.");
      } else if (res.status === 429) {
        const data = JSON.parse(text || "{}");
        const match = (data.error || "").match(/(\d+)\s*seconds/i);
        const seconds = match ? parseInt(match[1], 10) : 60;
        setCooldown(seconds);
        setError(`Please wait a moment before sending again.`);
      } else if (!res.ok) {
        setError("Something went wrong. Please try again.");
      } else {
        setDone(true);
        setCooldown(60); // client cooldown after success
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>Forgot your PIN?</DialogTitle>
        <DialogContent>
          Enter your registered email. If it’s on file, we’ll email the PIN.
        </DialogContent>

        <FormControl sx={{ mt: 1 }}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{ input: { autoComplete: "email" } }}
          />
        </FormControl>

        {error && (
          <Alert color="danger" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
        {done && (
          <Alert color="success" sx={{ mt: 1 }}>
            If the email is registered, the PIN has been sent.
          </Alert>
        )}

        <DialogActions>
          <Button variant="plain" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={sending || cooldown > 0}
          >
            {sending ? (
              <CircularProgress size="sm" />
            ) : cooldown > 0 ? (
              `Send again in ${cooldown}s`
            ) : (
              "Send PIN"
            )}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ForgotPinModal;
