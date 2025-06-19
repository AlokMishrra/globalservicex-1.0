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

export default function InternshipPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'undergraduate',
    year: '',
    resume: null as File | null,
    team: '',
    why: '',
    q1: '',
    q2: '',
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
        type: 'internship',
        team: form.team,
        why: form.why,
        q1: form.q1,
        q2: form.q2,
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
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Apply for Internship at Global Servicex</h1>
        <p className="text-lg text-gray-700 mb-4">Global Servicex is a leader in digital innovation, offering web/app development, marketing, branding, and consulting. Our internship program gives you real-world experience, mentorship, and a chance to make an impact.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
          <img src="/images/marketing.png" alt="Internship" className="w-40 h-40 rounded-2xl shadow-2xl border-4 border-white object-cover" style={{ boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12), 0 1.5px 6px 0 rgba(51,153,255,0.12)' }} />
          <ul className="text-left text-gray-600 text-base bg-blue-50 rounded-xl p-6 shadow-md border border-blue-100">
            <li className="mb-2"><b>Mentorship from industry experts</b></li>
            <li className="mb-2"><b>Flexible work hours</b></li>
            <li className="mb-2"><b>Certificate on completion</b></li>
            <li className="mb-2"><b>Opportunity for pre-placement offer</b></li>
            <li><b>Work on real client projects</b></li>
          </ul>
        </div>
      </div>
      <div className="text-center mb-8">
        <button onClick={() => setShowForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg transition-all">Apply for Internship</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border-t-4 border-blue-400 flex flex-col animate-fade-in-down">
            <div className="overflow-y-auto max-h-[80vh] p-8 flex-1 flex flex-col gap-4">
              {success ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-3xl text-green-600 font-bold mb-4">Thank you!</div>
                  <div className="text-gray-700 text-lg">Your application has been submitted.<br/>You will be redirected to the main page.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold mb-2 text-blue-700">Internship Application</h2>
                  <input name="name" type="text" required placeholder="Full Name" className="border rounded px-3 py-2" value={form.name} onChange={handleChange} />
                  <input name="email" type="email" required placeholder="Email" className="border rounded px-3 py-2" value={form.email} onChange={handleChange} />
                  <input name="phone" type="tel" required placeholder="Phone" className="border rounded px-3 py-2" value={form.phone} onChange={handleChange} />
                  <div className="flex gap-2 items-center">
                    <label className="text-sm">Status:</label>
                    <select name="status" value={form.status} onChange={handleChange} className="border rounded px-2 py-1">
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                    </select>
                  </div>
                  {form.status === 'undergraduate' && (
                    <input name="year" type="number" min="1" max="5" required placeholder="Year (e.g. 2)" className="border rounded px-3 py-2" value={form.year} onChange={handleChange} />
                  )}
                  <select name="team" required className="border rounded px-3 py-2" value={form.team} onChange={handleChange}>
                    <option value="">Select Team</option>
                    {TEAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <textarea name="why" required placeholder="Why do you want to intern at Global Servicex?" className="border rounded px-3 py-2" value={form.why} onChange={handleChange} />
                  <input name="resume" type="file" required accept=".pdf,.doc,.docx" className="border rounded px-3 py-2" onChange={handleChange} />
                  <textarea name="q1" required placeholder="What skills/technologies are you most comfortable with?" className="border rounded px-3 py-2" value={form.q1} onChange={handleChange} />
                  <textarea name="q2" required placeholder="What do you hope to learn during this internship?" className="border rounded px-3 py-2" value={form.q2} onChange={handleChange} />
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
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