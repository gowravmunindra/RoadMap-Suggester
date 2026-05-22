import React, { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const STEPS = [
  { id: 'degree', q: 'What degree are you pursuing or completed?', type: 'single',
    opts: ['B.Tech / B.E','B.Sc','B.Com','BCA','MBA','M.Tech / M.E','MCA','M.Sc','BBA','Diploma','Other'] },
  { id: 'year', q: "What's your current academic year / status?", type: 'single',
    opts: ['1st Year','2nd Year','3rd Year','4th Year','PG 1st Year','PG 2nd Year','Recently Graduated','Working Professional'] },
  { id: 'target_role', q: 'What is your **target career role**?', type: 'single',
    opts: ['Full Stack Developer','Frontend Developer','Backend Developer','Data Scientist','ML / AI Engineer','Data Analyst','Cloud & DevOps Engineer','Mobile App Developer','UI/UX Designer','Cybersecurity Analyst','System Architect','Other'] },
  { id: 'skills', q: 'Select your **current skills** (all that apply):', type: 'multi',
    opts: ['Python','JavaScript','Java','C / C++','HTML & CSS','SQL','React','Node.js','Machine Learning','Data Analysis','Git / GitHub','DSA','No coding experience yet'] },
  { id: 'interests', q: 'Pick your **learning interests** (all that apply):', type: 'multi',
    opts: ['Web Development','AI & Machine Learning','Data Science','Mobile Apps','Cloud Computing','Cybersecurity','DevOps & Automation','Game Development','Blockchain','Open Source','System Design'] },
  { id: 'learning_time', q: 'How much time can you dedicate to learning **per day**?', type: 'single',
    opts: ['< 1 hour','1–2 hours','3–4 hours','5–6 hours','Weekends only','Full time (8+ hrs)'] },
  { id: 'roadmap_type', q: 'What **type of roadmap** do you prefer?', type: 'single',
    opts: ['Milestone-based (my pace)','Weekly plan','Monthly plan','6-month plan','Yearly plan'] },
  { id: 'experience_level', q: "What's your **overall experience level** in tech?", type: 'single',
    opts: ['Beginner (no experience)','Some experience (< 1 yr)','Intermediate (1–2 yrs)','Advanced (2+ yrs)'] },
];

const EXP_MAP = { 'Beginner (no experience)': 'beginner', 'Some experience (< 1 yr)': 'beginner', 'Intermediate (1–2 yrs)': 'intermediate', 'Advanced (2+ yrs)': 'advanced' };

function Bubble({ role, content }) {
  const lines = content.split('\n');
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up mb-3`}>
      {role === 'assistant' && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-xs font-bold text-white mr-2 mt-1 shrink-0">AI</div>}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-lg ${role === 'user' ? 'bg-amber-600 text-white rounded-br-sm' : 'bg-white/5 border border-amber-950/30 text-slate-200 rounded-bl-sm'}`}>
        {lines.map((l, i) => {
          const parts = l.split(/(\*\*[^*]+\*\*)/g);
          return <p key={i} className="mb-0.5 leading-relaxed last:mb-0">{parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j} className="text-white font-semibold">{p.slice(2,-2)}</strong> : p)}</p>;
        })}
      </div>
    </div>
  );
}

