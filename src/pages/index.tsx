import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Link2,
  Smartphone,
  Globe,
  Check,
  Zap,
  Shield,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const Index = () => {
  const { user } = useAuth();

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for testing and small projects",
      features: [
        "100 links per month",
        "Basic analytics",
        "Standard support",
        "1 project",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "Unlimited links",
        "Advanced analytics",
        "Priority support",
        "10 projects",
        "Custom domains",
        "Team collaboration",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale operations",
      features: [
        "Unlimited everything",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "API access",
      ],
      highlighted: false,
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Configure Your App",
      description:
        "Enter your iOS and Android app details, including bundle IDs and store URLs.",
    },
    {
      step: "02",
      title: "Create Deep Link",
      description:
        "Specify your deep link path and fallback URLs for web users.",
    },
    {
      step: "03",
      title: "Share & Track",
      description:
        "Get your smart link and track performance across all platforms.",
    },
  ];

  const faqs = [
    {
      question: "What is a deep link?",
      answer:
        "A deep link is a URL that directs users to a specific location within your mobile app, rather than just opening the app's home screen. It provides a seamless user experience by taking users exactly where they need to go.",
    },
    {
      question: "How do universal links work?",
      answer:
        "Universal links work by detecting the user's device and app installation status. If the app is installed, it opens directly to the specified content. If not, users are redirected to a web page or app store.",
    },
    {
      question: "Can I use custom domains?",
      answer:
        "Yes! Pro and Enterprise plans support custom domains. You can use your own branded domain for all your deep links, enhancing trust and brand recognition.",
    },
    {
      question: "What analytics are available?",
      answer:
        "We provide comprehensive analytics including click counts, device breakdown, geographic data, conversion rates, and more. Pro plans get access to advanced analytics with custom date ranges and exports.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes, our Enterprise plan includes full API access, allowing you to programmatically create and manage deep links, retrieve analytics, and integrate with your existing systems.",
    },
  ];

  const stats = [
    { value: "10M+", label: "Links Created" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries" },
    { value: "5000+", label: "Happy Users" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl text-foreground">DeepLink</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="btn-generate px-6 py-2.5 text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link href="/auth" className="btn-generate px-6 py-2.5 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Deep Link Generator
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            Create Smart Links
            <br />
            <span className="text-primary">That Just Work</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10">
            Generate powerful deep links that work seamlessly across iOS,
            Android, and Web platforms. One link, every platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="btn-generate inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="btn-generate inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
                >
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-2xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all duration-200 text-lg"
                >
                  See How It Works
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-4 py-24"
      >
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features to create, manage, and track your deep links
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          <div className="glass-card rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Link2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Universal Links
            </h3>
            <p className="text-muted-foreground">
              One link that works across all platforms with smart routing and
              detection
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Smartphone className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Mobile Ready
            </h3>
            <p className="text-muted-foreground">
              Deep link directly into your iOS and Android apps with fallback
              support
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Web Fallback
            </h3>
            <p className="text-muted-foreground">
              Graceful fallback to web when app isn't installed on user's device
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Analytics
            </h3>
            <p className="text-muted-foreground">
              Track clicks, conversions, and user behavior with detailed
              insights
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Secure & Reliable
            </h3>
            <p className="text-muted-foreground">
              Enterprise-grade security with 99.9% uptime guarantee
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Lightning Fast
            </h3>
            <p className="text-muted-foreground">
              Links resolve in milliseconds with our global CDN infrastructure
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative z-10 max-w-7xl mx-auto px-4 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create your first deep link in under 2 minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((item, index) => (
            <div key={index} className="relative">
              <div className="glass-card rounded-2xl p-8 h-full">
                <div className="text-6xl font-bold text-primary/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
              {index < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary/30">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative z-10 max-w-7xl mx-auto px-4 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground scale-105 shadow-2xl shadow-primary/25"
                  : "glass-card"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span
                  className={`text-4xl font-bold ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={
                      plan.highlighted
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  >
                    {plan.period}
                  </span>
                )}
              </div>
              <p
                className={`mb-6 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`}
                    />
                    <span
                      className={
                        plan.highlighted
                          ? "text-primary-foreground/90"
                          : "text-foreground"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Got questions? We've got answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card rounded-2xl px-6 border-none"
            >
              <AccordionTrigger className="text-left text-foreground hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Join thousands of developers using our deep links to deliver
              better mobile experiences.
            </p>
            <Link
              href="/auth"
              className="btn-generate inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              Create Your First Link
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 py-12 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-foreground">DeepLink</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Universal deep links for iOS, Android & Web
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
          © 2026 DeepLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
