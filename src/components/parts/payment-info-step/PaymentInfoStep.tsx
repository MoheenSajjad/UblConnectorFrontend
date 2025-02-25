import React from "react";
import { Input } from "../from-to-step/Input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";

export const PaymentInfoStep: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleUpdate = (field: string, value: string) => {
    onUpdate({
      paymentInfo: { ...data.paymentInfo, [field]: value },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6">Payment Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bank Name"
            value={data.paymentInfo.bankName}
            onChange={(e) => handleUpdate("bankName", e.target.value)}
            placeholder="Enter bank name"
          />

          <Input
            label="Account Name"
            value={data.paymentInfo.accountName}
            onChange={(e) => handleUpdate("accountName", e.target.value)}
            placeholder="Enter account name"
          />

          <Input
            label="Account Number"
            value={data.paymentInfo.accountNumber}
            onChange={(e) => handleUpdate("accountNumber", e.target.value)}
            placeholder="Enter account number"
            className="md:col-span-2"
          />
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </div>
  );
};
