import { ShieldCheck, Truck, RotateCcw, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "SECURE",
    subtitle: "PAYMENTS",
  },
  {
    icon: Truck,
    title: "FAST",
    subtitle: "DELIVERY",
  },
  {
    icon: RotateCcw,
    title: "EASY",
    subtitle: "RETURNS",
  },
  {
    icon: BadgeCheck,
    title: "QUALITY",
    subtitle: "GUARANTEE",
  },
];

export default function TrustSection() {

  return (
    <section className="bg-[#ebebeb] py-10">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex items-center justify-center gap-3">

                {/* ICON CIRCLE */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white border-[0.3px] border-gray-400">
                  <Icon size={24} />
                </div>

                {/* TEXT */}
                <div className="text-xs tracking-wide">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-gray-600">{item.subtitle}</p>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};