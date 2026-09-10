// ============================================================
// SHANTI ENTERPRISES
// Unauthorized Page
// ============================================================

import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-page">

      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            SHANTI ENTERPRISES
          </span>

          <h1>
            Access Denied
          </h1>

          <p>
            You do not have permission to view this page.
          </p>
        </div>
      </div>

      <section className="card">
        <div
          style={{
            minHeight: "360px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px 20px",
          }}
        >

          {/* ==================================================
              ICON
              ================================================== */}

          <div
            style={{
              width: "72px",
              height: "72px",
              display: "grid",
              placeItems: "center",
              borderRadius: "20px",
              marginBottom: "20px",
              background:
                "linear-gradient(135deg, rgba(225,29,72,.12), rgba(245,158,11,.12))",
              color: "var(--danger)",
            }}
          >
            <ShieldAlert
              size={34}
              strokeWidth={1.8}
            />
          </div>

          {/* ==================================================
              403
              ================================================== */}

          <div
            style={{
              fontSize: "clamp(56px, 15vw, 96px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              background:
                "linear-gradient(135deg, #e11d48, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "14px",
            }}
          >
            403
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(20px, 5vw, 28px)",
              fontWeight: 800,
            }}
          >
            You do not have access to this page.
          </h2>

          <p
            style={{
              maxWidth: "480px",
              margin: "0 auto 24px",
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            {user
              ? "Your account role does not have permission to view this section. If you think this is a mistake, contact your administrator."
              : "You may need to sign in with an account that has the right permissions to view this page."}
          </p>

          {/* ==================================================
              ACTIONS
              ================================================== */}

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "360px",
            }}
          >

            <Link
              to="/"
              className="btn btn-primary"
            >
              <Home size={17} />
              Go to Home
            </Link>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleGoBack}
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}

export default UnauthorizedPage;