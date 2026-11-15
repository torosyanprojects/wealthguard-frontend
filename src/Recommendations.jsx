
import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info
} from "lucide-react";

const guidance = [
  {
    id: "liquidity",
    title: "Weak Liquidity",
    description:
      "Current assets may be insufficient to cover short-term liabilities.",
    indicator: "Current ratio below 1.0",
    actions: [
      "Prepare a short-term cash flow forecast.",
      "Review upcoming payments and available cash.",
      "Improve collection of outstanding receivables."
    ]
  },
  {
    id: "liabilities",
    title: "High Liabilities Relative to Assets",
    description:
      "A high proportion of assets is financed through liabilities.",
    indicator: "Liabilities / assets above 70%",
    actions: [
      "Review repayment schedules and borrowing costs.",
      "Evaluate opportunities to reduce expensive debt.",
      "Assess whether financing obligations are sustainable."
    ]
  },
  {
    id: "profitability",
    title: "Negative Profitability",
    description:
      "The company reports a net financial loss.",
    indicator: "Net income below zero",
    actions: [
      "Identify major operating costs and loss-making activities.",
      "Review product pricing and profit margins.",
      "Prepare a realistic plan for improving profitability."
    ]
  },
  {
    id: "cashflow",
    title: "Negative Operating Cash Flow",
    description:
      "Operating activities consume more cash than they generate.",
    indicator: "Operating cash flow below zero",
    actions: [
      "Examine the timing of customer payments.",
      "Review recurring operating expenses.",
      "Develop a cash management plan."
    ]
  },
  {
    id: "margin",
    title: "Negative Net Margin",
    description:
      "The company records a net loss relative to revenue.",
    indicator: "Net margin below zero",
    actions: [
      "Compare revenue with total expenses.",
      "Review pricing and cost efficiency.",
      "Monitor changes in net profit margin."
    ]
  }
];

export default function Recommendations({ analysisResult }) {
  const [expanded, setExpanded] = useState("liquidity");

  return (
    <div className="recommendations-page">
      <div className="recommendations-intro">
        <h2>Financial Guidance Library</h2>
        <p>
          Explore practical actions associated with common
          financial warning signs.
        </p>
      </div>

      <div className="recommendations-info">
        <Info size={20} />
        <p>
          These are general educational recommendations.
          They are not personalized financial advice.
          Company-specific analysis will be connected
          to the existing WealthGuard API.
        </p>
      </div>

      
<section className="personalized-recommendations">
  <div className="section-heading">
    <h2>Company-Specific Recommendations</h2>
    <p>
      Actions based on your latest financial analysis.
    </p>
  </div>

  {!analysisResult ? (
    <div className="recommendations-info">
      <Info size={20} />
      <p>
        No company analysis is available yet.
        Open Financial Analysis, enter company
        figures, and run an analysis to receive
        recommendations.
      </p>
    </div>
  ) : (
    <>
      <div className="model-status">
        <strong>Analysis summary:</strong>{" "}
        {analysisResult.issues_identified ?? 0}
        {" "}financial warning signs identified.
      </div>

      {analysisResult.prediction_status ===
        "insufficient_data" && (
        <div className="recommendations-info">
          <Info size={20} />
          <p>
            There is insufficient information for
            AI model scoring. The recommendations
            below are based on financial indicator
            checks, not an AI bankruptcy prediction.
          </p>
        </div>
      )}

      <div className="recommendation-grid">
        {(analysisResult.recommendations || []).map(
          (item, index) => (
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
                <small>Monitor: {item.monitor}</small>
              )}
            </article>
          )
        )}
      </div>

      {(analysisResult.recommendations || [])
        .length === 0 && (
        <p>
          No specific recommendations were
          returned by the analysis.
        </p>
      )}
    </>
  )}
</section>

        {guidance.map((item) => {
          const isOpen = expanded === item.id;

          return (
            <article
              className="recommendation-item"
              key={item.id}
            >
              <button
                type="button"
                className="recommendation-toggle"
                onClick={() =>
                  setExpanded(isOpen ? null : item.id)
                }
                aria-expanded={isOpen}
              >
                <span className="recommendation-title">
                  <BookOpen size={20} />
                  {item.title}
                </span>

                {isOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {isOpen && (
                <div className="recommendation-content">
                  <p>{item.description}</p>

                  <div className="recommendation-indicator">
                    <strong>Warning indicator:</strong>{" "}
                    {item.indicator}
                  </div>

                  <h3>Suggested actions</h3>

                  <ul>
                    {item.actions.map((action) => (
                      <li key={action}>
                        <CheckCircle2 size={18} />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
