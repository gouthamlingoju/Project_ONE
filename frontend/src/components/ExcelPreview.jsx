// src/ExcelPreview.jsx

import { useState } from "react";
import * as XLSX from "xlsx";

const ExcelPreview = () => {
  const [tableHtml, setTableHtml] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Get the first sheet and convert it to HTML
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const htmlTable = XLSX.utils.sheet_to_html(sheet);

      setTableHtml(htmlTable);
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Excel File Preview</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
      />
      <div
        className="overflow-x-auto mt-4"
        dangerouslySetInnerHTML={{ __html: tableHtml }}
      />
    </div>
  );
};

export default ExcelPreview;
