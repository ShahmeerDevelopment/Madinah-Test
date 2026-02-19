/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { forceExperimentVariation, growthbook } from "@/utils/growthbook";

/**
 * A component to help test different experiment variations
 * ONLY USE IN DEVELOPMENT
 */
const ExperimentTester = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [experiments, setExperiments] = useState([]);
  const [visitorId, setVisitorId] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return;

    // Get the visitor ID for consistency
    const storedVisitorId =
      localStorage.getItem("userId") || localStorage.getItem("gb_visitor_id");
    setVisitorId(storedVisitorId || "No stable ID found");

    const checkExperiments = () => {
      if (!growthbook.experiments) return;

      // Get all active experiments
      const activeExperiments = growthbook.experiments.map((exp) => ({
        id: exp.key,
        name: exp.key,
        description: exp.description || "",
        variations: exp.variations.map((v, i) => ({
          id: i,
          name: v.name || `Variation ${i}`,
          description: v.description || "",
          weight: exp.weights ? (exp.weights[i] * 100).toFixed(1) + "%" : "50%",
        })),
        active: growthbook.getExperimentResult(exp.key)?.variationId || 0,
        hasForced:
          growthbook.forcedVariations && exp.key in growthbook.forcedVariations,
      }));

      setExperiments(activeExperiments);
    };

    // Check initially and whenever experiments change
    const interval = setInterval(checkExperiments, 2000);
    checkExperiments();

    return () => clearInterval(interval);
  }, []);

  // Run a simulation to check 50/50 distribution
  const runDistributionTest = () => {
    if (!experiments.length) return;

    setShowStats(true);
    const results = {};
    const sampleSize = 1000;

    // For each experiment, simulate assignments
    experiments.forEach((experiment) => {
      results[experiment.id] = {};

      // Initialize counters for each variation
      experiment.variations.forEach((v) => {
        results[experiment.id][v.id] = 0;
      });

      // Run simulation
      for (let i = 0; i < sampleSize; i++) {
        // Create a random user hash each time
        const randomUser = `test-user-${Math.random()
          .toString(36)
          .substring(2, 15)}`;

        // Use GrowthBook's hash function to determine assignment
        // This is a simplified version - actual implementation may differ
        const hash = simpleHash(randomUser + experiment.id);
        const normalizedHash = hash / Math.pow(2, 32); // normalize to 0-1

        // Find which bucket this falls into based on variation weights
        let cumWeight = 0;
        for (let j = 0; j < experiment.variations.length; j++) {
          const weight = experiment.variations[j].weight.endsWith("%")
            ? parseFloat(experiment.variations[j].weight) / 100
            : 1 / experiment.variations.length;

          cumWeight += weight;
          if (normalizedHash < cumWeight) {
            results[experiment.id][j]++;
            break;
          }
        }
      }
    });

    setStats(results);
  };

  // Simple hash function for simulation
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Reset all forced variations and reload
  const resetAllVariations = () => {
    localStorage.removeItem("gb_forced_variations");
    growthbook.setForcedVariations({});
    window.location.reload();
  };

  // Generate a new visitor ID for testing
  const generateNewVisitor = () => {
    localStorage.removeItem("gb_visitor_id");
    window.location.reload();
  };

  // Force all experiments to show a specific variation (for testing)
  const forceAllVariations = (variationId) => {
    const forcedExperiments = {};
    experiments.forEach((exp) => {
      forcedExperiments[exp.id] = variationId;
    });

    localStorage.setItem(
      "gb_forced_variations",
      JSON.stringify(forcedExperiments)
    );
    growthbook.setForcedVariations(forcedExperiments);
    window.location.reload();
  };

  // If no experiments or not in development, don't render
  if (!experiments.length || process.env.NODE_ENV !== "development")
    return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: isVisible ? "20px" : "-2px",
        right: "20px",
        background: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: isVisible ? "15px" : "5px 15px",
        zIndex: 9999,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        maxWidth: "400px",
        maxHeight: isVisible ? "80vh" : "auto",
        overflowY: isVisible ? "auto" : "hidden",
      }}
    >
      <div
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: isVisible ? "10px" : "0",
        }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "A/B Test Controls ▼" : "A/B Test Controls ▲"}
      </div>

      {isVisible && (
        <div>
          <div style={{ marginBottom: "10px", fontSize: "12px" }}>
            <strong>Visitor ID:</strong>{" "}
            {visitorId && visitorId.length > 20
              ? visitorId.substring(0, 20) + "..."
              : visitorId}
            <button
              onClick={generateNewVisitor}
              style={{
                marginLeft: "10px",
                fontSize: "11px",
                padding: "2px 5px",
              }}
            >
              New ID
            </button>
          </div>

          {/* Quick action buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
              gap: "10px",
            }}
          >
            <button
              onClick={() => forceAllVariations(0)}
              style={{
                flex: 1,
                padding: "5px",
                fontSize: "11px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              All Control
            </button>
            <button
              onClick={() => forceAllVariations(1)}
              style={{
                flex: 1,
                padding: "5px",
                fontSize: "11px",
                background: "#FF9800",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              All Variant
            </button>
            <button
              onClick={resetAllVariations}
              style={{
                flex: 1,
                padding: "5px",
                fontSize: "11px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Natural 50/50
            </button>
          </div>

          {/* List all experiments */}
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{experiment.name}</span>
                {experiment.hasForced && (
                  <span style={{ color: "#ff6b00", fontSize: "12px" }}>
                    Forced
                  </span>
                )}
              </div>
              {experiment.description && (
                <div
                  style={{
                    fontSize: "12px",
                    marginBottom: "5px",
                    color: "#666",
                  }}
                >
                  {experiment.description}
                </div>
              )}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {experiment.variations.map((variation) => (
                  <button
                    key={variation.id}
                    onClick={() =>
                      forceExperimentVariation(experiment.id, variation.id)
                    }
                    style={{
                      padding: "4px 8px",
                      background:
                        experiment.active === variation.id
                          ? "#4CAF50"
                          : "#e0e0e0",
                      color:
                        experiment.active === variation.id ? "white" : "black",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    title={
                      variation.description || `Weight: ${variation.weight}`
                    }
                  >
                    {variation.name}
                    <div style={{ fontSize: "9px", opacity: 0.8 }}>
                      {variation.weight}
                    </div>
                  </button>
                ))}
              </div>

              {/* Distribution stats for this experiment if available */}
              {showStats && stats[experiment.id] && (
                <div style={{ marginTop: "5px", fontSize: "11px" }}>
                  <strong>Simulated distribution:</strong>
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "3px" }}
                  >
                    {experiment.variations.map((variation) => (
                      <div key={`stat-${variation.id}`}>
                        {variation.name}: {stats[experiment.id][variation.id]} (
                        {(
                          (stats[experiment.id][variation.id] / 1000) *
                          100
                        ).toFixed(1)}
                        %)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: "15px" }}>
            <button
              onClick={runDistributionTest}
              style={{
                width: "100%",
                padding: "5px 10px",
                background: "#673AB7",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              Check 50/50 Distribution
            </button>
            <div style={{ fontSize: "12px", color: "#666" }}>
              This panel only appears in development mode. To truly test the
              natural distribution, open your app in multiple browsers or clear
              cookies between tests.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentTester;
