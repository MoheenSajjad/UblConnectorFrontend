import React from "react";
import { Input } from "../from-to-step/Input";
import { Button } from "@/components/ui/Button";
import { StepProps, LineItem } from "@/types/edit-payload";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

export const LineItemsStep: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const addNewItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 0,
      rate: 0,
      description: "",
    };
    onUpdate({ lineItems: [...data.lineItems, newItem] });
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const updatedItems = [...data.lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({ lineItems: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = data.lineItems.filter((_, i) => i !== index);
    onUpdate({ lineItems: updatedItems });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.lineItems.length) return;

    const updatedItems = [...data.lineItems];
    [updatedItems[index], updatedItems[newIndex]] = [
      updatedItems[newIndex],
      updatedItems[index],
    ];
    onUpdate({ lineItems: updatedItems });
  };

  return (
    <div>
      {data.lineItems.map((item, index) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">#{index + 1}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoveUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => moveItem(index, "down")}
                disabled={index === data.lineItems.length - 1}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoveDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => removeItem(index)}
                className="p-1 hover:bg-red-100 text-red-600 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Name"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              placeholder="Item name"
            />
            <Input
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", parseFloat(e.target.value))
              }
              placeholder="0"
            />
            <Input
              label={`Rate (${data.invoiceDetails.currency})`}
              type="number"
              value={item.rate}
              onChange={(e) =>
                updateItem(index, "rate", parseFloat(e.target.value))
              }
              placeholder="0.00"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
              rows={2}
              placeholder="Item description"
            />
          </div>

          <div className="mt-4 text-right">
            <p className="text-lg font-medium">
              Total: {(item.quantity * item.rate).toFixed(2)}{" "}
              {data.invoiceDetails.currency}
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={addNewItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-navy-500 hover:text-navy-500 transition-colors duration-200 mb-6"
      >
        <Plus className="inline-block w-5 h-5 mr-2" />
        Add a new item
      </button>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
