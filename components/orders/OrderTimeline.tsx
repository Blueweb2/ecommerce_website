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

      {/* Progress Bar */}
      <div className="w-full h-2 rounded" style={{ backgroundColor: '#e5e7eb' }}>
        <div
          className="h-2 rounded transition-all duration-500"
          style={{
            backgroundColor: '#22c55e',
            width: `${((currentIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;

          return (
            <div key={step} className="flex flex-col items-center">

              {/* Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: isCompleted ? '#22c55e' : '#d1d5db',
                  color: isCompleted ? '#ffffff' : 'transparent',
                  transform: isCompleted ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {isCompleted ? "✓" : ""}
              </div>

              {/* Label */}
              <p
                className="text-xs mt-2"
                style={{ color: isCompleted ? '#22c55e' : '#9ca3af' }}
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