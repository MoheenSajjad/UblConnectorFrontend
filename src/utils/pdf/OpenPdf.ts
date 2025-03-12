import { useNotify } from "@/components/ui/Notify";
import { error } from "console";

export const openPdfInNewTab = (base64String: string | null) => {
  if (!base64String) return;

  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  const blobUrl = URL.createObjectURL(blob);
  const newTab = window.open(blobUrl, "_blank");

  if (!newTab) {
    alert("Please allow popups for this website.");
  }
};
