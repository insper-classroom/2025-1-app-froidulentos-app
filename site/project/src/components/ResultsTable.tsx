// src/components/ResultsTable.tsx
import React, { useEffect, useState } from "react";
import {
  PredictionResult,
  PredictionResponse,
  EvaluationMetrics,
} from "../types";
import { fetchPredictionPage, PAGE_SIZE } from "../services/api";

export interface ResultsTableProps {
  isLoading: boolean;
  modelName?: string; // This is the specific prediction run identifier
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  isLoading: parentIsLoading,
  modelName, // This is the actual prediction run identifier, e.g., "model-v2_pred_proba_2025-06-05_00-42-33"
}) => {
  const [pageData, setPageData] = useState<PredictionResult[]>([]);
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [evaluationMetrics, setEvaluationMetrics] =
    useState<EvaluationMetrics | null>(null);
  // currentModelRunName will be set directly from the modelName prop, as it's the full identifier
  const [testDfName, setTestDfName] = useState<string | null>(null);

  const loadPageData = (pageToLoad: number) => {
    if (modelName) {
      setInternalIsLoading(true);
      setPageData([]);
      if (pageToLoad === 1) {
        setEvaluationMetrics(null);
        setTestDfName(null);
      }
      fetchPredictionPage(modelName, pageToLoad)
        .then((data: PredictionResponse) => {
          const parsed: PredictionResult[] = data.tx_id.map((id, idx) => ({
            transaction_id: id,
            prediction: data.predictions[idx] === 1 ? "fraud" : "legitimate",
            probability: data.probabilities[idx],
          }));
          setPageData(parsed);
          setCurrentPage(pageToLoad);
          setTotalPages(Math.ceil(data.total_predictions / PAGE_SIZE));
          setEvaluationMetrics(data.evaluation ?? null);
          setTestDfName(data.test_df_name ?? "N/A");
        })
        .catch((err) => {
          console.error(
            `Failed to fetch prediction page for ${modelName}, page ${pageToLoad}:`,
            err
          );
          setPageData([]);
          setTotalPages(0);
          setEvaluationMetrics(null);
          setTestDfName(null);
        })
        .finally(() => {
          setInternalIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (modelName) {
      setCurrentPage(1);
      loadPageData(1);
    } else {
      setPageData([]);
      setTotalPages(0);
      setCurrentPage(1);
      setEvaluationMetrics(null);
      setInternalIsLoading(false);
      setTestDfName(null);
    }
  }, [modelName]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      loadPageData(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      loadPageData(currentPage + 1);
    }
  };

  const shouldShowLoadingIndicator = parentIsLoading || internalIsLoading;

  let loadingText = "Loading...";
  if (parentIsLoading && !internalIsLoading) {
    loadingText = "Preparing results interface...";
  } else if (internalIsLoading) {
    loadingText = "Fetching data and metrics...";
  }

  const noDataOrMetricsAvailable =
    !shouldShowLoadingIndicator &&
    modelName &&
    pageData.length === 0 &&
    !evaluationMetrics;
  let noDataMessage = "";
  if (noDataOrMetricsAvailable) {
    noDataMessage =
      "No data or evaluation metrics available for this selection.";
  }

  const showContent = modelName && !parentIsLoading;

  return (
    <div className="mt-6">
      {parentIsLoading && (
        <p className="text-gray-600 text-center py-4">{loadingText}</p>
      )}

      {showContent && (
        <>
          {/* Title for the results section */}
          {modelName &&
            !internalIsLoading && ( // Show title when modelName is present and not internally loading
              <div className="mb-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Results for: <span className="font-bold">{modelName}</span>
                </h3>
                {testDfName && testDfName !== "N/A" && (
                  <p className="text-sm text-gray-600">
                    (Tested on Dataset: {testDfName})
                  </p>
                )}
              </div>
            )}

          {internalIsLoading && (
            <p className="text-gray-600 text-center py-4">{loadingText}</p>
          )}

          {!internalIsLoading && pageData.length > 0 ? (
            <>
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Transaction ID</th>
                    <th className="px-4 py-2 border">Prediction</th>
                    <th className="px-4 py-2 border">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((result, idx) => (
                    <tr
                      key={result.transaction_id || idx}
                      className="text-center"
                    >
                      <td className="border px-4 py-2">
                        {result.transaction_id}
                      </td>
                      <td
                        className={`border px-4 py-2 font-medium ${
                          result.prediction === "fraud"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {result.prediction === "fraud" ? "Fraud" : "Legitimate"}
                      </td>
                      <td className="border px-4 py-2">
                        {(result.probability * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || internalIsLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || internalIsLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            !internalIsLoading &&
            modelName && (
              <p className="text-gray-500 text-center py-4">
                {noDataMessage || "No prediction entries to display."}
              </p>
            )
          )}
          {!internalIsLoading && !modelName && !parentIsLoading && (
            <p className="text-gray-400 text-center py-4 italic">
              Prediction results will appear here after running a model.
            </p>
          )}
        </>
      )}
    </div>
  );
};

const formatMetric = (
  value: number | undefined | null,
  isPercentage = true
) => {
  if (value === undefined || value === null) return "N/A";
  return isPercentage ? `${(value * 100).toFixed(2)}%` : value.toString();
};
