/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MerchandiseItem } from "../types";
import { ShoppingBag, Star, Package, MessageSquare, RefreshCw, X, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";

interface MerchandiseProps {
  merch: MerchandiseItem[];
}

export default function Merchandise({ merch }: MerchandiseProps) {
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [currencyMode, setCurrencyMode] = useState<"UGX" | "USD">("UGX");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [orderQuantity, setOrderQuantity] = useState<number>(1);

  // Currency Converter rate 2026: ~$1 USD = ~3,750 UGX Shs
  const EXCHANGE_RATE = 3750;

  const getPriceDisplay = (priceInUGX: number) => {
    if (currencyMode === "UGX") {
      return `${priceInUGX.toLocaleString()} Shs`;
    } else {
      const usdValue = Math.round(priceInUGX / EXCHANGE_RATE);
      return `$${usdValue} USD`;
    }
  };

  const handleOpenItem = (item: MerchandiseItem) => {
    setSelectedItem(item);
    if (item.sizes && item.sizes.length > 0) {
      setSelectedSize(item.sizes[0]);
    }
    setOrderQuantity(1);
  };

  const getWhatsAppLink = (item: MerchandiseItem) => {
    const calculatedPrice = getPriceDisplay(item.price);
    const textMessage = `Hello Dance With Sizzy Afro! I want to order the official merchandise:
• Item Name: ${item.name}
• Selected Size: ${selectedSize}
• Quantity: ${orderQuantity}
• Total Cost: ${getPriceDisplay(item.price * orderQuantity)}
Please send payment instructions and delivery details! Thank you.`;
    
    return `https://wa.me/256766796585?text=${encodeURIComponent(textMessage)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 font-sans">
      <SEO
        title={selectedItem ? selectedItem.seo_title : "Sizzy Afro Official Merchandise Store"}
        description={selectedItem ? selectedItem.seo_description : "Shop the official Dance With Sizzy Afro streetwear apparel collection. Buy heavyweight comfort dance hoodies, snapback caps, and training t-shirts."}
        keywords="dance tee hoodies, streetwear uganda, sizzy afro cap, dance apparel mbarara"
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-850 pb-6">
        <div className="space-y-2 md:text-left text-center">
          <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">
            SUPPORT WEAR
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Official Streetwear & Merch
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            100% of all merchandise profits are reinvested back into sponsoring free community training camps and providing gear for vulnerable young dancers in Western Uganda.
          </p>
        </div>

        {/* Currency Switcher Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 p-1.5 rounded-2xl shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Currency:</span>
          <button
            onClick={() => setCurrencyMode("UGX")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              currencyMode === "UGX" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            UGX Shs
          </button>
          <button
            onClick={() => setCurrencyMode("USD")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              currencyMode === "USD" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {merch.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -5 }}
            className="bg-slate-900/30 border border-slate-800 hover:border-slate-750 p-5 rounded-2xl space-y-4 group cursor-pointer transition-all duration-300"
            onClick={() => handleOpenItem(item)}
          >
            {/* Image Preview Container */}
            <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-850 bg-slate-950 relative">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 font-bold px-3 py-1 rounded-full text-xs text-orange-500">
                {getPriceDisplay(item.price)}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-white text-base sm:text-lg group-hover:text-orange-500 transition-colors line-clamp-1">
                {item.name}
              </h3>
              <p className="text-slate-400 text-xs lines-clamp-2 leading-relaxed h-11 overflow-hidden">
                {item.description}
              </p>
            </div>

            {/* Inventory / size dots */}
            <div className="flex justify-between items-center text-xs font-mono border-t border-slate-850/40 pt-4">
              <div className="flex gap-1">
                {item.sizes.map((sz) => (
                  <span key={sz} className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-850 text-[10px] text-slate-300 font-bold">
                    {sz}
                  </span>
                ))}
              </div>
              <span className="text-emerald-500 text-[11px] font-bold">
                {item.stock} in stock
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenItem(item);
              }}
              className="w-full bg-slate-950 hover:bg-orange-500 text-slate-300 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-colors border border-slate-850 hover:border-orange-500"
            >
              Order & Inquire
            </button>
          </motion.div>
        ))}
      </div>

      {/* Product Details overlay modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full p-1.5 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full relative bg-slate-950">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-orange-600 text-white font-extrabold text-[10px] px-3 py-1 rounded">
                    PROFIT SIZED FOR SOCIAL CHARITY
                  </div>
                </div>

                <div className="p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="text-orange-500 font-mono font-black text-xl tracking-wide block">
                        {getPriceDisplay(selectedItem.price)}
                      </span>
                      <h3 className="font-display font-black text-2xl text-white mt-1 leading-tight">
                        {selectedItem.name}
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Product Story</h4>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>

                    {/* Sizings Grid selector */}
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Select Fitted Size</h4>
                      <div className="flex gap-2">
                        {selectedItem.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-black transition-all ${
                              selectedSize === sz
                                ? "bg-orange-500 text-white border-orange-500 shadow-md"
                                : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity selectors */}
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Order Quantity</h4>
                      <div className="flex items-center gap-3 bg-slate-950/50 max-w-[124px] rounded-lg p-1.5 border border-slate-850">
                        <button
                          type="button"
                          onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                          className="w-7 h-7 bg-slate-900 border border-slate-800 text-slate-300 rounded font-black text-xs flex justify-center items-center"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-white text-xs text-center flex-1">{orderQuantity}</span>
                        <button
                          type="button"
                          onClick={() => setOrderQuantity(orderQuantity + 1)}
                          className="w-7 h-7 bg-slate-900 border border-slate-800 text-slate-300 rounded font-black text-xs flex justify-center items-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Proceed checkout via WhatsApp anchor */}
                  <div className="space-y-3 border-t border-slate-850 pt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">Subtotal:</span>
                      <span className="text-orange-500 font-extrabold text-base">{getPriceDisplay(selectedItem.price * orderQuantity)}</span>
                    </div>

                    <a
                      href={getWhatsAppLink(selectedItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-orange-500/10 active:scale-95 transition-all text-xs text-center flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Submit Secure Order via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
