import React, { useState } from 'react';

const FEATURES = [
  {
    title: 'Profile Onboarding',
    description: 'Enter your degree, year, learning speed, and target career role to tailor every generated landmark to your personal schedule.',
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    title: 'PDF Resume Parser',
    description: 'Upload your PDF resume. The FastAPI backend extracts text using PyPDF2 to auto-detect current skills and existing projects.',
    icon: (
      <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: 'Skill Gap Diagnostics',
    description: 'Receive side-by-side comparative grids mapping your Current Strengths, Missing Skills, and Priority Skills to learn.',
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  {
    title: '4 Progressive Projects',
    description: 'Get four connected project definitions designed to stack codebase complexity, where each project builds directly on the previous one.',
    icon: (
      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  }
];

const PREVIEW_STEPS = [
  {
    id: 1,
    title: '1. Profile Wizard & PDF Resume Input',
    duration: 'Block 1',
    objective: 'Enter your background parameters and upload an optional resume.',
    details: 'The wizard collects academic year, target role, and study preferences. Uploaded PDF resumes are parsed instantly in the backend to auto-extract your skills.'
  },
  {
    id: 2,
    title: '2. Three-Card Skill Gap Diagnostic',
    duration: 'Block 2',
    objective: 'Identify missing technical requirements.',
    details: 'Generates three clean cards mapping Current Strengths, Missing Skills, and Priority Skills so you see exactly what to focus on.'
  },
  {
    id: 3,
    title: '3. Milestone-Based Learning Path',
    duration: 'Block 2',
    objective: 'Display learning landmarks with timeline guidance.',
    details: 'View milestone roadmaps detailing the exact skills to learn, practical goals, and targets tailored to your timeline.'
  },
  {
    id: 4,
    title: '4. Four Connected Progressive Projects',
    duration: 'Block 3',
    objective: 'Generate four sequential portfolio architectures.',
    details: 'Receive four project ideas that scale gradually. Each project directly upgrades the features and database design of the previous one.'
  },
  {
    id: 5,
    title: '5. High-Fidelity PDF Document Export',
    duration: 'Export',
    objective: 'Format the entire roadmap for single-click printing.',
    details: 'Outputs a beautifully styled layout containing your full diagnostic gaps, learning timeline, and portfolio project stack ready to print or save.'
  }
];

const USE_CASES = [
  {
    benefit: "Avoid Tutorial Hell",
    details: "Build 4 connected projects that build on each other, rather than starting scattered, disconnected prototypes.",
    icon: "🚀"
  },
  {
    benefit: "True Personalized Scope",
    details: "Timeline landmarks and practice targets are directly aligned to your study hours, target domain, and skills.",
    icon: "🎯"
  }
];

export default function LandingPage({ onLaunch }) {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-amber-500/10 filter blur-[130px] opacity-70" />
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] rounded-full bg-rose-500/5 filter blur-[150px] opacity-40" />
        <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] rounded-full bg-violet-600/5 filter blur-[140px] opacity-40" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-rose-500 p-[1.5px] shadow-lg shadow-amber-500/15">
            <div className="w-full h-full bg-[#0a0807] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-yellow-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            CAREERPATH AI
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#preview" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Workflow</a>
          <button 
            onClick={onLaunch}
            className="relative group overflow-hidden px-4.5 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:border-amber-500/30 text-amber-400 hover:text-white transition-all shadow-md active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            Launch App
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 flex flex-col justify-center">
        
        {/* Hero Section */}
        <section className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              FastAPI & React Integration Stack
            </div>

            {/* Main Headline - Carrier of details, informative, punchy */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Bridge Skill Gaps with <br />
              <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
                Dynamic Career Roadmaps
              </span> <br />
              & Sequential Portfolio Projects.
            </h1>

            {/* Subtext - Shorter, less generic, more details */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
              Upload your PDF resume to auto-detect skills. Receive a milestone learning schedule mapping Current Strengths, Missing Skills, and 4 interconnected portfolio projects that stack technical complexity.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={onLaunch}
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-rose-500 hover:from-yellow-400 hover:via-amber-400 hover:to-rose-400 rounded-2xl text-white font-bold text-base shadow-xl shadow-amber-500/10 hover:shadow-amber-400/25 transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Launch Roadmap Builder</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </button>
              
              <a 
                href="#preview" 
                className="px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-center font-medium text-sm"
              >
                Explore Workflow
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/5 w-full">
              <div>
                <p className="text-2xl font-black text-white">3-Block</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">AI Engine</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4 Stage</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Sequential Projects</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">PDF</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Resume Parser</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Block */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            {/* Visual Glassmorphic Widget Mockup - Displays a verified example of block output */}
            <div className="relative w-full max-w-[380px] bg-[#0c0908]/90 border border-amber-950/30 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-rose-500 scale-x-75 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">GENERATION PREVIEW</span>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TARGET CAREER</p>
                  <p className="text-sm font-bold text-white mt-0.5">Full Stack Web Engineer</p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DIAGNOSTIC SKILL GAP</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded border border-rose-500/25">Missing: PostgreSQL</span>
                    <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded border border-orange-500/25">Priority: Auth API</span>
                    <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-300 rounded border border-green-500/25">Strength: React Basics</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">PROGRESSIVE PORTFOLIO PIPELINE</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/25 text-amber-400 text-[10px] font-bold flex items-center justify-center">1</span>
                      <p className="text-xs font-semibold text-slate-200">Portfolio landing & Core Layout</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/25 text-amber-400 text-[10px] font-bold flex items-center justify-center">2</span>
                      <p className="text-xs font-semibold text-slate-200">Add backend server, login & auth</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/25 text-amber-400 text-[10px] font-bold flex items-center justify-center">3</span>
                      <p className="text-xs font-semibold text-slate-200">Integrate relational tables & dashboards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual background glows behind widget */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-amber-500/20 filter blur-[80px] pointer-events-none -z-10" />
          </div>
        </section>

        {/* Features Grid Section */}
        <section id="features" className="py-20 border-t border-white/5 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Diagnostic Skill Gaps, Onboarding & Connected Projects
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              A sequential 3-block pipeline designed to analyze parameters, map milestones, and build cohesive portfolio pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feat, idx) => (
              <div 
                key={idx} 
                className="group relative bg-[#0c0908]/40 border border-amber-950/20 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md shadow-lg"
              >
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-yellow-500/50 to-rose-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Preview Roadmap Interactive Section */}
        <section id="preview" className="py-20 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Preview Left Detail Box */}
            <div className="lg:col-span-5 text-left flex flex-col items-start">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-500 mb-2">5-STAGE APPLICATION PIPELINE</span>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">
                Interactive Multi-Block Workflow
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Click each stage in the pipeline list to preview how our backend organizes and generates your personalized assets.
              </p>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Active Stage</span>
                  <span className="text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">{PREVIEW_STEPS[activeStep - 1].duration}</span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">{PREVIEW_STEPS[activeStep - 1].title}</h4>
                <p className="text-xs font-bold text-amber-300 mb-2">Action: {PREVIEW_STEPS[activeStep - 1].objective}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{PREVIEW_STEPS[activeStep - 1].details}</p>
              </div>
            </div>

            {/* Preview Right Diagram Box */}
            <div className="lg:col-span-7 flex flex-col gap-3 relative">
              {PREVIEW_STEPS.map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-start text-left gap-4 p-4 rounded-2xl transition-all duration-300 border backdrop-blur-md ${
                      isActive 
                        ? 'bg-amber-600/10 border-amber-500/50 shadow-lg' 
                        : 'bg-black/30 border-amber-950/20 hover:border-white/15'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border transition-all ${
                      isActive 
                        ? 'bg-amber-500 text-[#0c0908] border-amber-400' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      {step.id}
                    </span>
                    <div>
                      <h3 className={`text-sm font-bold transition-all ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {step.objective}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* Benefits Cards Section */}
        <section className="py-16 border-t border-white/5">
          <h3 className="text-xl font-bold mb-6 text-center text-slate-300">Why Use This Builder?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {USE_CASES.map((uc, i) => (
              <div key={i} className="bg-[#0c0908]/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm relative">
                <span className="text-2xl absolute top-4 right-4">{uc.icon}</span>
                <h4 className="text-base font-bold text-white mb-2">{uc.benefit}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {uc.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Footer Panel */}
        <section className="my-16 bg-gradient-to-r from-amber-950/15 via-orange-950/15 to-rose-950/15 border border-amber-500/25 p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-amber-500/10 filter blur-[80px] pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 relative z-10">
            Stop guessing your learning path.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
            Get an instant, customized syllabus mapping out what topics to master, what timelines to follow, and what progressive portfolio sequence to complete.
          </p>

          <button 
            onClick={onLaunch}
            className="relative z-10 px-8 py-3.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-rose-500 hover:from-yellow-400 hover:via-amber-400 hover:to-rose-400 rounded-xl text-white font-bold text-sm shadow-lg shadow-amber-500/15 hover:shadow-amber-400/25 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            Launch Builder Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </section>

      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 w-full border-t border-white/5 py-8 text-center mt-auto">
        <p className="text-slate-600 text-xs font-semibold">
          © {new Date().getFullYear()} careerpath AI. Designed with modern aesthetics for tech students.
        </p>
      </footer>

    </div>
  );
}
