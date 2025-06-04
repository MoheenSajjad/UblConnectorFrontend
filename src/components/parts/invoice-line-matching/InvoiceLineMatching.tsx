import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  getSapItemUniqueKey,
} from "@/utils/item-matching";
import { SAPItem } from "./SapItem";
import { ApiResponse } from "@/types";
import { Button, ButtonVariant } from "@/components/ui/Button";
import { RefreshButton } from "@/components/ui/Buttons";

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
  isReadOnly: boolean;
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
  isReadOnly,
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

  const handelFetchSAPItems = useCallback(() => {
    const handleError = (err: Error) => {
      console.error("Error fetching SAP items:", err);
      setError(err.message || "Failed to load SAP items");
      onSapItemsUpdate([]);
      setSapItems([]);
      setIsLoading(false);
    };

    try {
      if (docEntry && data?.selectedPoOrderCode?.Code && poCode) {
        setIsLoading(true);
        setError(null);

        getSAPPurchaseOrderLines(transactionId, docEntry, poCode)
          .then((items) => {
            const sapItemsData = items || [];
            setSapItems(sapItemsData);
            onSapItemsUpdate(sapItemsData);
            setIsLoading(false);
          })
          .catch(handleError);
      } else if (grnCodes && data?.selectedGrnOrderCode.length > 0) {
        const docEntries = data.selectedGrnOrderCode.map((item) => item.Value);
        const cardCodes = data.selectedGrnOrderCode.map((item) => item.Code);

        setIsLoading(true);
        setError(null);

        getSAPGoodReceiptLines(transactionId, docEntries, cardCodes)
          .then((items) => {
            const sapItemsData = items || [];
            setSapItems(sapItemsData);
            onSapItemsUpdate(sapItemsData);
            setIsLoading(false);
          })
          .catch(handleError);
      }
    } catch (err) {
      handleError(err as Error);
    }
  }, [
    docEntry,
    data?.selectedPoOrderCode,
    data?.selectedGrnOrderCode,
    poCode,
    transactionId,
    grnCodes,
    onSapItemsUpdate,
  ]);
  useEffect(() => {
    handelFetchSAPItems();
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
            parseFloat(sapItem.lineTotal.toString()) &&
          !usedInvoiceIds.has(invItem.id)
      );

      if (matchingInvoiceItem) {
        newMatchedPairs[getSapItemUniqueKey(sapItem)] = matchingInvoiceItem.id;
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
  const selectedCount = useMemo(
    () => invoiceItems.filter((item) => item.isSelected).length,
    [invoiceItems]
  );
  const totalCount = invoiceItems.length;

  const calculateTotals = useMemo(() => {
    // Calculate SAP Items Total
    const sapItemsTotal = sapItems.reduce(
      (sum, item) => sum + parseFloat(item.lineTotal.toString()),
      0
    );

    // Calculate Invoice Items Total
    const invoiceItemsTotal = invoiceItems.reduce(
      (sum, item) => sum + parseFloat(item.lineExtensionAmount),
      0
    );

    // Calculate the difference
    const difference = Math.abs(sapItemsTotal - invoiceItemsTotal);

    return {
      sapItemsTotal,
      invoiceItemsTotal,
      difference,
      isBalanced: Math.abs(difference) < 0.01, // Small tolerance for floating-point comparison
    };
  }, [sapItems, invoiceItems]);

  const currency = data?.DocumentcurrencyCode || "USD";

  return (
    <>
      <div className="flex flex-col p-2 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between space-x-4  w-full mb-4">
          <RefreshButton
            handleRefresh={handelFetchSAPItems}
            text="Refetch Doc Lines"
          />

          {!isReadOnly && (
            <div className="flex space-x-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {selectedCount} of {totalCount} items selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant={ButtonVariant.Secondary}
                    className="!font-normal"
                    onClick={selectAllItems}
                  >
                    Select All
                  </Button>
                  <Button
                    variant={ButtonVariant.Secondary}
                    className="!font-normal"
                    onClick={deselectAllItems}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <Button onClick={autoMatchItems}>Auto Match</Button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* SAP Items */}
          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-3">Document Lines</h2>
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
                        item,
                        matchedPairs
                      );
                      const matchedInvoiceId =
                        matchedPairs[getSapItemUniqueKey(item)];
                      const matchedInvoiceIndex = matchedInvoiceId
                        ? invoiceItems.findIndex(
                            (inv) => inv.id === matchedInvoiceId
                          )
                        : -1;
                      const isAligned = matchedInvoiceIndex === index;

                      return (
                        <SAPItem
                          key={`${item.lineNum}-${item.docEntry}`}
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
                const isItemMatched = isInvoiceItemMatched(
                  item.id,
                  matchedPairs
                );
                const matchedSapIndex = getMatchingSapIndex(
                  item.id,
                  matchedPairs,
                  sapItems
                );
                const isAligned = matchedSapIndex === index;

                if (isReadOnly && !item.isSelected) return;

                return (
                  <InvoiceItem
                    key={item.id}
                    item={item}
                    index={index}
                    currency={data.DocumentcurrencyCode ?? ""}
                    isMatched={isItemMatched}
                    isAligned={isAligned}
                    isSelected={item.isSelected}
                    isReadOnly={isReadOnly}
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
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Document Lines</p>
            <p className="text-xl font-bold text-blue-600">
              {calculateTotals.sapItemsTotal.toLocaleString("en-US", {
                style: "currency",
                currency,
              })}
            </p>
            <p className="text-xs text-gray-500">
              Total Items: {sapItems.length}
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Invoice Items</p>
            <p className="text-xl font-bold text-green-600">
              {calculateTotals.invoiceItemsTotal.toLocaleString("en-US", {
                style: "currency",
                currency,
              })}
            </p>
            <p className="text-xs text-gray-500">
              Total Items: {invoiceItems.length}
            </p>
          </div>

          <div
            className={`
          p-3 rounded-lg
          ${
            calculateTotals.isBalanced
              ? "bg-green-50 border-green-500 border-2"
              : "bg-red-50 border-red-500 border-2"
          }
        `}
          >
            <p className="text-sm text-gray-600">Difference Analysis</p>
            <p
              className={`
            text-xl font-bold 
            ${calculateTotals.isBalanced ? "text-green-600" : "text-red-600"}
          `}
            >
              {calculateTotals.difference.toLocaleString("en-US", {
                style: "currency",
                currency,
              })}
            </p>
            <div className="">
              <p
                className={`
              text-sm
              ${calculateTotals.isBalanced ? "text-green-700" : "text-red-700"}
            `}
              >
                {calculateTotals.isBalanced
                  ? "Amounts are balanced"
                  : "Amounts do not match"}
              </p>
            </div>
          </div>
        </div>

        {!calculateTotals.isBalanced && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700">
              ⚠️ The total amounts do not match. Please review the items
              carefully.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
