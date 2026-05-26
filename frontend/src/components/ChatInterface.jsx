import React, { useState, useRef } from 'react';
import WizardView from './WizardView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ── PDF print helper ── */
function printRoadmapPDF(roadmap, projects) {
  const win = window.open('', '_blank');
  const role = roadmap?.target_role || '';
  const milestones = (roadmap?.roadmap || []).map((m, i) => `
    <div class="milestone">
      <div class="milestone-header"><span class="mnum">${i+1}</span><div><strong>${m.milestone}</strong><span class="timeline">${m.timeline}</span></div></div>
      <p class="outcome">${m.outcome}</p>
      <div class="skills">${(m.skills||[]).map(s=>`<span class="chip">${s}</span>`).join('')}</div>
      <p class="practice"><b>Practice:</b> ${(m.practice||[]).join(', ')}</p>
    </div>`).join('');
  const gap = roadmap?.skill_gap_analysis || {};
  const projectCards = (projects?.projects || []).map((p,i)=>`
    <div class="pcard">
      <div class="phead"><div><small>Phase ${i+1}</small><strong>${p.name}</strong></div><span class="badge">${p.difficulty}</span></div>
      <p>${p.objective}</p>
      <ul>${(p.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul>
      <div class="skills">${(p.skills||[]).map(s=>`<span class="chip">${s}</span>`).join('')}</div>
      ${p.upgrade_path ? `<p class="next"><b>Next:</b> ${p.upgrade_path}</p>` : ''}
    </div>`).join('');

  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Career Roadmap — ${role}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',sans-serif;color:#1e293b;background:#fff;padding:32px;font-size:13px}
    h1{font-size:22px;color:#d97706;margin-bottom:4px}
    h2{font-size:16px;color:#d97706;border-bottom:2px solid #fef3c7;padding-bottom:4px;margin:24px 0 12px}
    .meta{color:#64748b;margin-bottom:24px;font-size:12px}
    .gap-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:8px}
    .gap-box{border:1px solid #e2e8f0;border-radius:8px;padding:10px}
    .gap-box h3{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
    .gap-box.strengths{border-color:#fde68a;background:#fffbeb}
    .gap-box.strengths h3{color:#d97706}
    .gap-box.missing{border-color:#fecdd3;background:#fff1f2}
    .gap-box.missing h3{color:#e11d48}
    .gap-box.priority{border-color:#ffedd5;background:#fff7ed}
    .gap-box.priority h3{color:#ea580c}
    .gap-box ul{list-style:disc;padding-left:16px;color:#475569}
    .milestone{border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:10px;break-inside:avoid}
    .milestone-header{display:flex;align-items:flex-start;gap:10px;margin-bottom:6px}
    .mnum{width:26px;height:26px;border-radius:50%;background:#d97706;color:#fff;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;shrink:0}
    .timeline{display:block;font-size:11px;color:#ea580c;margin-top:2px}
    .outcome{color:#475569;margin-bottom:6px;font-size:12px}
    .skills{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}
    .chip{background:#fef3c7;color:#78350f;border-radius:4px;padding:2px 7px;font-size:11px}
    .practice{font-size:12px;color:#475569}
    .pgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .pcard{border:1px solid #e2e8f0;border-radius:8px;padding:12px;break-inside:avoid}
    .phead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}
    .phead small{display:block;font-size:10px;font-weight:700;text-transform:uppercase;color:#ea580c;margin-bottom:2px}
    .phead strong{font-size:13px;color:#1e293b}
    .badge{background:#fef3c7;color:#78350f;border-radius:20px;padding:2px 10px;font-size:10px;font-weight:700;white-space:nowrap;margin-left:8px}
    .pcard p{font-size:12px;color:#475569;margin-bottom:6px}
    .pcard ul{list-style:disc;padding-left:16px;font-size:12px;color:#334155;margin-bottom:6px}
    .next{font-size:11px;color:#64748b;border-top:1px solid #f1f5f9;padding-top:6px;margin-top:6px}
    .footer{text-align:center;color:#94a3b8;font-size:11px;margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0}
    @media print{@page{margin:20mm}body{padding:0}}
  </style></head><body>
  <h1>🗺️ Career Roadmap</h1>
  <p class="meta">Target Role: <strong>${role}</strong> &nbsp;|&nbsp; Experience: <strong>${roadmap?.experience_level || ''}</strong></p>
  <h2>Skill Gap Analysis</h2>
  <div class="gap-grid">
    <div class="gap-box strengths"><h3>Current Strengths</h3><ul>${(gap.current_strengths||[]).map(s=>`<li>${s}</li>`).join('')}</ul></div>
    <div class="gap-box missing"><h3>Missing Skills</h3><ul>${(gap.missing_skills||[]).map(s=>`<li>${s}</li>`).join('')}</ul></div>
    <div class="gap-box priority"><h3>Priority Skills</h3><ul>${(gap.priority_skills||[]).map(s=>`<li>${s}</li>`).join('')}</ul></div>
  </div>
  <h2>Career Roadmap Milestones</h2>${milestones}
  ${projects ? `<h2>Progressive Portfolio Projects</h2><div class="pgrid">${projectCards}</div>` : ''}
  <p class="footer">Generated by AI Career Roadmap Builder</p>
  </body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 400);
}

/* ── Tab button ── */
function Tab({ label, icon, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 ${
        active ? 'border-amber-500 text-amber-400 bg-amber-500/10' :
        disabled ? 'border-transparent text-slate-600 cursor-not-allowed' :
        'border-transparent text-slate-400 hover:text-amber-200 hover:bg-amber-500/5'}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

const GAP_STYLING = {
  'Current Strengths': {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400'
  },
  'Missing Skills': {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400'
  },
  'Priority Skills': {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400'
  }
};

/* ── Roadmap tab ── */
function RoadmapView({ roadmap }) {
  if (!roadmap) return null;
  const gap = roadmap.skill_gap_analysis || {};
  return (
    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar min-h-0">
      <h2 className="text-base font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-rose-400 bg-clip-text text-transparent mb-3">Skill Gap Analysis</h2>
      <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
        {[['Current Strengths', gap.current_strengths], ['Missing Skills', gap.missing_skills], ['Priority Skills', gap.priority_skills]].map(([t, items]) => {
          const style = GAP_STYLING[t] || GAP_STYLING['Current Strengths'];
          return (
            <div key={t} className={`${style.bg} border ${style.border} p-3 rounded-xl backdrop-blur-md`}>
              <h3 className={`${style.text} font-semibold text-xs uppercase tracking-wide mb-2`}>{t}</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-xs">{(items||[]).map((s,i)=><li key={i}>{s}</li>)}</ul>
            </div>
          );
        })}
      </div>
      <h2 className="text-base font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-rose-400 bg-clip-text text-transparent mb-3">Career Roadmap</h2>
      <div className="space-y-3">
        {(roadmap.roadmap||[]).map((m,i)=>(
          <div key={i} className="bg-black/40 border border-amber-950/30 rounded-xl p-4 backdrop-blur-md">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-amber-600/50 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">{i+1}</span><h3 className="font-semibold text-slate-100 text-sm">{m.milestone}</h3></div>
              <span className="text-xs text-amber-400 shrink-0 ml-2 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{m.timeline}</span>
            </div>
            <p className="text-xs text-slate-400 mb-2 ml-8">{m.outcome}</p>
            <div className="flex flex-wrap gap-1.5 mb-2 ml-8">{(m.skills||[]).map((s,j)=><span key={j} className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/20">{s}</span>)}</div>
            <p className="text-xs text-slate-400 ml-8"><span className="text-orange-400 font-medium">Practice: </span>{(m.practice||[]).join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PROJECT_THEMES = [
  { text: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { text: 'text-amber-400', bg: 'bg-amber-500/20' },
  { text: 'text-orange-400', bg: 'bg-orange-500/20' },
  { text: 'text-rose-400', bg: 'bg-rose-500/20' }
];

/* ── Projects tab ── */
function ProjectsView({ projects }) {
  if (!projects) return null;
  return (
    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar min-h-0">
      <h2 className="text-base font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-rose-400 bg-clip-text text-transparent mb-4">Progressive Portfolio Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        {(projects.projects||[]).map((p,i)=>{
          const theme = PROJECT_THEMES[i] || { text: 'text-slate-400', bg: 'bg-slate-500/20' };
          return (
            <div key={i} className="group bg-black/40 border border-amber-950/30 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg relative backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme.text} block mb-0.5`}>Phase {i+1}</span>
                    <h3 className="text-sm font-bold text-white leading-tight">{p.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${theme.bg} ${theme.text} shrink-0 ml-2`}>{p.difficulty}</span>
                </div>
                <p className="text-xs text-slate-300 mb-3">{p.objective}</p>
                <ul className="space-y-1 mb-3">{(p.features||[]).map((f,j)=><li key={j} className="flex items-start gap-1.5 text-xs text-slate-300"><svg className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>{f}</li>)}</ul>
                <div className="flex flex-wrap gap-1.5 mb-2">{(p.skills||[]).map((s,j)=><span key={j} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">{s}</span>)}</div>
                {p.upgrade_path && <p className="text-xs text-slate-500 border-t border-white/10 pt-2 mt-2"><span className="text-amber-400 font-medium">Next: </span>{p.upgrade_path}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
        <h3 className="text-sm font-bold text-amber-400 mb-1">🎉 Workflow Complete!</h3>
        <p className="text-xs text-slate-300">You now have a personalized roadmap, skill gap analysis, and progressive portfolio pipeline.</p>
      </div>
    </div>
  );
}

/* ── Loading spinner ── */
function Spinner({ text }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">{['bg-yellow-400','bg-amber-400','bg-rose-400'].map((c,i)=><div key={i} className={`w-3 h-3 rounded-full ${c} animate-bounce`} style={{animationDelay:`${i*0.2}s`}}/>)}</div>
      <p className="text-slate-300 text-sm animate-pulse">{text}</p>
    </div>
  );
}

/* ══════════════════════════════
   Main ChatInterface component
   ══════════════════════════════ */
export default function ChatInterface({ onBackToHome }) {
  const [tab, setTab] = useState('profile');
  const [roadmap, setRoadmap] = useState(null);
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(''); // 'roadmap' | 'projects' | ''

  const handleWizardComplete = async (studentCtx) => {
    setLoading('roadmap');
    setTab('roadmap');
    try {
      const r = await fetch(`${API_URL}/api/generate-roadmap`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_context: studentCtx }),
      });
      const data = await r.json();
      setRoadmap(data);
    } catch {
      setTab('profile');
      alert(`Failed to generate roadmap. Is the backend running on ${API_URL}?`);
    }
    setLoading('');
  };

  const handleGenerateProjects = async () => {
    setLoading('projects');
    setTab('projects');
    try {
      const r = await fetch(`${API_URL}/api/generate-projects`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmap_context: roadmap }),
      });
      const data = await r.json();
      setProjects(data);
    } catch {
      setTab('roadmap');
      alert('Failed to generate projects. Please try again.');
    }
    setLoading('');
  };

  const canExport = roadmap && !loading;

  return (
    <div className="flex flex-col h-full bg-black/40 border border-amber-950/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl" style={{minHeight:0}}>

      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-amber-950/20 to-orange-950/20 shrink-0 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="p-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90 shrink-0"
              title="Back to Landing Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              AI Career Roadmap Builder
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Personalized learning path, skill gap analysis &amp; portfolio projects</p>
          </div>
        </div>
        {/* Export PDF */}
        {canExport && (
          <button onClick={() => printRoadmapPDF(roadmap, projects)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 rounded-xl text-white text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Export PDF
          </button>
        )}
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 px-4 pt-2 border-b border-white/10 bg-black/40 shrink-0">
        <Tab icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
          label="Profile" active={tab==='profile'} disabled={false} onClick={()=>setTab('profile')} />
        <Tab icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>}
          label="Roadmap" active={tab==='roadmap'} disabled={!roadmap && loading!=='roadmap'} onClick={()=>roadmap && setTab('roadmap')} />
        <Tab icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>}
          label="Projects" active={tab==='projects'} disabled={!projects && loading!=='projects'} onClick={()=>projects && setTab('projects')} />
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Profile/Wizard tab */}
        {tab === 'profile' && <WizardView onComplete={handleWizardComplete} />}

        {/* Roadmap tab */}
        {tab === 'roadmap' && loading === 'roadmap' && <Spinner text="Analyzing your profile and generating roadmap..." />}
        {tab === 'roadmap' && loading !== 'roadmap' && roadmap && (
          <>
            <RoadmapView roadmap={roadmap} />
            {!projects && (
              <div className="p-4 border-t border-white/10 bg-black/40 shrink-0">
                <button onClick={handleGenerateProjects}
                  className="w-full py-2.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-rose-500 hover:from-yellow-400 hover:via-amber-400 hover:to-rose-400 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                  Continue to Portfolio Projects
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Projects tab */}
        {tab === 'projects' && loading === 'projects' && <Spinner text="Designing your portfolio project sequence..." />}
        {tab === 'projects' && loading !== 'projects' && projects && <ProjectsView projects={projects} />}
      </div>
    </div>
  );
}
