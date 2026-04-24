import { Link } from 'react-router-dom'
import { Trophy, CheckCircle2, Users, Calendar, Newspaper, ArrowRight, Sparkles, ExternalLink } from 'lucide-react'

export default function CompletedPage() {
  const completedProjects = [
    {
      title: 'Diabetic Retinopathy Screening Tool',
      pi: 'Dr. Sunita Rao',
      year: '2024',
      outcome: 'Published in JAMA Ophthalmology. Deployed across 3 KMC screening centers.',
      skills: ['TensorFlow', 'OpenCV', 'Flask'],
      collaborators: 4,
      tag: 'Journal Publication'
    },
    {
      title: 'COVID-19 ICU Mortality Predictor',
      pi: 'Dr. Arjun Menon',
      year: '2023',
      outcome: 'Published in Critical Care Medicine. Model integrated into KMC ICU dashboards.',
      skills: ['Python', 'XGBoost', 'Streamlit'],
      collaborators: 3,
      tag: 'Clinical Deployment'
    },
    {
      title: 'NLP-based Radiology Report QA',
      pi: 'Dr. Priya Nambiar',
      year: '2024',
      outcome: 'Published in Radiology: AI. Reduced report errors by 22% in pilot.',
      skills: ['BERT', 'Python', 'FastAPI'],
      collaborators: 2,
      tag: 'Pilot Study'
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg)] font-['DM_Sans',sans-serif]">
      {/* Premium Header */}
      <section className="relative bg-[var(--navy)] pt-20 pb-28 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--gold)]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 animate-fade-in">
             <Trophy size={14} className="text-[var(--gold)]" />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest">Research Hall of Fame</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-['Merriweather',serif] text-white leading-tight mb-4">
            Clinical <span className="text-[var(--gold)]">Success Stories</span>
          </h1>
          <p className="text-white/60 text-[16px] md:text-[18px] max-w-2xl mx-auto font-medium leading-relaxed">
            Archive of completed collaborations that have successfully transitioned from algorithm to clinical publication or deployment.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-24 relative z-10">
        <div className="space-y-8">
          {completedProjects.map((project, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-[40px] p-8 md:p-10 border border-[var(--border)] shadow-2xl shadow-[var(--navy)]/5 hover:shadow-[var(--navy)]/10 transition-all flex flex-col md:flex-row gap-10 opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[var(--teal-l)] text-[var(--teal)] text-[10px] font-bold uppercase tracking-widest border border-[var(--teal)]/10">
                    {project.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--muted)]">
                    <Calendar size={14} className="text-[var(--gold)]" />
                    {project.year}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-['Merriweather',serif] text-[var(--navy)] mb-4">{project.title}</h3>
                
                <div className="flex items-center gap-3 mb-6 bg-[var(--bg)] p-3 rounded-2xl w-fit border border-[var(--border)]">
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--navy)] font-bold text-xs ring-2 ring-[var(--gold)]/20">PI</div>
                   <span className="text-[13px] font-bold text-[var(--navy)]">Lead: {project.pi}</span>
                </div>

                <div className="bg-[var(--bg)]/50 p-6 rounded-3xl border border-dashed border-[var(--border)] italic text-[14px] text-[var(--text)] leading-relaxed mb-6">
                   "{project.outcome}"
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-white border border-[var(--border)] rounded-xl text-[12px] font-bold text-[var(--muted)] group-hover:text-[var(--navy)] group-hover:border-[var(--navy)]/20 transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-[160px] flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-[var(--border)] pt-8 md:pt-0 md:pl-8 text-center">
                 <div className="w-16 h-16 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] mb-3 group-hover:scale-110 transition-transform">
                    <Users size={28} />
                 </div>
                 <div className="text-3xl font-extrabold text-[var(--navy)]">{project.collaborators}</div>
                 <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest">Collaborators</div>
                 <button className="mt-8 p-3 rounded-full bg-[var(--bg)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-all">
                    <ExternalLink size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hall of Fame CTA */}
        <div className="mt-20 bg-[var(--navy)] rounded-[50px] p-12 text-center relative overflow-hidden shadow-2xl shadow-[var(--navy)]/20">
          <div className="absolute top-0 right-0 w-full h-full bg-[var(--gold)]/5 blur-[80px] -translate-y-1/2" />
          <div className="relative z-10">
            <Sparkles size={32} className="text-[var(--gold)] mx-auto mb-6" />
            <h3 className="text-3xl font-bold font-['Merriweather',serif] text-white mb-4">Want to be featured here?</h3>
            <p className="text-white/60 text-[15px] font-medium max-w-xl mx-auto mb-10 leading-relaxed">
              Every breakthrough starts with a single match. Explore our current research opportunities and start your own success story today.
            </p>
            <Link to="/research" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[var(--navy)] rounded-2xl font-bold text-[15px] hover:bg-[var(--gold)] transition-all shadow-lg group">
              Browse Active Projects
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
