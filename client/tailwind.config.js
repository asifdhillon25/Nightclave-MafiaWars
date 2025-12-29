/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      /* =========================
         TYPOGRAPHY
      ========================= */
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace"],
      },

      /* =========================
         COLORS — AURORA TEAL
      ========================= */
      colors: {
        /* ---------- LIGHT MODE ---------- */
        light: {
          background: "#F8FBFA",       // Bright, clean, premium
          surface: "#FFFFFF",
          surfaceMuted: "#EEF6F4",

          textPrimary: "#0B1220",       // Deep neutral
          textSecondary: "#425466",
          textMuted: "#8B9BB0",

          primary: "#0EA5A4",           // Teal-cyan (modern)
          primaryHover: "#0B8C8B",

          accent: "#22D3EE",            // Aqua highlight
          accentSoft: "rgba(34,211,238,0.16)",

          border: "rgba(15,23,42,0.06)",

          success: "#16A34A",
          warning: "#F59E0B",
          error: "#EF4444",

          glass: "rgba(255,255,255,0.75)",
          glassBorder: "rgba(255,255,255,0.45)",
        },

        /* ---------- DARK MODE ---------- */
        dark: {
          background: "#050F14",        // Blue-green black
          surface: "#081A20",           // Deep teal slate
          surfaceMuted: "#0C2530",

          textPrimary: "#ECFEFF",       // Cyan-50
          textSecondary: "#A5F3FC",
          textMuted: "#67E8F9",

          primary: "#22D3EE",           // Cyan glow
          primaryHover: "#06B6D4",

          accent: "#5EEAD4",            // Mint-teal pop
          accentSoft: "rgba(94,234,212,0.18)",

          border: "rgba(165,243,252,0.18)",

          success: "#22C55E",
          warning: "#FACC15",
          error: "#F87171",

          glass: "rgba(8,26,32,0.72)",
          glassBorder: "rgba(94,234,212,0.28)",
        },
      },

      /* =========================
         GRADIENTS
      ========================= */
backgroundImage: {
  /* ---------- Sidebar gradients ---------- */
  "sidebar-gradient-light":
    "linear-gradient(180deg, rgba(16,185,129,0.45), rgba(5,150,105,0.25))",
  "sidebar-gradient-dark":
    "linear-gradient(180deg, rgba(6,95,70,0.85), rgba(16,185,129,0.35))",

  /* ---------- Accent / Highlight ---------- */
  "accent-gradient":
    "linear-gradient(135deg, #06B6D4, #059669)",

  /* ---------- Glass effect for cards ---------- */
  "glass-gradient-light":
    "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.45))",
  "glass-gradient-dark":
    "linear-gradient(180deg, rgba(11,31,24,0.75), rgba(16,185,129,0.35))",
},



      /* =========================
         RADIUS
      ========================= */
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
      },

      /* =========================
         SHADOWS — CLEAN & FLOATY
      ========================= */
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.04)",
        soft: "0 6px 18px rgba(6,182,212,0.10)",
        medium: "0 14px 36px rgba(6,182,212,0.16)",
        strong: "0 28px 64px rgba(6,182,212,0.22)",

        glass:
          "inset 0 1px 0 rgba(255,255,255,0.25), 0 18px 48px rgba(6,182,212,0.22)",
      },

      /* =========================
         BLUR (GLASS)
      ========================= */
      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px",
        lg: "20px",
      },

      /* =========================
         MOTION
      ========================= */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        normal: "240ms",
        slow: "400ms",
      },
    },
  },

  plugins: [],
};
