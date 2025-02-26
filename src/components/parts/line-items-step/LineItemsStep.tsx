import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";
import { Info } from "lucide-react";
import { BusinessPartnerDropdown } from "../business-partner-dropdown";
import { OrderCodeDropdown } from "../order-code-dropdown";

export const LineItemsStep: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  return (
    <div>
      <div className="bg-white rounded-lg ">
        <div className="grid grid-cols-12 gap-4  p-2 border-b text-sm font-medium text-gray-600">
          <div className="col-span-2 text-center">
            {data.selectedReferenceType === "po"
              ? "PURCHASE ORDER CODE"
              : "GOOD RECEIPT CODE"}
          </div>
          <div className="col-span-2 text-center">
            {data.selectedReferenceType === "po"
              ? "PURCHASE ORDER LINE"
              : "GOOD RECEIPT LINES"}
          </div>
          <div className="col-span-2 text-center">VAT</div>{" "}
          <div className="col-span-3 text-center">ITEM NAME</div>
          <div className="col-span-1 text-center">QTY</div>
          <div className="col-span-1 text-center">PRICE</div>
          <div className="col-span-1 text-center">AMOUNT</div>
        </div>

        <div>
          {[
            { name: "Coca Cola", qty: 12, price: 0.5 },
            { name: "Noodle Can", qty: 5, price: 0.75 },
            { name: "Beer", qty: 6, price: 0.5 },
            { name: "Fanta", qty: 8, price: 0.5 },
            { name: "Pepsi", qty: 12, price: 0.5 },
          ].map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-12 gap-2 p-2 items-center`}
            >
              <div className="col-span-2">
                <OrderCodeDropdown
                  placeholder="Select Code..."
                  selectedItem={data.selectedBusinessPartner}
                  onSelect={(item) => {}}
                  clearSelection={() => {}}
                />
              </div>
              <div className="col-span-2">
                <OrderCodeDropdown
                  placeholder="Select Code..."
                  selectedItem={data.selectedBusinessPartner}
                  onSelect={(item) => {}}
                  clearSelection={() => {}}
                />
              </div>
              <div className="col-span-2">
                <OrderCodeDropdown
                  placeholder="Select Code..."
                  selectedItem={data.selectedBusinessPartner}
                  onSelect={(item) => {}}
                  clearSelection={() => {}}
                />
              </div>

              <div className="col-span-3 font-medium  bg-gray-100 p-1 rounded text-gray-500">
                {item.name}
              </div>
              <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-500">
                {item.qty}
              </div>
              <div className="col-span-1 text-center  bg-gray-100 p-1 rounded flex items-center justify-center">
                <span className="text-gray-600 mr-1">
                  {item.price.toFixed(2)}
                </span>

                <Info className="w-4 h-4 text-gray-500" />
              </div>
              <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-600">
                {(item.qty * item.price).toFixed(2)}
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
