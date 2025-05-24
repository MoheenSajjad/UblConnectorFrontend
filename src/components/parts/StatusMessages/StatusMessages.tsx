import { ReactNode } from "react";

export const EmptyStateMessage = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center h-64">
    <svg
      className="w-16 h-16 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      ></path>
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No PO Code Selected
    </h3>
    <p className="text-gray-500">
      Please select a Order Code first to load SAP items
    </p>
  </div>
);

export const NoDataFoundMessage = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center h-64">
    <svg
      className="w-16 h-16 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
      ></path>
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
    <p className="text-gray-500">
      No SAP items were found for the selected Code
    </p>
  </div>
);

export const LoadingMessage = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center h-64">
    {/* <h3 className="text-lg font-medium text-gray-900 mb-2">Loading</h3>
    <p className="text-gray-500">Fetching SAP items...</p> */}
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center h-64">
    <svg
      className="w-16 h-16 text-red-500 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
    <p className="text-gray-500">{message}</p>
  </div>
);
