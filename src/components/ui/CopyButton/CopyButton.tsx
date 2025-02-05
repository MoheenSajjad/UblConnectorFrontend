import { CheckIcon } from "@/components/icons/check-icon";
import { CopyIcon } from "@/components/icons/copy-icon";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  return (
    <div
      onClick={handleCopy}
      className={`flex items-center rounded-lg cursor-pointer ml-auto py-1 px-3 absolute right-3 top-2 w-max ${
        isCopied ? "bg-green-500/10" : "bg-gray-200"
      } text-gray-700`}
    >
      {isCopied ? (
        <>
          <CheckIcon className="text-green-500" />
          <span className="text-sm ml-2 font-medium tracking-wider text-green-500 overflow-hidden break-words">
            Copied
          </span>
        </>
      ) : (
        <>
          <CopyIcon />
          <span className="text-sm ml-2 font-medium tracking-wider text-gray-700 overflow-hidden break-words">
            Copy
          </span>
        </>
      )}
    </div>
  );
};
