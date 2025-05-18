import { motion } from "framer-motion";
import { SAPItem } from "@/utils/item-matching";

interface InvoiceItemProps {
  item: SAPItem;
  index: number;
  isMatched: boolean;
  isAligned: boolean;
  totalItems: number;
  onDragStart: (e: any, id: string, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const InvoiceItem = ({
  item,
  index,
  isMatched,
  isAligned,
  totalItems,
  onDragStart,
  onDragOver,
  onDrop,
}: InvoiceItemProps) => {
  return (
    <motion.div
      key={item.id}
      className="mb-4 relative"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`p-4 bg-white ${
          isMatched && isAligned
            ? "border-2 border-green-500"
            : "border border-gray-200"
        } rounded-lg shadow-sm cursor-move relative`}
        draggable
        onDragStart={(e) => onDragStart(e, item.id, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={onDrop}
        whileHover={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 1.02 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
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
            Invoice Item
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Price</p>
            <p className={`font-medium`}>${item.price}</p>
          </div>

          <div>
            <p className="text-gray-500">Qty</p>
            <p className="font-medium">{item.quantity}</p>
          </div>

          <div>
            <p className="text-gray-500">Total</p>
            <p className={`font-medium ${isMatched ? "text-green-600" : ""}`}>
              ${item.lineExtensionAmount}
            </p>
          </div>
        </div>
      </motion.div>
      {index < totalItems - 1 && (
        <div className="absolute left-1/2 -ml-px w-px h-4 -bottom-4 bg-gray-300"></div>
      )}
    </motion.div>
  );
};
