import React from "react";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";
import { ImageIcon } from "lucide-react";
import { Input } from "../from-to-step/Input";

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invoice Logo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload image</span>
          </label>
        </div>
      </div>

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

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Choose Invoice Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Template 1", "Template 2"].map((template) => (
            <div
              key={template}
              className={`border rounded-lg p-4 cursor-pointer ${
                data.invoiceDetails.template === template
                  ? "border-navy-500 bg-navy-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                onUpdate({
                  invoiceDetails: {
                    ...data.invoiceDetails,
                    template,
                  },
                })
              }
            >
              <h4 className="font-medium">{template}</h4>
              <div className="mt-2 h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-sm text-gray-500">Preview</span>
              </div>
            </div>
          ))}
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
