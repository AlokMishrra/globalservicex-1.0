'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createCareer } from '@/lib/database'
import { compressImage } from '@/lib/storage'

const TEAM_OPTIONS = [
  'Tech',
  'Design',
  'Marketing',
  'Sales',
  'Support',
]

export default function JoinTeamPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null as File | null,
    why: '',
    team: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement
    setForm(f => ({ ...f, [name]: files ? files[0] : value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let resumeBase64 = ''
      if (form.resume) {
        if (form.resume.type.startsWith('image/')) {
          resumeBase64 = await compressImage(form.resume)
        } else {
          resumeBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(form.resume as File)
          })
        }
      }
      await createCareer({
        name: form.name,
        email: form.email,
        phone: form.phone,
        type: 'team',
        team: form.team,
        why: form.why,
        resume: resumeBase64,
      })
      setSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
        router.push('/');
      }, 2000);
    } catch (error) {
      alert('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-yellow-700 mb-2">Join Global Servicex Team</h1>
        <p className="text-lg text-gray-700 mb-4">Global Servicex is a leading digital solutions provider, empowering businesses with web development, app development, digital marketing, branding, and growth consulting. We believe in innovation, teamwork, and making a real impact for our clients worldwide.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
          <img src="/images/team.png" alt="Team" className="w-40 h-40 rounded-2xl shadow-2xl border-4 border-white object-cover" style={{ boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12), 0 1.5px 6px 0 rgba(255,221,51,0.12)' }} />
          <ul className="text-left text-gray-600 text-base bg-yellow-50 rounded-xl p-6 shadow-md border border-yellow-100">
            <li className="mb-2"><b>Collaborative, friendly work environment</b></li>
            <li className="mb-2"><b>Opportunities for growth and learning</b></li>
            <li className="mb-2"><b>Work on exciting digital projects</b></li>
            <li className="mb-2"><b>Flexible work culture</b></li>
            <li><b>Be part of a global impact</b></li>
          </ul>
        </div>
      </div>
      <div className="text-center mb-8">
        <button onClick={() => setShowForm(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg text-lg shadow-lg transition-all">Apply to Join</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border-t-4 border-yellow-400 flex flex-col animate-fade-in-down">
            <div className="overflow-y-auto max-h-[80vh] p-8 flex-1 flex flex-col gap-4">
              {success ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-3xl text-green-600 font-bold mb-4">Thank you!</div>
                  <div className="text-gray-700 text-lg">Your application has been submitted.<br/>You will be redirected to the main page.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold mb-2 text-yellow-700">Join Our Team</h2>
                  <input name="name" type="text" required placeholder="Full Name" className="border rounded px-3 py-2" value={form.name} onChange={handleChange} />
                  <input name="email" type="email" required placeholder="Email" className="border rounded px-3 py-2" value={form.email} onChange={handleChange} />
                  <input name="phone" type="tel" required placeholder="Phone" className="border rounded px-3 py-2" value={form.phone} onChange={handleChange} />
                  <select name="team" required className="border rounded px-3 py-2" value={form.team} onChange={handleChange}>
                    <option value="">Select Team</option>
                    {TEAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <textarea name="why" required placeholder="Why do you want to join Global Servicex?" className="border rounded px-3 py-2" value={form.why} onChange={handleChange} />
                  <input name="resume" type="file" required accept=".pdf,.doc,.docx" className="border rounded px-3 py-2" onChange={handleChange} />
                  <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
                  <button type="button" className="text-gray-500 hover:text-red-500 text-sm" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 