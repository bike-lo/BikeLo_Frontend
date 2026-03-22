import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPasswordApi } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Timer logic for resend cooldown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await forgotPasswordApi({ email });
      setIsSubmitted(true);
      setResendTimer(60); // Start 60-second cooldown
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setError("");
    setIsSubmitting(true);
    try {
      await forgotPasswordApi({ email });
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("").trim();
    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError("");
    setIsVerifying(true);
    try {
      // Import needed from authService: verifyOtpApi, resetPasswordApi
      const { verifyOtpApi } = await import("@/services/authService");
      await verifyOtpApi(email, code);
      setIsVerified(true);
      setError("");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsResetting(true);
    try {
      const { resetPasswordApi } = await import("@/services/authService");
      const token = digits.join("").trim(); // Assuming OTP is used as the token
      await resetPasswordApi({ token, new_password: newPassword });
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsResetting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-transparent">
      <motion.div
        className="w-full max-w-[450px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-2xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
          <CardContent className="p-8 sm:p-10">
            {/* Back to Login Link */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#f7931e] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1
                      className="text-3xl font-black mb-2 text-black dark:text-white"
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      Forgot Password
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Enter your email address and we'll send you an OTP to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitEmail} className="space-y-4">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-black dark:text-white font-bold">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="h-12 bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:border-[#f7931e]/50 focus:ring-[#f7931e]/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-black uppercase tracking-widest bg-[#f7931e] hover:bg-[#e6851a] text-white rounded-lg shadow-lg shadow-orange-500/20 transition-all"
                      disabled={isSubmitting}
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {isSubmitting ? "Sending..." : "Send OTP"}
                    </Button>
                  </form>
                </motion.div>
              ) : !isVerified ? (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="w-16 h-16 bg-[#f7931e]/10 text-[#f7931e] rounded-full flex items-center justify-center mx-auto mb-6">
                    <MailCheck className="w-8 h-8" />
                  </div>
                  
                  <h2
                    className="text-2xl font-black text-black dark:text-white"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    Enter OTP
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[280px] mx-auto">
                    We've sent a 6-digit OTP to <span className="font-bold text-black dark:text-white">{email}</span>
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm text-left"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex gap-2 justify-center">
                      {digits.map((d, i) => (
                        <input
                          key={i}
                          id={`otp-input-${i}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          className="w-12 h-12 text-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-lg focus:outline-none focus:border-[#f7931e] focus:ring-1 focus:ring-[#f7931e]"
                          value={d}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").slice(0, 1);
                            const next = [...digits];
                            next[i] = v;
                            setDigits(next);
                            if (v && i < 5) {
                              document.getElementById(`otp-input-${i + 1}`)?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace") {
                              if (digits[i]) {
                                const next = [...digits];
                                next[i] = "";
                                setDigits(next);
                              } else if (i > 0) {
                                document.getElementById(`otp-input-${i - 1}`)?.focus();
                                const next = [...digits];
                                next[i - 1] = "";
                                setDigits(next);
                              }
                            } else if (e.key === "ArrowLeft" && i > 0) {
                              document.getElementById(`otp-input-${i - 1}`)?.focus();
                            } else if (e.key === "ArrowRight" && i < 5) {
                              document.getElementById(`otp-input-${i + 1}`)?.focus();
                            }
                          }}
                          onPaste={(e) => {
                            const paste = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
                            if (paste.length) {
                              const next = new Array(6).fill("");
                              for (let j = 0; j < paste.length; j++) next[j] = paste[j];
                              setDigits(next);
                              const focusIndex = Math.min(paste.length, 5);
                              setTimeout(() => document.getElementById(`otp-input-${focusIndex}`)?.focus(), 0);
                              e.preventDefault();
                            }
                          }}
                        />
                      ))}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-black uppercase tracking-widest bg-[#f7931e] hover:bg-[#e6851a] text-white rounded-lg shadow-lg shadow-orange-500/20 transition-all"
                      disabled={isVerifying}
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {isVerifying ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </form>

                  <div className="pt-2 text-sm text-neutral-500">
                    Didn't receive the email?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendTimer > 0 || isSubmitting}
                      className="font-bold hover:text-[#f7931e] transition-colors disabled:opacity-50 disabled:hover:text-neutral-500"
                    >
                      {isSubmitting 
                        ? "Sending..." 
                        : resendTimer > 0 
                          ? `Resend in ${resendTimer}s` 
                          : "Resend OTP"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reset-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1
                      className="text-3xl font-black mb-2 text-black dark:text-white"
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      Reset Password
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Enter your new password below to regain access.
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-black dark:text-white font-bold">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isResetting}
                        className="h-12 bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:border-[#f7931e]/50 focus:ring-[#f7931e]/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-black dark:text-white font-bold">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isResetting}
                        className="h-12 bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:border-[#f7931e]/50 focus:ring-[#f7931e]/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-black uppercase tracking-widest bg-[#f7931e] hover:bg-[#e6851a] text-white rounded-lg shadow-lg shadow-orange-500/20 transition-all"
                      disabled={isResetting}
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {isResetting ? "Resetting..." : "Reset Password"}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
