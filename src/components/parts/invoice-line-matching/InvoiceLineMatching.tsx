import { useState, useRef, useEffect } from "react";
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
} from "@/utils/item-matching";
import { SAPItem } from "./SapItem";

// Define props interface
interface SAPInvoiceMatchingProps {
  data: Invoice;
  docEntry: number;
  cardCode: string;
  cardCodes: selectedCodeItem[];
  transactionId?: string;
}

export function InvoiceLineMatching({
  data,
  docEntry,
  cardCode,
  transactionId,
  cardCodes,
}: SAPInvoiceMatchingProps) {
  // State for SAP items from API
  const [sapItems, setSapItems] = useState<OrderLine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Convert Invoice data to our internal format
  const [invoiceItems, setInvoiceItems] = useState<SAPItemType[]>([]);

  useEffect(() => {
    if (data?.InvoiceLine) {
      const items = data.InvoiceLine.map((line) => ({
        id: line.ID,
        name: line.Item.Name,
        price: line.Price.PriceAmount,
        quantity: line.InvoicedQuantity,
        lineExtensionAmount: line.LineExtensionAmount,
      }));
      setInvoiceItems(items);
    }
  }, [data]);

  // State to track matched items
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Refs for drag and drop
  const dragItem = useRef<{ id: string; index: number } | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Fetch SAP data when relevant props change
  useEffect(() => {
    if (docEntry && data?.selectedPoOrderCode?.Code && cardCode) {
      setIsLoading(true);
      setError(null);

      getSAPPurchaseOrderLines(transactionId, docEntry, cardCode)
        .then((items) => {
          const orderLineData: OrderLineResponse = items;
          setSapItems(orderLineData?.value[0]?.DocumentLines || []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching SAP Purchase Order Lines:", err);
          setError("Failed to load SAP items");
          setSapItems([]);
          setIsLoading(false);
        });
    } else if (cardCodes && data?.selectedGrnOrderCode.length > 0) {
      const docEntry = data.selectedGrnOrderCode[0]?.Value;
      setIsLoading(true);
      setError(null);

      getSAPGoodReceiptLines(transactionId, docEntry, cardCodes[0]?.Code)
        .then((items) => {
          const orderLineData: OrderLineResponse = items;
          setSapItems(orderLineData?.value[0]?.DocumentLines || []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching SAP Good Receipt Lines:", err);
          setError("Failed to load SAP items");
          setSapItems([]);
          setIsLoading(false);
        });
    }
  }, [
    data?.selectedPoOrderCode,
    data?.selectedGrnOrderCode,
    docEntry,
    cardCode,
    transactionId,
    cardCodes,
  ]);

  // Reset state when reference code or business partner changes
  useEffect(() => {
    setSapItems([]);
    setMatchedPairs({});
  }, [data.selectedReferenceCode, data.selectedBusinessPartner]);

  // Automatically find initial matches when items change
  useEffect(() => {
    const initialMatches = findInitialMatches(sapItems, invoiceItems);

    // If any matches were found, set them
    if (Object.keys(initialMatches).length > 0) {
      setMatchedPairs(initialMatches);
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
            parseFloat(sapItem.Price?.toString()) &&
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

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
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
              ) : !data?.selectedPoOrderCode ? (
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
                  isMatched={isItemMatched}
                  isAligned={isAligned}
                  totalItems={invoiceItems.length}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
