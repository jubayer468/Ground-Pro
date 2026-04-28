/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award, Loader2, Sparkles } from 'lucide-react';
import { QuizQuestion, getFinalAssignment } from '../services/geminiTrainingService';

interface AssignmentModalProps {
  onClose: () => void;
  onPassed: () => void;
}

export default function AssignmentModal({ onClose, onPassed }: AssignmentModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'loading' | 'quiz' | 'result'>('loading');
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    setGameState('loading');
    const q = await getFinalAssignment();
    if (q.length > 0) {
      setQuestions(q);
      setCurrentIdx(0);
      setAnswers([]);
      setGameState('quiz');
    } else {
      onClose(); // Fallback
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate score
      const finalScore = newAnswers.reduce((acc, ans, idx) => {
        return ans === questions[idx].correctAnswer ? acc + 1 : acc;
      }, 0);
      const percentage = (finalScore / questions.length) * 100;
      setScore(percentage);
      setGameState('result');
    }
  };

  const isPassed = score >= 80;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-natural-secondary/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-natural-border flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-natural-border flex justify-between items-center bg-natural-bg/30">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-natural-muted mb-1">Certification Protocol</h2>
            <h3 className="text-2xl font-black text-natural-text uppercase leading-none">Final Assignment</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-natural-bg rounded-xl transition-colors text-natural-muted hover:text-natural-text">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 relative">
          <AnimatePresence mode="wait">
            {gameState === 'loading' ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-20 text-center space-y-4"
              >
                <div className="relative inline-block">
                  <Loader2 className="animate-spin mx-auto text-natural-primary" size={64} />
                  <Sparkles className="absolute -top-2 -right-2 text-natural-primary animate-bounce opacity-50" size={24} />
                </div>
                <p className="text-sm font-black text-natural-muted uppercase tracking-[0.3em] animate-pulse">Generating Rigorous Exam via AI...</p>
              </motion.div>
            ) : gameState === 'quiz' && questions.length > 0 ? (
              <motion.div 
                key={`quiz-${currentIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-natural-muted">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <div className="w-32 bg-natural-bg h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-natural-primary h-full transition-all duration-500" 
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h4 className="text-xl font-extrabold text-natural-text leading-tight">
                {questions[currentIdx].question}
              </h4>

              <div className="grid gap-4">
                {questions[currentIdx].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                      selectedOption === idx 
                        ? 'border-natural-primary bg-natural-primary/5 shadow-lg shadow-natural-primary/5' 
                        : 'border-natural-border bg-white hover:border-natural-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-black text-xs ${
                      selectedOption === idx ? 'border-natural-primary bg-natural-primary text-white' : 'border-natural-border text-natural-muted'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm font-bold text-natural-text leading-tight">{option}</span>
                  </button>
                ))}
              </div>

              <button
                disabled={selectedOption === null}
                onClick={handleNext}
                className="w-full mt-8 py-5 bg-natural-primary text-white rounded-[20px] font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
              >
                <span>{currentIdx === questions.length - 1 ? 'Finish Exam' : 'Next Question'}</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : gameState === 'result' ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 space-y-8"
              >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl relative ${
                isPassed ? 'bg-natural-primary text-white shadow-natural-primary/20' : 'bg-red-500 text-white shadow-red-500/20'
              }`}>
                {isPassed ? <Award size={48} /> : <AlertCircle size={48} />}
                <div className="absolute -bottom-2 -right-2 bg-white text-natural-text text-[10px] font-black px-3 py-1 rounded-full border border-natural-border shadow-sm">
                  {score}%
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-black text-natural-text uppercase leading-none">
                  {isPassed ? 'Certification Earned!' : 'Standards Not Met'}
                </h3>
                <p className="text-sm font-medium text-natural-muted leading-relaxed max-w-sm mx-auto">
                  {isPassed 
                    ? "Exceptional performance. You have demonstrated elite technical knowledge required for professional turf curators."
                    : `You scored ${score}%, which is below the 80% passing threshold. Professional curator standards require high precision.`}
                </p>
              </div>

              <div className="pt-8 flex flex-col gap-4">
                {isPassed ? (
                  <button
                    onClick={onPassed}
                    className="w-full py-5 bg-natural-primary text-white rounded-[24px] font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 size={20} />
                    <span>Claim Certificate</span>
                  </button>
                ) : (
                  <button
                    onClick={loadAssignment}
                    className="w-full py-5 bg-natural-secondary text-white rounded-[24px] font-black text-sm shadow-xl shadow-natural-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <RotateCcw size={20} />
                    <span>Try Re-Assignment</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-white text-natural-text border border-natural-border rounded-[24px] font-black text-sm hover:bg-natural-bg transition-all"
                >
                  Return to Modules
                </button>
              </div>
            </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
