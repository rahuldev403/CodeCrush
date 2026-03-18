import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendOtp, verifyRegistration } from "@/api/auth";

const VerifyRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = useMemo(() => {
    const emailFromState = location.state?.email;
    return typeof emailFromState === "string" ? emailFromState : "";
  }, [location.state]);

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await verifyRegistration({ email, otp });
      setSuccess("Email verified successfully. Redirecting...");
      setTimeout(() => navigate("/onboarding"), 700);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    setIsResending(true);

    try {
      await resendOtp({ email, purpose: "signup" });
      setSuccess("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      description="Enter the OTP sent to your inbox to complete registration."
      footer={
        <p className="font-mono text-sm text-muted-foreground">
          Already verified?{" "}
          <Link
            className="border-b-2 border-primary font-bold text-primary hover:bg-primary/10"
            to="/login"
          >
            Sign in →
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleVerify}>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-mono font-bold text-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="border-4 border-border font-mono shadow-md"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp" className="font-mono font-bold text-foreground">
            OTP
          </Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="6-digit code"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            required
            className="border-4 border-border font-mono tracking-[0.25em] text-center shadow-md"
          />
        </div>

        {error ? (
          <div className="border-4 border-destructive bg-destructive/10 p-3 font-mono text-sm text-destructive shadow-lg">
            ⚠ {error}
          </div>
        ) : null}

        {success ? (
          <div className="border-4 border-primary bg-primary/10 p-3 font-mono text-sm text-primary shadow-lg">
            ✓ {success}
          </div>
        ) : null}

        <Button
          className="w-full border-4 border-border font-mono text-base font-bold shadow-lg hover:shadow-xl hover:translate-x-[-1px] hover:translate-y-[-1px]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify and continue →"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleResend}
          disabled={isResending || isSubmitting}
          className="w-full border-4 border-border font-mono text-base font-bold shadow-lg hover:shadow-xl hover:translate-x-[-1px] hover:translate-y-[-1px]"
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default VerifyRegistration;
