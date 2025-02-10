import { CopyButton } from "@/components/ui/CopyButton";

interface TransactionDetailPayloadProps {
  payload: string;
}
export const TransactionDetailJsonPayload = ({
  payload,
}: TransactionDetailPayloadProps) => {
  let parsedPayload;

  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    return <div className="text-red-500">Invalid JSON Payload</div>;
  }

  return (
    <PayloadContainer payload={payload}>
      <pre>{JSON.stringify(parsedPayload, null, 2)}</pre>
    </PayloadContainer>
  );
};

export const TransactionDetailXmlPayload = ({
  payload,
}: TransactionDetailPayloadProps) => {
  const formatXml = (xml: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");
      const serializer = new XMLSerializer();
      return serializer.serializeToString(xmlDoc);
    } catch (error) {
      return "Invalid XML Payload";
    }
  };

  return (
    <PayloadContainer payload={payload}>
      <pre>{formatXml(payload)}</pre>
    </PayloadContainer>
  );
};

const PayloadContainer = ({
  payload,
  children,
}: {
  payload: string;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <CopyButton text={payload} />
    <div
      style={{ height: "calc(100dvh - 190px - 3.75rem)" }}
      className="bg-gray-100 p-4 rounded-md border-2 border-gray-300 overflow-auto custom-scroll"
    >
      {children}
    </div>
  </div>
);
