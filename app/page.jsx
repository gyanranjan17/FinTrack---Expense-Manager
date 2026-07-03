import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

// ── Claymorphism helpers ──────────────────────────────────────────────
// Soft "puffy" shadow: light source top-left, dark shadow bottom-right,
// light shadow top-left, plus a soft inner highlight.
const clay =
  "shadow-[8px_8px_16px_rgba(163,177,198,0.5),-8px_-8px_16px_rgba(255,255,255,0.8)] rounded-3xl";
const clayInset =
  "shadow-[inset_6px_6px_12px_rgba(163,177,198,0.45),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] rounded-3xl";
const clayButton =
  "rounded-2xl shadow-[6px_6px_12px_rgba(163,177,198,0.55),-6px_-6px_12px_rgba(255,255,255,0.85)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all duration-200";

export default function Home() {
  return (
    <div className="pt-40 block bg-[#eef1f8]">
      <HeroSection />

      <section className="py-20 bg-[#eef1f8]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className={`${clay} bg-[#eef1f8] p-8 text-center`}
              >
                <div className="text-4xl font-bold text-blue-900 mb-2">{stat.value}</div>
                <div className="text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#eef1f8]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-700">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className={`${clay} bg-[#eef1f8] p-6 border-none`}
              >
                <CardContent className="space-y-4 pt-4">
                  <div className={`${clayInset} w-14 h-14 flex items-center justify-center text-violet-500 bg-[#eef1f8]`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700">{feature.title}</h3>
                  <p className="text-slate-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#eef1f8]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-700">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div
                  className={`${clay} w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-[#eef1f8] text-violet-500`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-700">{step.title}</h3>
                <p className="text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#eef1f8]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-700">
            What our Users Say
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card
                key={index}
                className={`${clay} bg-[#eef1f8] p-6 border-none`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <div className={`${clay} p-1 rounded-full`}>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-slate-700">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-slate-500">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#eef1f8]">
        <div className="container mx-auto px-4 text-center">
          <div className={`${clay} bg-gradient-to-br from-sky-700 to-gray-800 p-12 mx-auto max-w-4xl`}>
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-sm">
              Ready to take control of your finances?
            </h2>
            <p className="text-violet-50 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust FinTrack to manage their money smarter.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className={`${clayButton} bg-[#eef1f8] text-violet-600 hover:bg-white hover:scale-105`}
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