export default function WizardView({ onComplete }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm your **AI Career Advisor**.\n\nAnswer a few quick questions by clicking — I'll build your personalized career roadmap!" },
    { role: 'assistant', content: STEPS[0].q },
  ]);
  const [step, setStep] = useState(0);
  const [multi, setMulti] = useState([]);
  const [custom, setCustom] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [ctx, setCtx] = useState({});
  const [resumeText, setResumeText] = useState('');
  const [isResumeStep, setIsResumeStep] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const endRef = useRef(null);
  const fileRef = useRef(null);

  const scrollDown = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

  const addMsg = (role, content) => { setMessages(p => [...p, { role, content }]); scrollDown(); };

  const advance = (newCtx, display) => {
    addMsg('user', display);
    setShowCustom(false); setCustom(''); setMulti([]);
    const next = step + 1;
    setTimeout(() => {
      if (next < STEPS.length) { addMsg('assistant', STEPS[next].q); setStep(next); }
      else { addMsg('assistant', "Almost there! 🎉 Would you like to **upload your resume (PDF)** for a more personalized roadmap?\n\nOr click **Skip** to continue."); setIsResumeStep(true); }
    }, 350);
    setCtx(newCtx);
  };

  const handleSingle = (opt) => {
    if (opt === 'Other') { setShowCustom(true); return; }
    advance({ ...ctx, [STEPS[step].id]: opt }, opt);
  };

  const handleCustom = () => {
    if (!custom.trim()) return;
    advance({ ...ctx, [STEPS[step].id]: custom.trim() }, custom.trim());
  };

  const toggleMulti = (v) => setMulti(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const confirmMulti = () => {
    if (!multi.length) return;
    advance({ ...ctx, [STEPS[step].id]: multi }, multi.join(', '));
  };

  const handleFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    addMsg('user', `📄 ${file.name}`);
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const r = await fetch(`${API_URL}/api/upload-resume`, { method: 'POST', body: fd });
      const d = await r.json();
      if (d.status === 'success') { setResumeText(d.text.slice(0, 2000)); addMsg('assistant', "✅ Resume parsed! Click **Generate My Roadmap** when ready."); }
      else addMsg('assistant', "⚠️ Couldn't parse resume. Click **Generate** to continue without it.");
    } catch { addMsg('assistant', "⚠️ Error uploading. Click **Generate** to continue without it."); }
    setUploading(false);
    setIsResumeStep(false); setIsReady(true);
  };

  const skipResume = () => {
    addMsg('user', 'Skip — continue without resume');
    setTimeout(() => { addMsg('assistant', "All set! ✅ Click **Generate My Roadmap** below."); setIsResumeStep(false); setIsReady(true); }, 300);
  };

  const buildCtx = () => ({
    workflow_stage: 'student_context_completed',
    degree: ctx.degree, year: ctx.year, target_role: ctx.target_role,
    skills: Array.isArray(ctx.skills) ? ctx.skills : [ctx.skills],
    interests: Array.isArray(ctx.interests) ? ctx.interests : [ctx.interests],
    learning_time: ctx.learning_time, roadmap_type: ctx.roadmap_type,
    experience_level: EXP_MAP[ctx.experience_level] || 'beginner',
    resume_context: resumeText ? { raw_text: resumeText, projects: [], strengths: [] } : { projects: [], strengths: [] },
  });

  const curStep = step < STEPS.length ? STEPS[step] : null;
  const progress = Math.min((step / STEPS.length) * 100, 100);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Progress */}
      <div className="px-5 pt-3 pb-2 shrink-0">
        <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Profile Setup</span><span>{Math.round(progress)}%</span></div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-rose-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Chat bubbles */}
      <div className="flex-1 overflow-y-auto px-5 py-3 custom-scrollbar min-h-0">
        {messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
        <div ref={endRef} />
      </div>

      {/* Input area — capped height so chips never push the card */}
      <div className="border-t border-white/10 bg-black/40 p-4 shrink-0 max-h-52 overflow-y-auto custom-scrollbar">
        {/* Single select */}
        {curStep?.type === 'single' && !showCustom && !isResumeStep && !isReady && (
          <div className="flex flex-wrap gap-2">
            {curStep.opts.map(opt => (
              <button key={opt} onClick={() => handleSingle(opt)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/15 text-slate-300 hover:bg-amber-600/30 hover:border-amber-500/50 hover:text-amber-300 transition-all active:scale-95">
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Custom "Other" input */}
        {showCustom && (
          <div className="flex gap-2">
            <input autoFocus value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCustom()}
              placeholder={`Enter your ${curStep?.id}...`}
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            <button onClick={handleCustom} disabled={!custom.trim()} className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 disabled:opacity-40 rounded-xl text-white text-sm font-semibold transition-all">OK</button>
            <button onClick={() => { setShowCustom(false); setCustom(''); }} className="px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-slate-400 hover:text-white text-sm">✕</button>
          </div>
        )}

        {/* Multi select */}
        {curStep?.type === 'multi' && !isResumeStep && !isReady && (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {curStep.opts.map(opt => {
                const sel = multi.includes(opt);
                return (
                  <button key={opt} onClick={() => toggleMulti(opt)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all active:scale-95 ${sel ? 'bg-amber-600/40 border-amber-400/50 text-white' : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-white/30'}`}>
                    {sel && '✓ '}{opt}
                  </button>
                );
              })}
            </div>
            <button onClick={confirmMulti} disabled={!multi.length}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white text-sm font-semibold transition-all">
              Confirm ({multi.length} selected) →
            </button>
          </div>
        )}

        {/* Resume step */}
        {isResumeStep && !uploading && (
          <div className="flex gap-2 flex-wrap">
            <input type="file" ref={fileRef} onChange={handleFile} accept="application/pdf" className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-sm text-slate-200 hover:bg-amber-600/25 hover:border-amber-500/50 hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              Upload Resume (PDF)
            </button>
            <button onClick={skipResume} className="px-5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all">Skip →</button>
          </div>
        )}
        {uploading && <p className="text-sm text-slate-400 animate-pulse">Parsing resume...</p>}

        {/* Generate button */}
        {isReady && (
          <button onClick={() => onComplete(buildCtx())}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-rose-500 hover:from-yellow-400 hover:via-amber-400 hover:to-rose-400 rounded-xl text-white font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Generate My Roadmap
          </button>
        )}
      </div>
    </div>
  );
}
