
import React, { useState } from "react";
import FinancialAnalysis from "./FinancialAnalysis.jsx";
import RiskPatterns from "./RiskPatterns.jsx";
import Recommendations from "./Recommendations.jsx";
import Reports from "./Reports.jsx";

import {
  LayoutDashboard,
  ChartNoAxesCombined,
  ShieldAlert,
  Lightbulb,
  FileText,
  Menu,
  ShieldCheck
} from "lucide-react";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Financial Analysis", icon: ChartNoAxesCombined },
  { name: "Risk Patterns", icon: ShieldAlert },
  { name: "Recommendations", icon: Lightbulb },
  { name: "Reports", icon: FileText }
];

export default function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);

  // Shared financial analysis result
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <ShieldCheck size={28} />
          <span>
            WealthGuard <strong>AI</strong>
          </span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(name);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Financial intelligence platform
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <Menu size={23} />
          </button>

          <span>WealthGuard / {activePage}</span>
          <span className="demo-badge">Demo workspace</span>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                FINANCIAL INTELLIGENCE
              </p>

              <h1>{activePage}</h1>

              <p className="page-description">
                Understand financial weaknesses, monitor key
                indicators, and make informed business decisions.
              </p>
            </div>
          </div>

          {activePage === "Overview" ? (
            <>
              <section className="welcome-card">
                <div>
                  <p className="eyebrow">
                    WELCOME TO WEALTHGUARD
                  </p>

                  <h2>
                    Understand your business finances.
                  </h2>

                  <p>
                    Identify financial warning signs and explore
                    practical actions before problems escalate.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() =>
                      setActivePage("Financial Analysis")
                    }
                  >
                    Start financial analysis
                  </button>
                </div>
              </section>

              <div className="section-heading">
                <h2>Your financial workspace</h2>
                <p>Choose where you would like to begin.</p>
              </div>

              <div className="feature-grid">
                {navigation.slice(1).map(
                  ({ name, icon: Icon }) => (
                    <button
                      className="feature-card"
                      key={name}
                      onClick={() => setActivePage(name)}
                    >
                      <div className="feature-icon">
                        <Icon size={22} />
                      </div>

                      <h3>{name}</h3>

                      <p>
                        {name === "Financial Analysis"
                          ? "Evaluate financial indicators and identify potential weaknesses."
                          : name === "Risk Patterns"
                          ? "Explore recurring financial warning signs."
                          : name === "Recommendations"
                          ? "Review preventive actions for financial problems."
                          : "Explore clear and understandable financial reports."}
                      </p>

                      <span className="card-link">
                        Explore →
                      </span>
                    </button>
                  )
                )}
              </div>
            </>
          ) : activePage === "Financial Analysis" ? (
            <FinancialAnalysis
              analysisResult={analysisResult}
              setAnalysisResult={setAnalysisResult}
            />
          ) : activePage === "Risk Patterns" ? (
            <RiskPatterns />
          ) : activePage === "Recommendations" ? (
  <Recommendations
    analysisResult={analysisResult}
  />
) : activePage === "Reports" ? (
  <Reports
    analysisResult={analysisResult}
  />
) : (
            <section className="placeholder-card">
              <div className="feature-icon">
                {React.createElement(
                  navigation.find(
                    (item) => item.name === activePage
                  ).icon,
                  { size: 26 }
                )}
              </div>

              <h2>{activePage}</h2>

              <p>
                This section is being developed. We will
                connect it to the WealthGuard AI financial
                analysis API.
              </p>
            </section>
          )}

          <footer className="footer">
            WealthGuard AI · Financial decision-support prototype
          </footer>
        </div>
      </main>
    </div>
  );
}

