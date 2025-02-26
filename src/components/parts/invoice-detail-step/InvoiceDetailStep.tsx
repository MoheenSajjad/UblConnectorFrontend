import React from "react";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";
import { ImageIcon } from "lucide-react";
import { Input } from "../header-fields-step/Input";

export const InvoiceDetailsStep: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({
        invoiceDetails: { ...data.invoiceDetails, logo: file },
      });
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Invoice Number"
          value={data.invoiceDetails.invoiceNumber}
          onChange={(e) =>
            onUpdate({
              invoiceDetails: {
                ...data.invoiceDetails,
                invoiceNumber: e.target.value,
              },
            })
          }
          placeholder="Invoice number"
        />

        <Input
          label="Issue Date"
          type="date"
          value={data.invoiceDetails.issueDate}
          onChange={(e) =>
            onUpdate({
              invoiceDetails: {
                ...data.invoiceDetails,
                issueDate: e.target.value,
              },
            })
          }
        />

        <Input
          label="Due Date"
          type="date"
          value={data.invoiceDetails.dueDate}
          onChange={(e) =>
            onUpdate({
              invoiceDetails: {
                ...data.invoiceDetails,
                dueDate: e.target.value,
              },
            })
          }
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={data.invoiceDetails.currency}
            onChange={(e) =>
              onUpdate({
                invoiceDetails: {
                  ...data.invoiceDetails,
                  currency: e.target.value,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
          >
            <option value="USD">United States Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
