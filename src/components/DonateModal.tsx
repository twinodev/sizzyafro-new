/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Heart, Landmark, Smartphone, CreditCard, Sparkles, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { submitDonation } from "../api";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function DonateModal({ isOpen, onClose, onComplete }: DonateModalProps) {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("50000"); // Standard donation in UGX or USD
  const [currency, setCurrency] = useState("UGX");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const presetAmountsUGX = ["20000", "50000", "100000", "250000"];
  const presetAmountsUSD = ["10", "25", "50", "100"];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await submitDonation({
        donorName: donorName || "Anonymous Supporter",
        amount: Number(amount),
        currency,
        message,
        paymentMethod: paymentMethod === "Mobile Money" ? `Mobile Money (${phoneNumber || "General"})` : paymentMethod
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setDonorName("");
        setMessage("");
        setPhoneNumber("");
        onComplete();
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Donation submission error. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetClick = (val: string) => {
    setAmount(val);
  };

  const toggleCurrency = (cur: string) => {
    setCurrency(cur);
    if (cur === "UGX") {
      setAmount("50000");
    } else {
      setAmount("25");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 fill-white/20 animate-pulse text-white" />
              <div>
                <h3 className="font-display font-bold text-xl">Sponsor Our Talented Youth</h3>
                <p className="text-orange-50/80 text-xs">Transform lives in Mbarara through street dance</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h4 className="font-display font-bold text-2xl text-white mb-2">Thank You, Generous Soul!</h4>
                <p className="text-slate-400 text-sm max-w-sm">
                  Your transactional pledge of <strong className="text-orange-500">{currency} {Number(amount).toLocaleString()}</strong> was logged successfully! This drives resources directly to our street kids rehearsals and battles formats.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-orange-500 text-xs font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Blessings & Light from Sizzy Afro</span>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-4 font-sans text-sm">
                {/* Currency Selector */}
                <div>
                  <label className="text-slate-400 text-xs font-medium block mb-2">Select Currency Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCurrency("UGX")}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        currency === "UGX"
                          ? "bg-orange-500/10 border-orange-500 text-orange-500"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800/50"
                      }`}
                    >
                      UGX (Ugandan Shillings)
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCurrency("USD")}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        currency === "USD"
                          ? "bg-orange-500/10 border-orange-500 text-orange-500"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800/50"
                      }`}
                    >
                      USD (United States Dollar)
                    </button>
                  </div>
                </div>

                {/* Amount field */}
                <div>
                  <label className="text-slate-400 text-xs font-medium block mb-2">Pledge Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-lg">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      placeholder="Enter amount"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-16 pr-4 text-white text-lg font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Preset helpers */}
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {(currency === "UGX" ? presetAmountsUGX : presetAmountsUSD).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetClick(val)}
                        className={`text-xs py-1.5 rounded-lg border text-center font-semibold transition-all ${
                          amount === val
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-slate-800 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {currency === "USD" ? "$" : ""}
                        {Number(val).toLocaleString()}
                        {currency === "UGX" ? " Shs" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment channel */}
                <div>
                  <label className="text-slate-400 text-xs font-medium block mb-2">Payment Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Mobile Money")}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === "Mobile Money"
                          ? "bg-orange-500/10 border-orange-500 text-orange-500"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-orange-500" />
                      <span className="text-[10px] font-bold">Mobile Money</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Credit Card")}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === "Credit Card"
                          ? "bg-orange-500/10 border-orange-500 text-orange-500"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      <span className="text-[10px] font-bold">Debit/Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Bank Transfer")}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === "Bank Transfer"
                          ? "bg-orange-500/10 border-orange-500 text-orange-500"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <Landmark className="w-5 h-5 text-teal-400" />
                      <span className="text-[10px] font-bold">Bank Transfer</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "Mobile Money" && (
                  <div>
                    <label className="text-slate-400 text-xs font-medium block mb-2">MTN / Airtel Uganda Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      placeholder="e.g., 0770000000 or 0750000000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-orange-500 placeholder-slate-600 font-mono"
                    />
                  </div>
                )}

                {/* Donor details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Donor Name (Optional)</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g., Jane Namubiru"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-orange-500 placeholder-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Support Message (Optional)</label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Keep moving! Love you guys!"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-orange-500 placeholder-slate-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-3.5 rounded-2xl shadow-xl hover:shadow-orange-500/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 mt-4"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{isSubmitting ? "Processing Secure Log..." : `Proceed to Donate ${currency} ${Number(amount).toLocaleString()}`}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
