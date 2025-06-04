import React, { useEffect, useState } from "react";
import { PredictionResult, PredictionResponse } from "../types";
import { fetchPredictionPage } from "../services/api";

export interface ResultsTableProps {
  results: PredictionResult[];
  isLoading: boolean;
  modelName?: string;
  paginated?: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  isLoading,
  modelName,
  paginated,
}) => {
  const [pageData, setPageData] = useState<PredictionResult[]>([]);

  useEffect(() => {
    if (paginated && modelName) {
      fetchPredictionPage(modelName).then((data: PredictionResponse) => {
        const parsed: PredictionResult[] = data.tx_id.map((id, idx) => ({
          transaction_id: id,
          prediction: data.predictions[idx] === 1 ? "fraud" : "legitimate",
          probability: data.probabilities[idx],
        }));
        setPageData(parsed);
      });
    }
  }, [paginated, modelName]);

  const displayData = paginated ? pageData : results;

  return (
    <div className="mt-6">
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Prediction</th>
              <th className="px-4 py-2 border">Probability</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((result, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-2">{result.transaction_id}</td>
                <td className="border px-4 py-2">{result.prediction}</td>
                <td className="border px-4 py-2">
                  {(result.probability * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
