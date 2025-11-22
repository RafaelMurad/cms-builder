"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRICING_PLANS } from "@/lib/billing/subscription";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            STUDIO CMS
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            Start free, upgrade when you&apos;re ready. No hidden fees.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-4 p-1.5 bg-gray-100 rounded-lg"
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingPeriod === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 font-normal">
                Save 17%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative rounded-2xl p-6 ${
                  plan.popular
                    ? "bg-black text-white ring-2 ring-black"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p
                    className={`text-sm ${
                      plan.popular ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingPeriod === "monthly" ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.popular ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    /month
                  </span>
                  {billingPeriod === "yearly" && plan.price.yearly > 0 && (
                    <p
                      className={`text-sm mt-1 ${
                        plan.popular ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      ${plan.price.yearly} billed yearly
                    </p>
                  )}
                </div>

                <Link
                  href={plan.id === "FREE" ? "/auth/signup" : `/checkout?plan=${plan.id}&period=${billingPeriod}`}
                  className={`block w-full py-3 text-center text-sm font-medium rounded-lg transition-colors mb-6 ${
                    plan.popular
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.id === "FREE" ? "Get Started" : "Start Free Trial"}
                </Link>

                <div className="space-y-3">
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${
                      plan.popular ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    What&apos;s included
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <svg
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            plan.popular ? "text-green-400" : "text-green-600"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span
                          className={
                            plan.popular ? "text-gray-200" : "text-gray-600"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I try Studio CMS for free?",
                a: "Yes! Our Free plan lets you create up to 3 galleries with 100 MB of storage. You can also start a 14-day free trial of any paid plan, no credit card required.",
              },
              {
                q: "Can I change plans later?",
                a: "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remaining time. When downgrading, changes take effect at the end of your billing period.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment partner, Stripe. Enterprise customers can also pay by invoice.",
              },
              {
                q: "Is there a contract or commitment?",
                a: "No contracts! All plans are month-to-month or yearly. You can cancel anytime, and you'll retain access until the end of your billing period.",
              },
              {
                q: "What happens to my data if I downgrade?",
                a: "Your data remains safe. If you exceed the new plan's limits, you won't be able to create new content until you're within limits, but existing content stays accessible.",
              },
              {
                q: "Do you offer discounts for non-profits?",
                a: "Yes! We offer 50% off for verified non-profit organizations. Contact us with your non-profit documentation to get started.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to build your portfolio?
          </h2>
          <p className="text-gray-600 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Get started for free
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transform group-hover:translate-x-1 transition-transform"
            >
              <path
                d="M3 8H13M13 8L8 3M13 8L8 13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Studio CMS. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
