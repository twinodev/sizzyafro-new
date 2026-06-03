/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MessageSquare, Star, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-1">
            {/* Google Business Review */}
            <motion.a
              href="https://g.page/r/CVGVGRuS4-rNEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              className="flex items-center gap-2 bg-white text-gray-900 font-semibold px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 transition-transform border border-amber-430 text-sm"
              id="btn-google-review"
            >
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Review Us on Google</span>
            </motion.a>

            {/* WhatsApp Chat */}
            <motion.a
              href="https://wa.me/256766796585?text=Hello%20Dance%20With%20Sizzy%20Afro!%20I'm%20interested%20in%20joining%20classes/workshops."
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-2 bg-emerald-550 bg-green-500 text-white font-semibold px-4 py-2.5 rounded-full shadow-2xl hover:bg-green-600 hover:scale-105 transition-all text-sm"
              id="btn-whatsapp-chat"
            >
              <MessageSquare className="w-5 h-5 text-white fill-white" />
              <span>WhatsApp Sizzy Afro</span>
            </motion.a>
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 focus:outline-none ${
          isOpen ? "bg-red-500 rotate-45 scale-95" : "bg-orange-500 hover:bg-orange-600 hover:scale-110"
        }`}
        title="Contact Actions"
        id="btn-float-action"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}
