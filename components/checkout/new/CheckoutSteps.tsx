"use client";

interface Props {
  step: 1 | 2 | 3;
}

export default function CheckoutSteps({
  step,
}: Props) {
  const steps = [
    "Shipping",
    "Review & Pay",
    "Complete",
  ];

  return (
    <div className="mb-16 flex items-center justify-center">

      {steps.map((label, index) => {
        const current = index + 1;

        const active = current <= step;

        return (
          <div
            key={label}
            className="flex items-center"
          >
            <div className="flex flex-col items-center">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm ${
                  active
                    ? "border-[#4c7c61] text-[#4c7c61]"
                    : "border-[#d5d5d5] text-[#999]"
                }`}
              >
                {current}
              </div>

              <span
                className={`mt-3 text-[13px] ${
                  active
                    ? "text-black"
                    : "text-[#999]"
                }`}
              >
                {label}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`mx-5 h-px w-20 ${
                  current < step
                    ? "bg-[#4c7c61]"
                    : "bg-[#d5d5d5]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}