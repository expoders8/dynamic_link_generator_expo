import { useState, forwardRef, InputHTMLAttributes, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";

import { z } from "zod";
import {
  Loader2,
  Link2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  User,
  Trash2,
  MousePointerClick,
  Calendar,
  Plus,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";

interface LinkItem {
  id: number;
  shortId: string;
  deepLink: string;
  androidredirecturl: string;
  webRedirectUrl: string;
  clickCount: number;
  createdAt: string;

  project: {
    id: string;
    name: string;
    androidPkg: string;
    iosBundleId: string;
    userId: string;
  };
}

const deepLinkFormSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, "Project Name is required")
    .max(200, "Project Name must be less than 200 characters"),

  androidPkg: z
    .string()
    .trim()
    .min(1, "Android Package is required")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/,
      "Please enter a valid Android package (e.g., com.example.app)",
    ),

  iosBundleId: z
    .string()
    .trim()
    .min(1, "iOS Bundle ID is required")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_-]*(\.[a-zA-Z][a-zA-Z0-9_-]*)+$/,
      "Please enter a valid iOS Bundle ID (e.g., com.example.app)",
    ),

  iosredirecturl: z
    .string()
    .trim()
    .min(1, "iOS App Store URL is required")
    .url("Please enter a valid URL"),

  deepLink: z
    .string()
    .trim()
    .min(1, "Deep Link is required")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+$/,
      "Please enter a valid deep link (e.g., myapp://path)",
    ),

  webRedirectUrl: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  androidredirecturl: z
    .string()
    .trim()
    .min(1, "Android Redirect URL is required")
    .url("Please enter a valid URL"),
});

type DeepLinkFormData = z.infer<typeof deepLinkFormSchema>;

