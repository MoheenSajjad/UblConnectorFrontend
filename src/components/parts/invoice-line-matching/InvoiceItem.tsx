import { motion } from "framer-motion";
import { IInvoiceItem } from "@/utils/item-matching";
import { DragIcon } from "@/components/icons";

interface InvoiceItemProps {
  item: IInvoiceItem;
  index: number;
  currency: string;
  isMatched: boolean;
  isAligned: boolean;
  isSelected: boolean;
  isReadOnly: boolean;
  totalItems: number;
  onDragStart: (e: any, id: string, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
}

export const InvoiceItem = ({
  item,
  index,
  currency,
  isMatched,
  isAligned,
  isSelected,
  isReadOnly,
  totalItems,
  onDragStart,
  onDragOver,
  onDrop,
  onSelectionChange,
}: InvoiceItemProps) => {
  const handleItemClick = () => {
    !isReadOnly && onSelectionChange(item.id, !isSelected);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelectionChange(item.id, e.target.checked);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      key={item.id}
      className="mb-4 relative"
      onClick={handleItemClick}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`px-5 py-2 bg-white ${
          isMatched && isAligned
            ? isSelected
              ? "border-2 border-green-500 bg-green-300/30"
              : "border-2 border-green-500"
            : "border border-gray-200"
        } ${
          !isAligned && isSelected && "border-2 border-yellow-400"
        } rounded-lg shadow-sm cursor-move relative`}
        draggable
        onDragStart={(e) => !isReadOnly && onDragStart(e, item.id, index)}
        onDragOver={(e) => !isReadOnly && onDragOver(e, index)}
        onDrop={onDrop}
        whileHover={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 1.02 }}
      >
        <div
          className="absolute top-2 right-2 z-10"
          onClick={isReadOnly ? () => {} : handleCheckboxClick}
        >
          <input
            type="checkbox"
            disabled={isReadOnly}
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  cursor-pointer"
          />
        </div>
        <DragIcon className="absolute top-1 left-0 text-gray-600" />
        <div className="px-2 pr-8">
          <div className="flex justify-between items-center ">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <span
              className={`
              px-2 py-1 text-xs rounded-full
              ${
                isMatched && isAligned
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }
            `}
            >
              {currency ?? ""} {item.lineExtensionAmount}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm ">
            <div>
              <p className="text-gray-500">Unit Price</p>
              <p className={`font-medium`}>${item.price}</p>
            </div>

            <div>
              <p className="text-gray-500">Qty</p>
              <p className="font-medium">{item.quantity}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
