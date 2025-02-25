import React from "react";
import { Input } from "./Input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";

export const FromToStep: React.FC<StepProps> = ({ data, onUpdate, onNext }) => {
  const handleFromUpdate = (field: string, value: string) => {
    onUpdate({
      billFrom: { ...data.billFrom, [field]: value },
    });
  };

  const handleToUpdate = (field: string, value: string) => {
    onUpdate({
      billTo: { ...data.billTo, [field]: value },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Bill From:</h3>
        <Input
          label="Name"
          value={data.billFrom.name}
          onChange={(e) => handleFromUpdate("name", e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="Address"
          value={data.billFrom.address}
          onChange={(e) => handleFromUpdate("address", e.target.value)}
          placeholder="Your address"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Zip"
            value={data.billFrom.zip}
            onChange={(e) => handleFromUpdate("zip", e.target.value)}
            placeholder="Your zip code"
          />
          <Input
            label="City"
            value={data.billFrom.city}
            onChange={(e) => handleFromUpdate("city", e.target.value)}
            placeholder="Your city"
          />
        </div>
        <Input
          label="Country"
          value={data.billFrom.country}
          onChange={(e) => handleFromUpdate("country", e.target.value)}
          placeholder="Your country"
        />
        <Input
          label="Email"
          type="email"
          value={data.billFrom.email}
          onChange={(e) => handleFromUpdate("email", e.target.value)}
          placeholder="Your email"
        />
        <Input
          label="Phone"
          value={data.billFrom.phone}
          onChange={(e) => handleFromUpdate("phone", e.target.value)}
          placeholder="Your phone number"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
        <Input
          label="Name"
          value={data.billTo.name}
          onChange={(e) => handleToUpdate("name", e.target.value)}
          placeholder="Receiver name"
        />
        <Input
          label="Address"
          value={data.billTo.address}
          onChange={(e) => handleToUpdate("address", e.target.value)}
          placeholder="Receiver address"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Zip"
            value={data.billTo.zip}
            onChange={(e) => handleToUpdate("zip", e.target.value)}
            placeholder="Receiver zip code"
          />
          <Input
            label="City"
            value={data.billTo.city}
            onChange={(e) => handleToUpdate("city", e.target.value)}
            placeholder="Receiver city"
          />
        </div>
        <Input
          label="Country"
          value={data.billTo.country}
          onChange={(e) => handleToUpdate("country", e.target.value)}
          placeholder="Receiver country"
        />
        <Input
          label="Email"
          type="email"
          value={data.billTo.email}
          onChange={(e) => handleToUpdate("email", e.target.value)}
          placeholder="Receiver email"
        />
        <Input
          label="Phone"
          value={data.billTo.phone}
          onChange={(e) => handleToUpdate("phone", e.target.value)}
          placeholder="Receiver phone number"
        />
      </div>

      <div className="md:col-span-2 flex justify-end mt-6">
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
