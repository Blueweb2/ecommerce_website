"use client";

const steps = ["pending", "processing", "shipped", "delivered"];

const labels: Record<string, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function OrderTimeline({ status }: { status: string }) {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="space-y-6">

      {/* 🔥 Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="bg-green-500 h-2 rounded transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* 🔹 Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;

          return (
            <div key={step} className="flex flex-col items-center">

              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${
                  isCompleted
                    ? "bg-green-500 text-white scale-110"
                    : "bg-gray-300"
                }`}
              >
                {isCompleted ? "✓" : ""}
              </div>

              {/* Label */}
              <p
                className={`text-xs mt-2 ${
                  isCompleted ? "text-black" : "text-gray-400"
                }`}
              >
                {labels[step]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}