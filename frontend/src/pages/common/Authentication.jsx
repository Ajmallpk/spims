import { AuthForm } from "@/components/common/AuthForm"
import { Shield, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

export default function AuthPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 40%, #0a1628 70%, #071020 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background effects */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      }}>
        {/* Large soft glow top-left */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: "55vw", height: "55vw",
          background: "radial-gradient(circle, rgba(0,163,255,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        {/* Glow bottom-right */}
        <div style={{
          position: "absolute", bottom: "-15%", right: "-10%",
          width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(0,210,180,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
        {/* Diagonal accent line */}
        <div style={{
          position: "absolute", top: 0, right: "28%",
          width: "1px", height: "100%",
          background: "linear-gradient(180deg, transparent, rgba(0,163,255,0.12) 30%, rgba(0,210,180,0.08) 70%, transparent)",
        }} />
      </div>

      {/* Minimal header */}
      <header style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        background: "rgba(10,15,30,0.4)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          {/* Logo mark */}
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #00a3ff, #00d2b4)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(0,163,255,0.4)",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "-0.5px" }}>SP</span>
          </div>
          <div>
            <div style={{
              color: "#e8f0ff",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              SPIMS
            </div>
            <div style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: 10,
              letterSpacing: "0.05em",
            }}>
              Smart Panchayath Issue Mgmt
            </div>
          </div>
        </div>

        <Link
          to="/"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.04)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.85)"
            ;e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
            ;e.currentTarget.style.background = "rgba(255,255,255,0.08)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)"
            ;e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
            ;e.currentTarget.style.background = "rgba(255,255,255,0.04)"
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </header>

      {/* Auth content area */}
      <main style={{
        position: "relative", zIndex: 10,
        display: "flex",
        minHeight: "calc(100vh - 73px)",
      }}>
        {/* Left panel – decorative */}
        <div style={{
          flex: "0 0 42%",
          padding: "60px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(0,163,255,0.08)",
              border: "1px solid rgba(0,163,255,0.2)",
              borderRadius: 100,
              marginBottom: 20,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#00d2b4",
                boxShadow: "0 0 8px #00d2b4",
              }} />
              <span style={{ color: "#00d2b4", fontSize: 11, letterSpacing: "0.08em", fontWeight: 600 }}>
                GOVERNMENT DIGITAL PLATFORM
              </span>
            </div>
            <h1 style={{
              color: "#e8f0ff",
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
            }}>
              Empowering<br />
              <span style={{
                background: "linear-gradient(90deg, #00a3ff, #00d2b4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Civic Governance
              </span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
              lineHeight: 1.7,
              maxWidth: 340,
              margin: 0,
            }}>
              A unified platform for citizens and officials to raise, track, and resolve Panchayath-level issues transparently.
            </p>
          </div>

          {/* Feature pills */}
          {[
            { icon: "⚡", label: "Real-time issue tracking" },
            { icon: "🗺️", label: "Geo-tagged complaints" },
            { icon: "📊", label: "Analytics dashboard" },
          ].map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              color: "rgba(255,255,255,0.65)",
              fontSize: 13,
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          width: 1,
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)",
          margin: "40px 0",
        }} />

        {/* Right panel – form */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 56px",
        }}>
          <div style={{
            width: "100%",
            maxWidth: 420,
          }}>
            {/* Card */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "36px 32px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}>
              <AuthForm />
            </div>

            {/* Trust indicators */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              marginTop: 20,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "rgba(255,255,255,0.35)", fontSize: 12,
              }}>
                <Shield size={13} style={{ color: "#00a3ff" }} />
                Secure &amp; Encrypted
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "rgba(255,255,255,0.35)", fontSize: 12,
              }}>
                <ShieldCheck size={13} style={{ color: "#00d2b4" }} />
                Government Certified
              </div>
            </div>

            {/* Legal */}
            <p style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.25)",
              fontSize: 11.5,
              marginTop: 16,
              lineHeight: 1.6,
            }}>
              {"By signing in, you agree to the "}
              <Link to="/terms" style={{ color: "rgba(0,163,255,0.7)", textDecoration: "none" }}>
                Terms of Service
              </Link>
              {" and "}
              <Link to="/privacy" style={{ color: "rgba(0,163,255,0.7)", textDecoration: "none" }}>
                Privacy Policy
              </Link>
              {" of SPIMS."}
            </p>
          </div>
        </div>
      </main>

      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}