import React from "react";

export interface TabsProps {
  activeTab: "predict" | "history";
  onTabChange: (tab: "predict" | "history") => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onTabChange("predict")}
        className={`px-4 py-2 rounded ${
          activeTab === "predict"
            ? "bg-[#FFE600] text-black"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Run Prediction
      </button>
      <button
        onClick={() => onTabChange("history")}
        className={`px-4 py-2 rounded ${
          activeTab === "history"
            ? "bg-[#FFE600] text-black"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Prediction History
      </button>
    </div>
  );
};
