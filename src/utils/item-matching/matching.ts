import { ReactNode } from "react";

export interface SAPItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  lineExtensionAmount: string;
}

export interface IInvoiceItem extends SAPItem {
  isSelected: boolean;
}

export interface MatchingMessage {
  title: string;
  message: string;
  icon: ReactNode;
}

// Helper functions for matching logic
export const findInitialMatches = (
  sapItems: any[],
  invoiceItems: SAPItem[],
  priceField: keyof any = "LineTotal"
): Record<string, string> => {
  const initialMatches: Record<string, string> = {};
  const usedInvoiceIds = new Set<string>();

  sapItems.forEach((sapItem, sapIndex) => {
    // Try to find a matching invoice item at the same index first
    if (
      sapIndex < invoiceItems.length &&
      parseFloat(sapItem[priceField]?.toString()) ===
        parseFloat(invoiceItems[sapIndex].lineExtensionAmount)
    ) {
      initialMatches[sapItem.LineNum] = invoiceItems[sapIndex].id;
      usedInvoiceIds.add(invoiceItems[sapIndex].id);
    } else {
      // If no match at same index, look for any match
      const matchingInvoiceItem = invoiceItems.find(
        (invItem) =>
          parseFloat(invItem.lineExtensionAmount) ===
            parseFloat(sapItem[priceField]?.toString()) &&
          !usedInvoiceIds.has(invItem.id)
      );

      if (matchingInvoiceItem) {
        initialMatches[sapItem.LineNum] = matchingInvoiceItem.id;
        usedInvoiceIds.add(matchingInvoiceItem.id);
      }
    }
  });

  return initialMatches;
};

export const rearrangeInvoiceItems = (
  invoiceItems: IInvoiceItem[],
  sapItems: any[],
  matchedPairs: Record<string, string>
): IInvoiceItem[] => {
  const reorderedInvoiceItems = [...invoiceItems];
  const newInvoiceOrder: IInvoiceItem[] = Array(sapItems.length).fill(null);

  // First, place matched items in positions corresponding to their SAP matches
  sapItems.forEach((sapItem, index) => {
    const matchedInvoiceId = Object.entries(matchedPairs).find(
      ([sapId]) => sapId === sapItem.LineNum?.toString()
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

  return finalInvoiceOrder;
};

export const updateMatchesAfterSwap = (
  sapItems: any[],
  newInvoiceItems: SAPItem[],
  currentMatchedPairs: Record<string, string>,
  positions: number[]
): Record<string, string> => {
  const newMatchedPairs = { ...currentMatchedPairs };

  // Check the affected positions for matches after the swap
  positions.forEach((index) => {
    if (index < sapItems.length) {
      const sapItem = sapItems[index];
      const invoiceItem = newInvoiceItems[index];

      // If item at this position matches by price, create a match
      if (
        parseFloat(sapItem?.LineTotal?.toString()) ===
        parseFloat(invoiceItem.lineExtensionAmount)
      ) {
        newMatchedPairs[sapItem.LineNum] = invoiceItem.id;
      } else {
        // If there was a match at this position before, remove it
        if (newMatchedPairs[sapItem.LineNum]) {
          delete newMatchedPairs[sapItem.LineNum];
        }
      }
    }
  });

  return newMatchedPairs;
};

// Helper functions for checking matches
export const isSapItemMatched = (
  sapItemId: number,
  matchedPairs: Record<string, string>
): boolean => {
  return matchedPairs[sapItemId] !== undefined;
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
  for (const [sapId, invId] of Object.entries(matchedPairs)) {
    if (invId === invoiceItemId) {
      return sapId;
    }
  }
  return null;
};

export const getMatchingSapIndex = (
  invoiceItemId: string,
  matchedPairs: Record<string, string>,
  sapItems: any[]
): number => {
  const matchingSapId = getMatchingSapId(invoiceItemId, matchedPairs);
  if (matchingSapId) {
    return sapItems.findIndex(
      (item) => item.LineNum?.toString() === matchingSapId
    );
  }
  return -1;
};
