"use client";

interface Props {
  step: 1 | 2 | 3 | 4 | 5;
}

export default function CheckoutSteps({
  step,
}: Props) {
  const steps = [
    "Address",
    "Shipping",
    "Packaging",
    "Payment",
    "Success",
  ];

  const progressWidth =
    steps.length > 1
      ? `${((step - 1) / (steps.length - 1)) * 100}%`
      : "0%";

  return (
    <div className="mb-16 overflow-x-auto">
      <div className="relative mx-auto min-w-[640px] max-w-4xl px-2">
        <div className="absolute left-[10%] right-[10%] top-5 h-px bg-[#d5d5d5]" />

        <div
          className="absolute left-[10%] top-5 h-px bg-green-400 transition-all duration-300"
          style={{ width: `calc(80% * ${progressWidth})` }}
        />

        <div className="relative grid grid-cols-5 gap-3 sm:gap-6">
          {steps.map((label, index) => {
            const current = index + 1;
            const active = current <= step;
            const isCurrent = current === step;

            return (
              <div
                key={label}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                    active
                      ? "border-[#4c7c61] text-white bg-[#00ce00]"
                      : "border-[#d5d5d5] text-[#999] bg-[#f7f7f5]"
                  }`}
                >
                  {current}
                </div>

                <span
                  className={`mt-3 text-[11px] sm:text-[13px] ${
                    active ? "text-[#00ce00]" : "text-[#999]"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
