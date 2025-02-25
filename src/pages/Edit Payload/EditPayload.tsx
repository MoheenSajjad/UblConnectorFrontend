import { FromToStep } from "@/components/parts/from-to-step";
import { InvoiceDetailsStep } from "@/components/parts/invoice-detail-step/InvoiceDetailStep";
import { LineItemsStep } from "@/components/parts/line-items-step";
import { PaymentInfoStep } from "@/components/parts/payment-info-step";
import { StepIndicator } from "@/components/parts/step-indicator";
import { SummaryStep } from "@/components/parts/summary-step";
import { Actionbar } from "@/components/ui/ActionBar";
import { Loading } from "@/components/ui/Loading";
import { InvoiceFormData } from "@/types/edit-payload";
import { useState } from "react";

const STEPS = [
  "From & To",
  "Invoice Details",
  "Line Items",
  "Payment Info",
  "Summary",
];

const initialData: InvoiceFormData = {
  billFrom: {
    name: "",
    address: "",
    zip: "",
    city: "",
    country: "",
    email: "",
    phone: "",
  },
  billTo: {
    name: "",
    address: "",
    zip: "",
    city: "",
    country: "",
    email: "",
    phone: "",
  },
  invoiceDetails: {
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    currency: "USD",
    template: "Template 1",
  },
  lineItems: [
    {
      id: "item-1",
      name: "",
      quantity: 0,
      rate: 0,
      description: "",
    },
  ],
  paymentInfo: {
    bankName: "",
    accountName: "",
    accountNumber: "",
  },
  summary: {
    additionalNotes: "",
    paymentTerms: "",
    discount: 0,
    tax: 0,
    shipping: 0,
    includeInWords: false,
  },
};

const EditPayload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InvoiceFormData>(initialData);

  const handleUpdate = (data: Partial<InvoiceFormData>) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep((prev: any) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev: any) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    const props = {
      data: formData,
      onUpdate: handleUpdate,
      onNext: handleNext,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 1:
        return <FromToStep {...props} />;
      case 2:
        return <InvoiceDetailsStep {...props} />;
      case 3:
        return <LineItemsStep {...props} />;
      case 4:
        return <PaymentInfoStep {...props} />;
      case 5:
        return <SummaryStep {...props} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className=" ">
        <Actionbar backBtn title={`Edit Invoice`} />

        <div className=" rounded-lg shadow-sm p-3 ">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default EditPayload;
