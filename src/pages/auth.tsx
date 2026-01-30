import { useState, forwardRef, InputHTMLAttributes, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { useToast } from "../hooks/use-toast";

// ==================== VALIDATION SCHEMAS ====================
const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

// ==================== FORM INPUT COMPONENT ====================
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  dark?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, dark = false, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="mb-5 group">
        <label
          className={cn(
            "block text-sm font-medium mb-2 transition-colors duration-200",
            dark
              ? "text-white/70 group-focus-within:text-white"
              : "text-muted-foreground group-focus-within:text-primary",
          )}
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-200",
                dark ? "text-white/40" : "text-muted-foreground/60",
              )}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              dark ? "input-underline-dark" : "input-underline",
              icon && "pl-7",
              isPassword && "pr-10",
              error && (dark ? "border-red-400" : "border-destructive"),
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 p-1 transition-colors",
                dark
                  ? "text-white/40 hover:text-white/60"
                  : "text-muted-foreground/60 hover:text-muted-foreground",
              )}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className={dark ? "error-text-dark" : "error-text"}>{error}</p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

// ==================== MAIN AUTH PAGE ====================
const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    console.log("AUTH USER:", user);
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = async (data: SignInFormData) => {
    setLoading(true);
    const { error } = await signIn(data.email, data.password);
    setLoading(false);

    if (error) {
      toast({
        title: "Sign in failed",
        description:
          error.message === "Invalid login credentials"
            ? "Invalid email or password. Please try again."
            : error.message,
        variant: "destructive",
      });
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setLoading(false);

    if (error) {
      let message = error.message;
      if (error.message.includes("already registered")) {
        message =
          "An account with this email already exists. Please sign in instead.";
      }
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "You can now sign in with your credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center mb-10 relative z-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Deep Link Generator
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          {isSignUp
            ? "Join us and start creating powerful deep links"
            : "Sign in to manage your deep links"}
        </p>
      </div>

      {/* Auth Card */}
      <div className="max-w-lg w-full glass-card rounded-3xl overflow-hidden relative z-10 animate-slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Form Panel */}
          <div
            className={cn(
              "p-8 md:p-10 transition-all duration-500",
              isSignUp ? "order-2 lg:order-1" : "order-1",
            )}
          >
            {isSignUp ? (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                <FormInput
                  label="Full Name"
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  error={signUpForm.formState.errors.fullName?.message}
                  {...signUpForm.register("fullName")}
                />
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  error={signUpForm.formState.errors.email?.message}
                  {...signUpForm.register("email")}
                />
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={signUpForm.formState.errors.password?.message}
                  {...signUpForm.register("password")}
                />
                <FormInput
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={signUpForm.formState.errors.confirmPassword?.message}
                  {...signUpForm.register("confirmPassword")}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-generate mt-4 w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  error={signInForm.formState.errors.email?.message}
                  {...signInForm.register("email")}
                />
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={signInForm.formState.errors.password?.message}
                  {...signInForm.register("password")}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-generate mt-6 w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Toggle Panel */}
          <div
            className={cn(
              "p-8 md:p-10 gradient-panel-dark text-white relative overflow-hidden flex flex-col justify-center items-center text-center transition-all duration-500",
              isSignUp ? "order-1 lg:order-2" : "order-2",
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                {isSignUp ? "Already have an account?" : "New here?"}
              </h3>
              <p className="text-white/70 mb-6">
                {isSignUp
                  ? "Sign in to access your dashboard and manage your deep links"
                  : "Create an account to get started with smart deep links"}
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="px-8 py-3 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground relative z-10">
        Universal deep links for iOS, Android & Web
      </p>
    </div>
  );
};

export default Auth;
