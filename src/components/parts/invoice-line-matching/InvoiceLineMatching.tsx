import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";

interface Item {
  id: string;
  name: string;
  price: string;
  quantity: string;
}

export const InvoiceLineMatching = () => {
  const [sapItems, setSapItems] = useState<Item[]>([
    { id: "sap1", name: "Product A", price: "100.00", quantity: "10" },
    { id: "sap2", name: "Product B", price: "200.00", quantity: "5" },
    { id: "sap3", name: "Product C", price: "150.00", quantity: "8" },
    { id: "sap4", name: "Product D", price: "300.00", quantity: "3" },
  ]);

  const [invoiceItems, setInvoiceItems] = useState<Item[]>([
    { id: "inv1", name: "Item 1", price: "200.00", quantity: "5" },
    { id: "inv2", name: "Item 2", price: "150.00", quantity: "7" },
    { id: "inv3", name: "Item 3", price: "100.00", quantity: "10" },
    { id: "inv4", name: "Item 4", price: "400.00", quantity: "2" },
  ]);

  // State to track matched items
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Refs for drag and drop
  const dragItem = useRef<{ id: string; index: number } | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Auto-match items based on price
  const autoMatchItems = () => {
    const newMatchedPairs: Record<string, string> = {};
    const usedInvoiceIds = new Set<string>();

    sapItems.forEach((sapItem) => {
      const matchingInvoiceItem = invoiceItems.find(
        (invItem) =>
          invItem.price === sapItem.price && !usedInvoiceIds.has(invItem.id)
      );

      if (matchingInvoiceItem) {
        newMatchedPairs[sapItem.id] = matchingInvoiceItem.id;
        usedInvoiceIds.add(matchingInvoiceItem.id);
      }
    });

    setMatchedPairs(newMatchedPairs);
    rearrangeInvoiceItems();
  };

  // Rearrange invoice items to align with their SAP matches
  const rearrangeInvoiceItems = () => {
    const reorderedInvoiceItems = [...invoiceItems];
    const newInvoiceOrder: Item[] = Array(sapItems.length).fill(null);

    // First, place matched items in positions corresponding to their SAP matches
    sapItems.forEach((sapItem, index) => {
      const matchedInvoiceId = Object.entries(matchedPairs).find(
        ([sapId]) => sapId === sapItem.id
      )?.[1];

      if (matchedInvoiceId) {
        const matchedItem = reorderedInvoiceItems.find(
          (item) => item.id === matchedInvoiceId
        );
        if (matchedItem) {
          newInvoiceOrder[index] = matchedItem;
        }
      }
    });
    // Then add unmatched items at the end
    const unmatchedItems = reorderedInvoiceItems.filter(
      (item) => !Object.values(matchedPairs).includes(item.id)
    );

    // Create final array removing null entries and adding unmatched items
    const finalInvoiceOrder = [
      ...newInvoiceOrder.filter((item) => item !== null),
      ...unmatchedItems,
    ];

    setInvoiceItems(finalInvoiceOrder);
  };

  // Handle drag start
  const handleDragStart = (e: any, id: string, index: number) => {
    dragItem.current = { id, index };
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  }; // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (dragItem.current !== null && dragOverItem.current !== null) {
      const draggedItemId = dragItem.current.id;
      const draggedItemIndex = dragItem.current.index;
      const dropIndex = dragOverItem.current;

      if (draggedItemIndex !== dropIndex) {
        // Create new invoice items array with reordered items
        const newInvoiceItems = [...invoiceItems];
        const draggedItem = newInvoiceItems[draggedItemIndex];

        // Remove dragged item from its original position
        newInvoiceItems.splice(draggedItemIndex, 1);

        // Insert it at the new position
        newInvoiceItems.splice(dropIndex, 0, draggedItem);

        setInvoiceItems(newInvoiceItems);

        // Check if the moved item was previously matched
        const matchingSapId = getMatchingSapId(draggedItemId);

        // If it was matched but now moved to a different position, unmatch it
        if (matchingSapId) {
          const sapIndex = sapItems.findIndex(
            (item) => item.id === matchingSapId
          );

          // If the item is not at the same index as its SAP counterpart, unmatch it
          if (sapIndex !== dropIndex) {
            const newMatchedPairs = { ...matchedPairs };
            delete newMatchedPairs[matchingSapId];
            setMatchedPairs(newMatchedPairs);
          }
        }

        // Check if this creates a new match with SAP item at the drop position
        if (dropIndex < sapItems.length) {
          const sapItem = sapItems[dropIndex];
          const invoiceItem = draggedItem;

          if (sapItem.price === invoiceItem.price) {
            const newMatchedPairs = { ...matchedPairs };
            newMatchedPairs[sapItem.id] = invoiceItem.id;
            setMatchedPairs(newMatchedPairs);
          }
        }
      }
    }

    // Reset drag refs
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Check if an SAP item is matched
  const isSapItemMatched = (sapItemId: string) => {
    return matchedPairs[sapItemId] !== undefined;
  };

  // Check if an Invoice item is matched
  const isInvoiceItemMatched = (invoiceItemId: string) => {
    return Object.values(matchedPairs).includes(invoiceItemId);
  };

  // Get matching SAP item ID for an invoice item
  const getMatchingSapId = (invoiceItemId: string) => {
    for (const [sapId, invId] of Object.entries(matchedPairs)) {
      if (invId === invoiceItemId) {
        return sapId;
      }
    }
    return null;
  };

  // Get the index of matching SAP item for an invoice item
  const getMatchingSapIndex = (invoiceItemId: string) => {
    const matchingSapId = getMatchingSapId(invoiceItemId);
    if (matchingSapId) {
      return sapItems.findIndex((item) => item.id === matchingSapId);
    }
    return -1;
  };

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-2xl font-bold mb-4">SAP and Invoice Item Matching</h1> */}

      {/* <motion.button
        onClick={autoMatchItems}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium w-48"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Auto-Match Items
      </motion.button> */}

      <div className="flex gap-8">
        {/* SAP Items */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-3">SAP Items</h2>
          <div className="flex flex-col">
            {sapItems.map((item, index) => {
              const isMatched = isSapItemMatched(item.id);
              const matchedInvoiceId = matchedPairs[item.id];
              const matchedInvoiceIndex = matchedInvoiceId
                ? invoiceItems.findIndex((inv) => inv.id === matchedInvoiceId)
                : -1;
              const isAligned = matchedInvoiceIndex === index;

              return (
                <motion.div
                  key={item.id}
                  className="mb-4 relative"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMatched && isAligned && (
                    <motion.div
                      className="absolute inset-0 border-2 border-green-500 rounded-lg -m-1 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                  <motion.div
                    className={`p-4 bg-white border ${
                      isMatched ? "border-green-500" : "border-gray-200"
                    } rounded-lg shadow-sm z-20 relative`}
                    whileHover={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
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
                        SAP
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">ID</p>
                        <p className="font-medium">{item.id}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Price</p>
                        <p
                          className={`font-medium ${
                            isMatched ? "text-green-600" : ""
                          }`}
                        >
                          ${item.price}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Qty</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                  {index < sapItems.length - 1 && (
                    <div className="absolute left-1/2 -ml-px w-px h-4 -bottom-4 bg-gray-300"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="border-l border-gray-300"></div>

        {/* Invoice Items */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-3">Invoice Items</h2>
          <div className="flex flex-col">
            {invoiceItems.map((item, index) => {
              const matchingSapId = getMatchingSapId(item.id);
              const isMatched = matchingSapId !== null;
              const matchedSapIndex = getMatchingSapIndex(item.id);
              const isAligned = matchedSapIndex === index;

              return (
                <motion.div
                  key={item.id}
                  className="mb-4 relative"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMatched && isAligned && (
                    <motion.div
                      className="absolute inset-0 border-2 border-green-500 rounded-lg -m-1 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                  <motion.div
                    className={`p-4 bg-white border ${
                      isMatched ? "border-green-500" : "border-gray-200"
                    } rounded-lg shadow-sm cursor-move relative z-20`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
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
                        Invoice
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">ID</p>
                        <p className="font-medium">{item.id}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Price</p>
                        <p
                          className={`font-medium ${
                            isMatched ? "text-green-600" : ""
                          }`}
                        >
                          ${item.price}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Qty</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                    </div>
                    {isMatched && !isAligned && (
                      <motion.div
                        className="mt-1 text-xs text-orange-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        Matched but not aligned (Drag to align)
                      </motion.div>
                    )}
                  </motion.div>
                  {index < invoiceItems.length - 1 && (
                    <div className="absolute left-1/2 -ml-px w-px h-4 -bottom-4 bg-gray-300"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Match visualization */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Matched Pairs</h2>
        <div className="flex flex-col space-y-4">
          <AnimatePresence>
            {Object.entries(matchedPairs).map(([sapId, invoiceId]) => {
              const sapItem = sapItems.find((item) => item.id === sapId);
              const invoiceItem = invoiceItems.find(
                (item) => item.id === invoiceId
              );

              if (!sapItem || !invoiceItem) return null;

              const sapIndex = sapItems.findIndex((item) => item.id === sapId);
              const invoiceIndex = invoiceItems.findIndex(
                (item) => item.id === invoiceId
              );
              const isAligned = sapIndex === invoiceIndex;

              if (!isAligned) return null;

              return (
                <motion.div
                  key={`${sapId}-${invoiceId}`}
                  className="border-2 border-green-500 p-4 rounded-lg bg-green-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="flex justify-between">
                    <div className="w-1/2 pr-4">
                      <h3 className="font-medium">SAP: {sapItem.name}</h3>
                      <div className="text-sm">Price: ${sapItem.price}</div>
                      <div className="text-sm">
                        Quantity: {sapItem.quantity}
                      </div>
                    </div>
                    <div className="border-l border-gray-300"></div>
                    <div className="w-1/2 pl-4">
                      <h3 className="font-medium">
                        Invoice: {invoiceItem.name}
                      </h3>
                      <div className="text-sm">Price: ${invoiceItem.price}</div>
                      <div className="text-sm">
                        Quantity: {invoiceItem.quantity}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {Object.entries(matchedPairs).filter(([sapId, invoiceId]) => {
            if (!sapId || !invoiceId) return false;
            const sapIndex = sapItems.findIndex((item) => item.id === sapId);
            const invoiceIndex = invoiceItems.findIndex(
              (item) => item.id === invoiceId
            );
            return sapIndex === invoiceIndex;
          }).length === 0 && (
            <motion.div
              className="text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              No aligned matches found. Drag invoice items to match and align
              them with SAP items.
            </motion.div>
          )}
        </div>
      </div> */}
    </div>
  );
};
