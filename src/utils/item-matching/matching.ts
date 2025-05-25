import { OrderLine } from "@/types/sap";
import { ReactNode } from "react";

export interface SAPItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  lineExtensionAmount: string;
  lineNum: number;
  docEntry: number;
}

export interface IInvoiceItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  lineExtensionAmount: string;
  isSelected: boolean;
}

export interface MatchingMessage {
  title: string;
  message: string;
  icon: ReactNode;
}

// Create a unique key for SAP items
export const getSapItemUniqueKey = (sapItem: OrderLine): string => {
  return `${sapItem.lineNum}-${sapItem.docEntry}`;
};

export const findInitialMatches = (
  sapItems: OrderLine[],
  invoiceItems: IInvoiceItem[],
  priceField: keyof OrderLine = "lineTotal"
): Record<string, string> => {
  const initialMatches: Record<string, string> = {};
  const usedInvoiceIds = new Set<string>();

  sapItems.forEach((sapItem, sapIndex) => {
    const sapItemUniqueKey = getSapItemUniqueKey(sapItem);

    // Try to find a matching invoice item at the same index first
    if (
      sapIndex < invoiceItems.length &&
      Math.abs(
        parseFloat(sapItem[priceField]?.toString() || "0") -
          parseFloat(invoiceItems[sapIndex].lineExtensionAmount)
      ) < 0.01
    ) {
      initialMatches[sapItemUniqueKey] = invoiceItems[sapIndex].id;
      usedInvoiceIds.add(invoiceItems[sapIndex].id);
    } else {
      // If no match at same index, look for any match
      const matchingInvoiceItem = invoiceItems.find(
        (invItem) =>
          Math.abs(
            parseFloat(invItem.lineExtensionAmount) -
              parseFloat(sapItem[priceField]?.toString() || "0")
          ) < 0.01 && !usedInvoiceIds.has(invItem.id)
      );

      if (matchingInvoiceItem) {
        initialMatches[sapItemUniqueKey] = matchingInvoiceItem.id;
        usedInvoiceIds.add(matchingInvoiceItem.id);
      }
    }
  });

  return initialMatches;
};

export const rearrangeInvoiceItems = (
  invoiceItems: IInvoiceItem[],
  sapItems: OrderLine[],
  matchedPairs: Record<string, string>
): IInvoiceItem[] => {
  // Create a copy of the original invoice items to work with
  const newInvoiceOrder = [...invoiceItems];

  // First, move matched items to their corresponding SAP item indices
  sapItems.forEach((sapItem, sapIndex) => {
    const sapItemUniqueKey = getSapItemUniqueKey(sapItem);
    const matchedInvoiceId = matchedPairs[sapItemUniqueKey];

    if (matchedInvoiceId) {
      // Find the index of the matched invoice item in the original array
      const currentMatchedItemIndex = newInvoiceOrder.findIndex(
        (item) => item.id === matchedInvoiceId
      );

      if (
        currentMatchedItemIndex !== -1 &&
        currentMatchedItemIndex !== sapIndex
      ) {
        // Remove the item from its current position
        const [matchedItem] = newInvoiceOrder.splice(
          currentMatchedItemIndex,
          1
        );

        // Insert the item at the SAP item's index
        // If the index is beyond the current array length, it will be added at the end
        if (sapIndex < newInvoiceOrder.length) {
          newInvoiceOrder.splice(sapIndex, 0, matchedItem);
        } else {
          newInvoiceOrder.push(matchedItem);
        }
      }
    }
  });

  return newInvoiceOrder;
};

export const updateMatchesAfterSwap = (
  sapItems: OrderLine[],
  newInvoiceItems: IInvoiceItem[],
  currentMatchedPairs: Record<string, string>,
  positions: number[]
): Record<string, string> => {
  const newMatchedPairs = { ...currentMatchedPairs };

  // Check the affected positions for matches after the swap
  positions.forEach((index) => {
    if (index < sapItems.length) {
      const sapItem = sapItems[index];
      const invoiceItem = newInvoiceItems[index];
      const sapItemUniqueKey = getSapItemUniqueKey(sapItem);

      // If item at this position matches by price, create a match
      if (
        Math.abs(
          parseFloat(sapItem.lineTotal.toString() || "0") -
            parseFloat(invoiceItem.lineExtensionAmount)
        ) < 0.01
      ) {
        newMatchedPairs[sapItemUniqueKey] = invoiceItem.id;
      } else {
        // If there was a match at this position before, remove it
        if (newMatchedPairs[sapItemUniqueKey]) {
          delete newMatchedPairs[sapItemUniqueKey];
        }
      }
    }
  });

  return newMatchedPairs;
};

// Helper functions for checking matches
export const isSapItemMatched = (
  sapItem: OrderLine,
  matchedPairs: Record<string, string>
): boolean => {
  const sapItemUniqueKey = getSapItemUniqueKey(sapItem);

  return matchedPairs[sapItemUniqueKey] !== undefined;
};

export const isInvoiceItemMatched = (
  invoiceItemId: string,
  matchedPairs: Record<string, string>
): boolean => {
  return Object.values(matchedPairs).includes(invoiceItemId);
};

export const getMatchingSapId = (
  invoiceItemId: string,
  matchedPairs: Record<string, string>
): string | null => {
  for (const [sapItemUniqueKey, invId] of Object.entries(matchedPairs)) {
    if (invId === invoiceItemId) {
      return sapItemUniqueKey;
    }
  }
  return null;
};

export const getMatchingSapIndex = (
  invoiceItemId: string,
  matchedPairs: Record<string, string>,
  sapItems: OrderLine[]
): number => {
  const matchingSapUniqueKey = getMatchingSapId(invoiceItemId, matchedPairs);
  if (matchingSapUniqueKey) {
    return sapItems.findIndex(
      (item) => getSapItemUniqueKey(item) === matchingSapUniqueKey
    );
  }
  return -1;
};
