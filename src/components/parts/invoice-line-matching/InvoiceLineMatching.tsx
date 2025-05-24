import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Invoice, selectedCodeItem } from "@/types/invoice";
import {
  getSAPGoodReceiptLines,
  getSAPPurchaseOrderLines,
} from "@/services/sapService";
import { OrderLine, OrderLineResponse } from "@/types/sap";
import { Loading } from "@/components/ui/Loading";

import { InvoiceItem } from "./InvoiceItem";
import {
  EmptyStateMessage,
  ErrorMessage,
  LoadingMessage,
  NoDataFoundMessage,
} from "@/components/parts/StatusMessages";
import {
  SAPItem as SAPItemType,
  findInitialMatches,
  rearrangeInvoiceItems,
  updateMatchesAfterSwap,
  isSapItemMatched,
  isInvoiceItemMatched,
  getMatchingSapId,
  getMatchingSapIndex,
  IInvoiceItem,
} from "@/utils/item-matching";
import { SAPItem } from "./SapItem";

// Define props interface
interface SAPInvoiceMatchingProps {
  data: Invoice;
  docEntry: number;
  poCode: string;
  grnCodes: selectedCodeItem[];
  transactionId?: string;
  onSelectionChange: (selectedItems: IInvoiceItem[]) => void;
  onItemsReorder: (reorderedItems: IInvoiceItem[]) => void;
  onSapItemsUpdate: (sapItems: OrderLine[]) => void; // New prop
  hideButtons: boolean;
}