// ==================== FORM INPUT COMPONENT ====================
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  dark?: boolean;
  optional?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, dark = false, optional = false, className, ...props },
    ref,
  ) => {
    return (
      <div className="mb-6 group">
        <label
          className={cn(
            "block text-sm font-medium mb-2 transition-colors duration-200",
            dark
              ? "text-white/70 group-focus-within:text-white"
              : "text-muted-foreground group-focus-within:text-primary",
          )}
        >
          {label}
          {optional && (
            <span
              className={cn(
                "ml-2 text-xs font-normal",
                dark ? "text-white/40" : "text-muted-foreground/60",
              )}
            >
              (Optional)
            </span>
          )}
        </label>
        <input
          ref={ref}
          className={cn(
            dark ? "input-underline-dark" : "input-underline",
            error && (dark ? "border-red-400" : "border-destructive"),
            className,
          )}
          {...props}
        />
        {error && (
          <p className={dark ? "error-text-dark" : "error-text"}>{error}</p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

// ==================== RESPONSE INTERFACE ====================
interface LinkResponse {
  shortUrl: string;
  meta?: {
    title: string;
    description: string;
  };
}

// ==================== MAIN DASHBOARD COMPONENT ====================
const Dashboard = () => {
  const [response, setResponse] = useState<LinkResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const { user, signOut, loading: authLoading } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);
  useEffect(() => {
    if (!user) return;

    const loadLinks = async () => {
      try {
        const res = await fetch(`/api/links?userId=${user.id}`);
        const data = await res.json();
        setLinks(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLinksLoading(false);
      }
    };

    loadLinks();
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeepLinkFormData>({
    resolver: zodResolver(deepLinkFormSchema),
    defaultValues: {
      projectName: "",
      androidPkg: "",
      iosBundleId: "",
      iosredirecturl: "",
      deepLink: "",
      webRedirectUrl: "",
      androidredirecturl: "",
    },
  });

  const onSubmit = async (data: DeepLinkFormData) => {
    setFormLoading(true);
    const payload = {
      ...data,
      projectId: uuidv4(),
      userId: user!.id,
    };
    try {
      const res = await fetch(`/api/${payload.projectId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      setResponse(responseData);

      await loadLinks();

      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const loadLinks = async () => {
    if (!user) return;

    try {
      setLinksLoading(true);
      const res = await fetch(`/api/links?userId=${user.id}`);
      const data = await res.json();
      setLinks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLinksLoading(false);
    }
  };

  const handleCopy = async (url?: string) => {
    const urlToCopy = url || response?.shortUrl;
    if (urlToCopy) {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center px-4 py-8">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header with user info */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 relative z-10 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-semibold text-foreground">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Main Header */}
      <div className="text-center mb-10 relative z-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Deep Link Dashboard
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
          Your Smart Links
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Manage and track your deep links across all platforms
        </p>
      </div>

      {/* Stats Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10 animate-slide-up">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {links.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Links</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {
                    links.filter((l) => {
                      const created = new Date(l.createdAt);
                      const now = new Date();
                      const diffDays = Math.floor(
                        (now.getTime() - created.getTime()) /
                          (1000 * 60 * 60 * 24),
                      );
                      return diffDays <= 7;
                    }).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links Table */}
      <Card className="w-full max-w-6xl glass-card border-0 relative z-10 animate-slide-up mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Your Links</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Link
          </Button>
        </CardHeader>
        <CardContent>
          {linksLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No links yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first deep link to get started
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Link
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Short Id</TableHead>
                    <TableHead>Deep Link</TableHead>
                    <TableHead className="text-center">Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        {link!.project.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {link!.shortId}
                      </TableCell>
                      {/* <TableCell>
                        <a
                          href={`/${link.project.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm truncate max-w-[200px] block"
                        >
                          {link.deepLink}
                        </a>
                      </TableCell> */}
                      <TableCell>
                        <a
                          href={`/s/${link.shortId}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline truncate max-w-[180px] block"
                        >
                          {window.location.origin}/s/{link.shortId}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                          <MousePointerClick className="w-3 h-3" />
                          {link.clickCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(link.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleCopy(
                                `${window.location.origin}/s/${link.shortId}`,
                              )
                            }
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          </button>
                          {/* <button
                            onClick={() => handleDelete(link.id)}
                              disabled={deletingId === link.id}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            {deletingId === link.id ? (
                              <Loader2 className="w-4 h-4 text-destructive animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-destructive" />
                            )}
                          </button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Link Form (Collapsible) */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-5xl w-full glass-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 animate-slide-up mb-8"
        >
          {/* Left Panel - Project Info */}
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Project Information
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configure your app details
                </p>
              </div>
            </div>

            <FormInput
              label="Project Name"
              placeholder="My Awesome App"
              error={errors.projectName?.message}
              {...register("projectName")}
            />

            <FormInput
              label="Android Package"
              placeholder="com.example.myapp"
              error={errors.androidPkg?.message}
              {...register("androidPkg")}
            />

            <FormInput
              label="iOS Bundle ID"
              placeholder="com.example.myapp"
              error={errors.iosBundleId?.message}
              {...register("iosBundleId")}
            />

            <FormInput
              label="iOS App Store URL"
              placeholder="https://apps.apple.com/app/id123456789"
              error={errors.iosredirecturl?.message}
              {...register("iosredirecturl")}
            />
          </div>

          {/* Right Panel - Link Details */}
          <div className="p-8 md:p-10 gradient-panel-dark text-white relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Link Details
                  </h2>
                  <p className="text-sm text-white/60">
                    Set up your redirect URLs
                  </p>
                </div>
              </div>

              <FormInput
                dark
                label="Deep Link"
                placeholder="myapp://path/to/content"
                error={errors.deepLink?.message}
                {...register("deepLink")}
              />

              <FormInput
                dark
                optional
                label="Web Redirect URL"
                placeholder="https://example.com/fallback"
                error={errors.webRedirectUrl?.message}
                {...register("webRedirectUrl")}
              />

              <FormInput
                dark
                label="Android Redirect URL"
                placeholder="https://play.google.com/store/apps/details?id=com.example"
                error={errors.androidredirecturl?.message}
                {...register("androidredirecturl")}
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-white/10 text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-generate flex-1 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Response Card */}
      {/* {response && (
        <div className="max-w-5xl w-full mt-8 success-card relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {response.meta?.title || "Link Generated Successfully!"}
                </h3>
              </div>
              {response.meta?.description && (
                <p className="text-muted-foreground mb-4 ml-10">
                  {response.meta.description}
                </p>
              )}
              <div className="ml-10 p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Short URL</p>
                <a
                  href={response.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline break-all"
                >
                  {response.shortUrl}
                </a>
              </div>
            </div>
            <button
              onClick={() => handleCopy()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-primary/10 text-primary hover:bg-primary/20",
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )} */}

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground relative z-10">
        Universal deep links for iOS, Android & Web
      </p>
    </div>
  );
};

export default Dashboard;
