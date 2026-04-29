import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProject } from '../api'
import { 
  ArrowLeft, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Users,
  Zap,
  Award,
  Target,
  Sparkles,
  Loader2,
  X,
  ShieldCheck
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import CollabForm from '../components/CollabForm'
import { useUser } from '../context/UserContext'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useUser()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProject(id)
      .then(data => {
        setProject(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Project not found')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0D9488] animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Project not found</h2>
        <button onClick={() => navigate('/research')} className="text-[#0D9488] font-bold underline">Return to Discovery</button>
      </div>
    )
  }

  const piName = project.pi?.name || project.pi || 'Dr. Priya Nair'
  const initials = piName.split(' ').map(n => n[0]).join('')

  const content = (
    <div className="max-w-[1100px] mx-auto px-6 py-8 font-['DM_Sans',sans-serif]">
      {/* Back to results */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-[#1B3A5C] hover:opacity-70 text-[13px] font-bold mb-6 transition-all"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Back to results
      </button>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          
          {/* Main Header Card */}
          <div style={{ padding: '24px' }} className="bg-white rounded-[12px] border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1">
                <h1 className="text-[20px] font-bold text-[#1B3A5C] leading-tight mb-1">
                  {project.title}
                </h1>
                <div className="text-slate-500 text-[13px] mb-3">
                  {piName} · {project.department || 'Ophthalmology, KMC Manipal'}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span style={{ padding: '4px 10px' }} className="rounded-full bg-[#ECFDF5] text-[#047857] text-[11px] font-bold">
                    Ongoing
                  </span>
                  <span style={{ padding: '4px 10px' }} className="rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-bold">
                    {project.domain || 'Medical Imaging'}
                  </span>
                  {(project.techStack || ['Python', 'PyTorch', 'Computer Vision']).slice(0, 3).map(tech => (
                    <span key={tech} style={{ padding: '4px 10px' }} className="rounded-full bg-[#FAF5FF] text-[#7E22CE] text-[11px] font-bold">
                      {tech}
                    </span>
                  ))}
                  <span style={{ padding: '4px 10px' }} className="rounded-full bg-[#ECFDF5] text-[#047857] text-[11px] font-bold">
                    Public
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-5 pt-5 border-t border-slate-100">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role being sought</div>
                <div className="text-[13px] font-bold text-slate-800">{project.lookingFor || 'ML Engineer'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time commitment</div>
                <div className="text-[13px] font-bold text-slate-800">10-12 hrs/week</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</div>
                <div className="text-[13px] font-bold text-slate-800">Research Project</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">IRB Status</div>
                <div className="text-[13px] font-bold text-[#0D9488] flex items-center gap-1">
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Approved (MAHE-IEC-2024-018)
                </div>
              </div>
            </div>
          </div>

          {/* Section Cards */}
          <ProjectSection title="THE CLINICAL PROBLEM">
            <p className="text-slate-600 text-[13px] leading-relaxed">
              {project.clinicalProblem || project.shortDescription}
            </p>
          </ProjectSection>

          <ProjectSection title="CURRENT TECH STACK">
            <p className="text-slate-500 text-[13px] font-mono leading-relaxed">
              {project.techStack?.join(' · ') || 'Python 3.11 · PyTorch 2.1 · FastAPI backend · React dashboard (in progress) · DICOM preprocessing pipeline with pydicom'}
            </p>
          </ProjectSection>

          <ProjectSection title="YOUR ROLE AS COLLABORATOR">
            <p className="text-slate-600 text-[13px] leading-relaxed">
              {project.collaboratorRole || 'Fine-tune the ResNet-50 model on our annotated OCT dataset (12,000 scans). Integrate the trained model with the existing FastAPI endpoint. Collaborate directly with our clinical annotator to review false positives and refine the training loop.'}
            </p>
          </ProjectSection>

          <ProjectSection title="SKILLS NEEDED">
            <div className="flex flex-wrap gap-2">
              {(project.skills || ['Python', 'PyTorch', 'Computer Vision', 'DICOM', 'ResNet / CNN architectures']).map(skill => (
                <span key={skill} style={{ padding: '4px 10px' }} className="rounded-full bg-[#FAF5FF] text-[#7E22CE] text-[11px] font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </ProjectSection>

          <ProjectSection title="WHAT YOU GET">
            <div className="flex flex-wrap gap-2">
              {(project.perks || ['Co-authorship on journal paper', 'Clinical dataset access (IRB approved)', 'Letter of Recommendation']).map((perk, i) => (
                <span key={i} style={{ padding: '4px 10px' }} className="rounded-full bg-[#ECFDF5] text-[#047857] text-[11px] font-bold">
                  {perk}
                </span>
              ))}
            </div>
          </ProjectSection>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[340px] flex flex-col gap-4">
          
          {/* Action Card */}
          {role === 'public' ? (
            <div style={{ padding: '32px 24px' }} className="bg-white rounded-[12px] border border-slate-200 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
              {/* Soft Green Glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-green-100 flex items-center justify-center mb-4">
                <div className="text-[#22C55E]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-[17px] font-bold text-[#1B3A5C] mb-2">Institutional Access Required</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-6 px-2">
                This project is private to department researchers. Login or register with your institutional ID to view full details.
              </p>
              
              <div className="w-full space-y-4 relative z-10">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 py-[16px] px-[20px] bg-[#22C55E] text-white rounded-[12px] font-bold text-[13px] uppercase tracking-[0.05em] hover:bg-[#16A34A] transition-all shadow-[0_4px_12px_rgba(34,197,94,0.2)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Login to collaborate
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="h-[1px] flex-1 bg-slate-100"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
                  <div className="h-[1px] flex-1 bg-slate-100"></div>
                </div>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center py-[16px] px-[20px] bg-white border border-[#22C55E] text-[#22C55E] rounded-[12px] font-bold text-[13px] uppercase tracking-[0.05em] hover:bg-green-50 transition-all"
                >
                  Create Researcher Account
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px' }} className="bg-white rounded-[12px] border border-slate-200 shadow-sm text-center">
              <h3 className="text-[16px] font-bold text-[#1B3A5C] mb-2">Collaborate on this Project</h3>
              <p className="text-[13px] text-slate-500 mb-6 px-2">
                Submit an application to the PI to express your interest in joining this research.
              </p>
              <button 
                className="w-full py-2.5 bg-[#1B3A5C] text-white rounded-[6px] font-bold text-[13px] hover:bg-[#152C46] transition-all"
                onClick={() => setShowForm(true)}
              >
                Apply Now
              </button>
            </div>
          )}

          {/* Principal Investigator Card */}
          <div style={{ padding: '24px' }} className="bg-white rounded-[12px] border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              PRINCIPAL INVESTIGATOR <div className="h-[1px] flex-1 bg-slate-200" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {initials}
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#1B3A5C]">{piName}</div>
                <div className="text-[11px] text-slate-400">Assistant Prof. · Ophthalmology</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-5">
              <div>
                <div className="text-[10px] text-slate-400 mb-0.5">h-index</div>
                <div className="text-[13px] font-bold text-[#1B3A5C]">9</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 mb-0.5">Publications</div>
                <div className="text-[13px] font-bold text-[#1B3A5C]">18</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 mb-0.5">Scopus ID</div>
                <div className="text-[12px] font-medium text-[#0D9488]">57201234567</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 mb-0.5">ORCID</div>
                <div className="text-[12px] font-medium text-[#0D9488]">0000-0001-...</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10 transition-all">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1B3A5C]">Collaboration Form</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-all"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <CollabForm projectId={project.id} projectTitle={project.title} onSuccess={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (role === 'public') {
    return (
      <DashboardLayout>
        <div className="bg-[#F8FAFC] min-h-screen">
          {content}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {content}
    </div>
  )
}

function ProjectSection({ title, children }) {
  return (
    <div style={{ padding: '24px' }} className="bg-white rounded-[12px] border border-slate-200 shadow-sm">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</div>
      <div className="text-slate-800">{children}</div>
    </div>
  )
}
