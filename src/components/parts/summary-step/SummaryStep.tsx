import React, { useRef } from "react";
import { Input } from "../from-to-step/Input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";
import { RotateCw } from "lucide-react";

export const SummaryStep: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  const handleUpdate = (field: keyof typeof data.summary, value: any) => {
    onUpdate({
      summary: { ...data.summary, [field]: value },
    });
  };

  const calculateSubtotal = () => {
    return data.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * data.summary.discount) / 100;
    const taxAmount = (subtotal * data.summary.tax) / 100;
    return subtotal - discountAmount + taxAmount + data.summary.shipping;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signature = canvas.toDataURL();
    handleUpdate("signature", signature);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    handleUpdate("signature", undefined);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Signature</h3>
        <div className="border rounded-lg p-4">
          <canvas
            ref={canvasRef}
            // width={580}
            // height={250}
            className="border w-full border-gray-300 rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <button
            onClick={clearSignature}
            className="mt-2 flex items-center text-gray-600 hover:text-gray-800"
          >
            <RotateCw className="w-4 h-4 mr-1" />
            Clear Signature
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={data.summary.additionalNotes}
            onChange={(e) => handleUpdate("additionalNotes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            rows={4}
            placeholder="Add any additional notes here"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Terms
          </label>
          <textarea
            value={data.summary.paymentTerms}
            onChange={(e) => handleUpdate("paymentTerms", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            rows={2}
            placeholder="Ex: Net 30"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              {calculateSubtotal().toFixed(2)} {data.invoiceDetails.currency}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.summary.discount > 0}
                  onChange={(e) =>
                    handleUpdate("discount", e.target.checked ? 0 : 0)
                  }
                  className="mr-2"
                />
                <span>Discount</span>
              </label>
              {data.summary.discount > 0 && (
                <Input
                  type="number"
                  value={data.summary.discount}
                  onChange={(e) =>
                    handleUpdate("discount", parseFloat(e.target.value))
                  }
                  className="w-24"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.summary.tax > 0}
                  onChange={(e) =>
                    handleUpdate("tax", e.target.checked ? 0 : 0)
                  }
                  className="mr-2"
                />
                <span>Tax</span>
              </label>
              {data.summary.tax > 0 && (
                <Input
                  type="number"
                  value={data.summary.tax}
                  onChange={(e) =>
                    handleUpdate("tax", parseFloat(e.target.value))
                  }
                  className="w-24"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.summary.shipping > 0}
                  onChange={(e) =>
                    handleUpdate("shipping", e.target.checked ? 0 : 0)
                  }
                  className="mr-2"
                />
                <span>Shipping</span>
              </label>
              {data.summary.shipping > 0 && (
                <Input
                  type="number"
                  value={data.summary.shipping}
                  onChange={(e) =>
                    handleUpdate("shipping", parseFloat(e.target.value))
                  }
                  className="w-24"
                />
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount</span>
              <span>
                {calculateTotal().toFixed(2)} {data.invoiceDetails.currency}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.summary.includeInWords}
                onChange={(e) =>
                  handleUpdate("includeInWords", e.target.checked)
                }
                className="mr-2"
              />
              <span>Include Total in Words</span>
            </label>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-between mt-8">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Generate Invoice</Button>
      </div>
    </div>
  );
};
