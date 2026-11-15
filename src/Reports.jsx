
import React from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Info
} from "lucide-react";

export default function Reports({ analysisResult }) {
  const recommendations =
    analysisResult?.recommendations || [];

  const indicators =
    analysisResult?.financial_indicators || {};

  const actionCount = recommendations.reduce(
    (total, item) =>
      total + (item.recommended_actions?.length || 0),
    0
  );

  return (
    <div className="reports-page">
      {analysisResult && (
  <div className="report-export-actions">
    <button
      type="button"
      className="primary-button"
      onClick={() => window.print()}
    >
      <FileText size={18} />
      Export Report as PDF
    </button>
  </div>
)}
      <div className="section-heading">
        <h2>Financial Assessment Report</h2>
        <p>
          Review your company's financial indicators,
          warning signs, and recommended actions.
        </p>
      </div>

      {!analysisResult ? (
        <section className="analysis-panel">
          <FileText size={32} color="#278363" />
          <h3>No financial report available</h3>
          <p>
            Complete a financial analysis to generate
            your company assessment report.
          </p>
        </section>
      ) : (
        <>
          <section className="analysis-panel">
            <h3>Executive Summary</h3>

            <div className="financial-metrics">
              <div className="metric-card">
                <AlertTriangle size={22} />
                <span>Financial warning signs</span>
                <strong>
                  {analysisResult.issues_identified ?? 0}
                </strong>
              </div>

              <div className="metric-card">
                <CheckCircle2 size={22} />
                <span>Suggested actions</span>
                <strong>{actionCount}</strong>
              </div>
            </div>

            <div className="model-status">
              <Info size={17} />
              <span>
                {analysisResult.prediction_status ===
                "insufficient_data"
                  ? "Insufficient data for AI model scoring. This report uses financial indicator checks."
                  : "Any AI model assessment is provisional and is not a calibrated bankruptcy probability."}
              </span>
            </div>
          </section>

          <section className="analysis-panel">
            <h3>
              <BarChart3 size={20} />
              {" "}Financial Indicators
            </h3>

            <div className="financial-metrics">
              {Object.entries(indicators).map(
                ([key, value]) => (
                  <div className="metric-card" key={key}>
                    <span>
                      {key.replaceAll("_", " ")}
                    </span>
                    <strong>
                      {typeof value === "number" &&
                      Number.isFinite(value)
                        ? value.toLocaleString(undefined, {
                            maximumFractionDigits: 3
                          })
                        : "Unavailable"}
                    </strong>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="analysis-panel">
            <h3>Identified Problems and Action Plan</h3>

            {recommendations.length === 0 ? (
              <p>
                No specific recommendations were
                returned by the analysis.
              </p>
            ) : (
              <div className="recommendation-grid">
                {recommendations.map((item, index) => (
                  <article
                    className="recommendation-card"
                    key={index}
                  >
                    <h3>{item.problem}</h3>
                    <p>{item.explanation}</p>

                    <strong>Recommended actions</strong>
                    <ul>
                      {(item.recommended_actions || []).map(
                        (action, i) => (
                          <li key={i}>{action}</li>
                        )
                      )}
                    </ul>

                    {item.monitor && (
                      <small>
                        Monitor: {item.monitor}
                      </small>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <p className="analysis-note">
            WealthGuard AI is an educational financial
            decision-support prototype. These results
            are not professional financial advice.
          </p>
        </>
      )}
    </div>
  );
}
