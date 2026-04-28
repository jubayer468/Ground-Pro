/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Truck, Wallet } from 'lucide-react';

interface CheckoutModalProps {
  item: any;
  onClose: () => void;
}

export default function CheckoutModal({ item, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');

  const handleConfirm = () => {
    setStep('success');
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-natural-secondary/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl border border-natural-border flex flex-col"
      >
        <div className="p-8 border-b border-natural-border flex justify-between items-center bg-natural-bg/30 text-natural-text">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-natural-muted mb-1">Equipment Purchase</h2>
            <h3 className="text-2xl font-black">{step === 'details' ? 'Secure Checkout' : 'Order Confirmed'}</h3>
          </div>
          {step === 'details' && (
            <button onClick={onClose} className="p-2 hover:bg-natural-bg rounded-xl transition-colors text-natural-muted hover:text-natural-text">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="p-8">
          {step === 'details' ? (
            <div className="space-y-8">
              {/* Item Summary */}
              <div className="flex items-center gap-6 p-4 bg-natural-bg rounded-3xl border border-natural-border">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                <div>
                  <h4 className="font-extrabold text-natural-text leading-tight">{item.name}</h4>
                  <p className="text-xs font-bold text-natural-muted uppercase mt-1">{item.seller}</p>
                  <p className="text-lg font-black text-natural-primary mt-1">{item.price}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Payment Method</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                      paymentMethod === 'card' 
                        ? 'border-natural-primary bg-natural-primary/5 text-natural-primary shadow-lg shadow-natural-primary/5' 
                        : 'border-natural-border bg-white text-natural-muted hover:border-natural-muted/50'
                    }`}
                  >
                    <CreditCard size={24} />
                    <span className="text-xs font-black uppercase tracking-widest">Credit Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                      paymentMethod === 'transfer' 
                        ? 'border-natural-primary bg-natural-primary/5 text-natural-primary shadow-lg shadow-natural-primary/5' 
                        : 'border-natural-border bg-white text-natural-muted hover:border-natural-muted/50'
                    }`}
                  >
                    <Wallet size={24} />
                    <span className="text-xs font-black uppercase tracking-widest">Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Secure Info */}
              <div className="flex items-start gap-4 p-5 bg-[#D9E4D3]/30 rounded-3xl border border-natural-primary/10">
                <ShieldCheck className="text-natural-primary shrink-0" size={24} />
                <div>
                  <p className="text-xs font-extrabold text-natural-secondary uppercase tracking-tight">GroundPro Escrow Protection</p>
                  <p className="text-[10px] font-medium text-natural-muted mt-1 leading-relaxed">
                    Funds are held securely by GroundPro and only released to the seller once you confirm receipt of the equipment.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-5 bg-natural-primary text-white rounded-[24px] font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span>Confirm Purchase</span>
                <CheckCircle2 size={20} />
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 bg-natural-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-2xl shadow-natural-primary/20 border-8 border-natural-bg">
                <Truck size={40} className="animate-bounce" />
              </div>
              <h3 className="text-3xl font-extrabold text-natural-text mb-4">Transaction Initiated!</h3>
              <p className="text-natural-muted font-medium mb-8 leading-relaxed max-w-sm mx-auto">
                We've notified {item.seller}. They will contact you shortly via GroundPro DM to coordinate shipping of the {item.name}.
              </p>
              <div className="w-full bg-natural-bg h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="bg-natural-primary h-full"
                />
              </div>
              <p className="text-[10px] font-black text-natural-muted mt-5 uppercase tracking-[0.2em]">Updating Marketplace...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
