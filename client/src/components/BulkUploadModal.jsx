import React, { useState } from "react";
import * as XLSX from "xlsx";

const BulkUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["csv", "xlsx"];
    const ext = file.name.split(".").pop().toLowerCase();

    if (!allowed.includes(ext)) {
      setError("Invalid file format. Please upload .csv or .xlsx file");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        if (json.length === 0) {
          setError("Empty file. No data found.");
          return;
        }

        setRows(json);
      } catch {
        setError("Error reading file. Make sure it's a valid Excel/CSV file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[95%] max-w-2xl rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#5b3d25]">Bulk Upload</h2>
          <button
            onClick={onClose}
            className="text-[#5b3d25] hover:text-[#3a2818] text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* FILE INPUT */}
        <div className="border border-[#5b3d25]/40 rounded-lg p-4 text-center cursor-pointer">
          <label className="cursor-pointer block">
            <div className="text-[#5b3d25] font-medium">Upload .csv or .xlsx File</div>
            <div className="mt-2 px-4 py-2 inline-block bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors">
              Choose File
            </div>
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFile} />
          </label>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        {/* PREVIEW SECTION */}
        {rows.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-[#5b3d25] mb-2 text-lg">
              Preview ({rows.length} items)
            </h3>

            <div className="border rounded-lg overflow-x-auto shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#5b3d25]/10 text-[#5b3d25]">
                    {Object.keys(rows[0]).map((col) => (
                      <th key={col} className="p-2 border text-left">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#5b3d25]/5 transition-colors">
                      {Object.keys(row).map((col) => (
                        <td key={col} className="p-2 border">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* UPLOAD BUTTON */}
            <button
              onClick={() => onUpload(rows)}
              className="mt-4 px-5 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors"
            >
              Add Products
            </button>
          </div>
        )}

        {/* CLOSE BUTTON */}
        {!rows.length && (
          <button
            className="mt-4 px-4 py-2 border border-[#5b3d25] rounded-lg text-[#5b3d25] hover:bg-[#5b3d25]/10 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default BulkUploadModal;