export function InvoiceLineMatching({
  data,
  docEntry,
  poCode,
  transactionId,
  grnCodes,
  onSelectionChange,
  onItemsReorder,
  onSapItemsUpdate,
  hideButtons,
}: SAPInvoiceMatchingProps) {
  // State for SAP items from API
  const [sapItems, setSapItems] = useState<OrderLine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Convert Invoice data to our internal format
  const [invoiceItems, setInvoiceItems] = useState<IInvoiceItem[]>([]);

  // Flag to prevent initial callback on mount
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize the callback to prevent unnecessary re-renders
  const memoizedOnItemsReorder = useCallback(onItemsReorder, []);
  const memoizedOnSelectionChange = useCallback(onSelectionChange, []);

  // Initialize invoice items from data
  useEffect(() => {
    if (data?.InvoiceLine) {
      const items = data.InvoiceLine.map((line) => ({
        id: line.ID,
        name: line.Item.Name,
        price: line.Price.PriceAmount,
        quantity: line.InvoicedQuantity,
        lineExtensionAmount: line.LineExtensionAmount,
        isSelected: line.isSelected || false,
      }));

      setInvoiceItems(items);

      // Only call callback after initial mount, not on first load
      if (isInitialized && memoizedOnItemsReorder) {
        memoizedOnItemsReorder(items);
      } else if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [data?.InvoiceLine, isInitialized, memoizedOnItemsReorder]);

  // State to track matched items
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Refs for drag and drop
  const dragItem = useRef<{ id: string; index: number } | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Handle invoice item selection
  const handleSelectionChange = (itemId: string, isSelected: boolean) => {
    const updatedItems = invoiceItems.map((item) =>
      item.id === itemId ? { ...item, isSelected } : item
    );

    setInvoiceItems(updatedItems);

    // Notify parent of reordered items
    if (memoizedOnItemsReorder) {
      memoizedOnItemsReorder(updatedItems);
    }

    // Call parent callback with selected items
    if (memoizedOnSelectionChange) {
      const selectedItems = updatedItems.filter((item) => item.isSelected);
      memoizedOnSelectionChange(selectedItems);
    }
  };

  // Bulk selection handlers
  const selectAllItems = () => {
    const updatedItems = invoiceItems.map((item) => ({
      ...item,
      isSelected: true,
    }));
    setInvoiceItems(updatedItems);

    // Notify parent of reordered items
    if (memoizedOnItemsReorder) {
      memoizedOnItemsReorder(updatedItems);
    }

    if (memoizedOnSelectionChange) {
      memoizedOnSelectionChange(updatedItems);
    }
  };

  const deselectAllItems = () => {
    const updatedItems = invoiceItems.map((item) => ({
      ...item,
      isSelected: false,
    }));
    setInvoiceItems(updatedItems);

    // Notify parent of reordered items
    if (memoizedOnItemsReorder) {
      memoizedOnItemsReorder(updatedItems);
    }

    if (memoizedOnSelectionChange) {
      memoizedOnSelectionChange([]);
    }
  };

  // Fetch SAP data when relevant props change
  useEffect(() => {
    if (docEntry && data?.selectedPoOrderCode?.Code && poCode) {
      setIsLoading(true);
      setError(null);

      getSAPPurchaseOrderLines(transactionId, docEntry, poCode)
        .then((items) => {
          const orderLineData: OrderLineResponse = items;
          const sapItemsData = orderLineData?.value[0]?.DocumentLines || [];
          setSapItems(sapItemsData);

          onSapItemsUpdate(sapItemsData);

          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching SAP Purchase Order Lines:", err);
          setError("Failed to load SAP items");

          onSapItemsUpdate([]);

          setSapItems([]);
          setIsLoading(false);
        });
    } else if (grnCodes && data?.selectedGrnOrderCode.length > 0) {
      const docEntry = data.selectedGrnOrderCode[0]?.Value;
      setIsLoading(true);
      setError(null);

      getSAPGoodReceiptLines(transactionId, docEntry, grnCodes[0]?.Code)
        .then((items) => {
          const orderLineData: OrderLineResponse = items;
          const sapItemsData = orderLineData?.value[0]?.DocumentLines || [];
          setSapItems(sapItemsData);

          onSapItemsUpdate(sapItemsData);

          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching SAP Good Receipt Lines:", err);
          setError("Failed to load SAP items");

          onSapItemsUpdate([]);

          setSapItems([]);
          setIsLoading(false);
        });
    }
  }, [
    data?.selectedPoOrderCode,
    data?.selectedGrnOrderCode,
    docEntry,
    poCode,
    transactionId,
    grnCodes,
    onSapItemsUpdate,
  ]);

  // Reset state when reference code or business partner changes
  useEffect(() => {
    setSapItems([]);
    setMatchedPairs({});
  }, [data.selectedReferenceCode, data.selectedBusinessPartner]);

  // Automatically find initial matches when items change
  useEffect(() => {
    if (sapItems.length > 0 && invoiceItems.length > 0) {
      const initialMatches = findInitialMatches(sapItems, invoiceItems);

      // If any matches were found, set them
      if (Object.keys(initialMatches).length > 0) {
        setMatchedPairs(initialMatches);
      }
    }
  }, [sapItems, invoiceItems]);

  // Auto-match items based on price
  const autoMatchItems = () => {
    const newMatchedPairs: Record<string, string> = {};
    const usedInvoiceIds = new Set<string>();

    sapItems.forEach((sapItem) => {
      const matchingInvoiceItem = invoiceItems.find(
        (invItem) =>
          parseFloat(invItem.lineExtensionAmount) ===
            parseFloat(sapItem.LineTotal.toString()) &&
          !usedInvoiceIds.has(invItem.id)
      );

      if (matchingInvoiceItem) {
        newMatchedPairs[sapItem.LineNum] = matchingInvoiceItem.id;
        usedInvoiceIds.add(matchingInvoiceItem.id);
      }
    });

    setMatchedPairs(newMatchedPairs);
    const newInvoiceItems = rearrangeInvoiceItems(
      invoiceItems,
      sapItems,
      newMatchedPairs
    );
    setInvoiceItems(newInvoiceItems);

    // Notify parent of reordered items
    if (memoizedOnItemsReorder) {
      memoizedOnItemsReorder(newInvoiceItems);
    }
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
  };

  // Handle drop - SWAP items instead of reordering
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (dragItem.current !== null && dragOverItem.current !== null) {
      const draggedItemIndex = dragItem.current.index;
      const dropIndex = dragOverItem.current;

      if (draggedItemIndex !== dropIndex) {
        // Create new invoice items array
        const newInvoiceItems = [...invoiceItems];

        // SWAP the items instead of reordering
        const temp = newInvoiceItems[draggedItemIndex];
        newInvoiceItems[draggedItemIndex] = newInvoiceItems[dropIndex];
        newInvoiceItems[dropIndex] = temp;

        // Apply the new order
        setInvoiceItems(newInvoiceItems);

        // Notify parent of reordered items
        if (memoizedOnItemsReorder) {
          memoizedOnItemsReorder(newInvoiceItems);
        }

        // After swapping, reassess matches at the affected positions
        const newMatchedPairs = updateMatchesAfterSwap(
          sapItems,
          newInvoiceItems,
          matchedPairs,
          [draggedItemIndex, dropIndex]
        );

        // Update matched pairs
        setMatchedPairs(newMatchedPairs);
      }
    }

    // Reset drag refs
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const isReferenceCodeSelected = (data: Invoice): boolean => {
    const poCodeSelected = data.selectedPoOrderCode?.Code?.trim() !== "";
    const grnCodeSelected = data.selectedGrnOrderCode?.some(
      (code) => code.Code?.trim() !== ""
    );

    return poCodeSelected || grnCodeSelected;
  };

  // Get selected items count
  const selectedCount = invoiceItems.filter((item) => item.isSelected).length;
  const totalCount = invoiceItems.length;

  return (
    <div className="flex flex-col p-2 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-end space-x-4  w-full mb-4">
        {hideButtons && (
          <>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedCount} of {totalCount} items selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllItems}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllItems}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <motion.button
              onClick={autoMatchItems}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Auto-Match
            </motion.button>
          </>
        )}
      </div>

      <div className="flex gap-8">
        {/* SAP Items */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-3">SAP Items</h2>
          <Loading isLoading={isLoading}>
            <div className="flex flex-col rounded-lg bg-none">
              {isLoading ? (
                <LoadingMessage />
              ) : error ? (
                <ErrorMessage message={error} />
              ) : !isReferenceCodeSelected(data) ? (
                <EmptyStateMessage />
              ) : sapItems.length === 0 ? (
                <NoDataFoundMessage />
              ) : (
                <div className="flex flex-col">
                  {sapItems.map((item, index) => {
                    const isItemMatched = isSapItemMatched(
                      item.LineNum,
                      matchedPairs
                    );
                    const matchedInvoiceId = matchedPairs[item.LineNum];
                    const matchedInvoiceIndex = matchedInvoiceId
                      ? invoiceItems.findIndex(
                          (inv) => inv.id === matchedInvoiceId
                        )
                      : -1;
                    const isAligned = matchedInvoiceIndex === index;

                    return (
                      <SAPItem
                        key={item.LineNum}
                        item={item}
                        index={index}
                        isMatched={isItemMatched}
                        isAligned={isAligned}
                        totalItems={sapItems.length}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </Loading>
        </div>

        {/* Vertical divider */}
        <div className="border-l border-gray-300"></div>

        {/* Invoice Items */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-3">Invoice Items</h2>
          <div className="flex flex-col">
            {invoiceItems.map((item, index) => {
              const isItemMatched = isInvoiceItemMatched(item.id, matchedPairs);
              const matchedSapIndex = getMatchingSapIndex(
                item.id,
                matchedPairs,
                sapItems
              );
              const isAligned = matchedSapIndex === index;

              return (
                <InvoiceItem
                  key={item.id}
                  item={item}
                  index={index}
                  currency={data.DocumentCurrencyCode ?? ""}
                  isMatched={isItemMatched}
                  isAligned={isAligned}
                  isSelected={item.isSelected}
                  totalItems={invoiceItems.length}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onSelectionChange={handleSelectionChange}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
