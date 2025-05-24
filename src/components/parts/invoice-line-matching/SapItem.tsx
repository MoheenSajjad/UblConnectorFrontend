import { motion } from "framer-motion";
import { OrderLine } from "@/types/sap";

interface SAPItemProps {
  item: OrderLine;
  index: number;
  isMatched: boolean;
  isAligned: boolean;
  totalItems: number;
}

export const SAPItem = ({
  item,
  index,
  isMatched,
  isAligned,
  totalItems,
}: SAPItemProps) => {
  return (
    <motion.div
      key={item.LineNum}
      className="mb-4 relative"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`px-5 py-2 bg-white ${
          isMatched && isAligned
            ? "border-2 border-green-500"
            : "border border-gray-200"
        } rounded-lg shadow-sm z-20 cursor-no-drop relative`}
        whileHover={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="px-2">
          <div className="flex justify-between items-center ">
            <h3 className="font-medium text-gray-900">
              {item.ItemDescription}
            </h3>
            <span
              className={`
              px-2 py-1 text-xs rounded-full
              ${
                isMatched
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }
            `}
            >
              {item.Currency} {item.LineTotal}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            {/* <div>
              <p className="text-gray-500">Price</p>
              <p className={`font-medium ${isMatched ? "text-green-600" : ""}`}>
                ${item.LineTotal}
              </p>
            </div> */}

            <div>
              <p className="text-gray-500">Qty</p>
              <p className="font-medium">{item.Quantity}</p>
            </div>
          </div>
        </div>
      </motion.div>
      {index < totalItems - 1 && (
        <div className="absolute left-1/2 -ml-px w-px h-4 -bottom-0 bg-gray-300"></div>
      )}
    </motion.div>
  );
};
