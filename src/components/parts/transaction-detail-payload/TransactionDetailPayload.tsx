import { CopyButton } from "@/components/ui/CopyButton";

interface TransactionDetailPayloadProps {
  payload: string;
}
export const TransactionDetailPayload = ({
  payload,
}: TransactionDetailPayloadProps) => {
  return (
    <div className="relative">
      <CopyButton text={payload} />

      <div
        style={{ height: "calc(100dvh - 190px - 3.75rem)" }}
        className="bg-gray-100 p-4 rounded-md border-2 border-gray-300 overflow-auto custom-scroll"
      >
        <pre>{payload}</pre>
      </div>
    </div>
  );
};
