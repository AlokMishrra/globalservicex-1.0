'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter,
  ExternalLink,
  FileText,
  Calendar,
  Building,
  Star,
  Target,
  Zap
} from "lucide-react"
import { getPublishedForms, submitForm } from "@/lib/database"
import type { FormData } from "@/components/form-builder"
import Link from 'next/link'
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/date-utils"
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  scaleIn, 
  staggerContainer, 
  slideInFromBottom,
  hoverScale,
  hoverLift,
  pulse,
  gradientShift
} from "@/lib/animations"
import { debounce } from "@/lib/performance"

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience: string
  description: string
  requirements: string[]
  benefits: string[]
  formId?: string
  postedDate: string
  isActive: boolean
}

const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    department: 'Tech',
    location: 'Remote',
    type: 'full-time',
    experience: '3-5 years',
    description: 'We are looking for a passionate Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: [
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Knowledge of cloud platforms (AWS, Vercel)',
      'Strong problem-solving skills',
      'Experience with version control (Git)'
    ],
    benefits: [
      'Competitive salary',
      'Flexible working hours',
      'Health insurance',
      'Professional development budget',
      'Remote work options'
    ],
    postedDate: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Hybrid',
    type: 'full-time',
    experience: '2-4 years',
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work closely with developers and product managers to bring designs to life.',
    requirements: [
      'Proficiency in Figma, Adobe Creative Suite',
      'Experience with user research and testing',
      'Knowledge of design systems',
      'Strong portfolio showcasing UX/UI work',
      'Understanding of front-end development'
    ],
    benefits: [
      'Creative freedom',
      'Latest design tools and software',
      'Team collaboration',
      'Career growth opportunities',
      'Design conference attendance'
    ],
    postedDate: '2024-01-10',
    isActive: true
  },
  {
    id: '3',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'On-site',
    type: 'full-time',
    experience: '1-3 years',
    description: 'Help us grow our digital presence and reach new customers through innovative marketing strategies and campaigns.',
    requirements: [
      'Experience with social media marketing',
      'Knowledge of SEO and SEM',
      'Analytics and reporting skills',
      'Content creation abilities',
      'Campaign management experience'
    ],
    benefits: [
      'Performance bonuses',
      'Marketing tools and resources',
      'Team events',
      'Learning opportunities',
      'Career advancement'
    ],
    postedDate: '2024-01-05',
    isActive: true
  }
]

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS)
  const [forms, setForms] = useState<FormData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'jobs' | 'opportunities'>('jobs')
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submittingForm, setSubmittingForm] = useState(false)

  // Memoized filtered jobs for better performance
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => job.isActive)

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.requirements.some(req => req.toLowerCase().includes(searchLower))
      )
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(job => job.department.toLowerCase() === selectedDepartment.toLowerCase())
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedType)
    }

    return filtered
  }, [jobs, searchTerm, selectedDepartment, selectedType])

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = useCallback(async () => {
    try {
      const publishedForms = await getPublishedForms()
      setForms(publishedForms)
    } catch (error) {
      console.error('Error loading forms:', error)
    }
  }, [])

  // Debounced search to improve performance
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value)
  }

  const handleApply = (job: Job) => {
    setSelectedJob(job)
    setShowApplicationForm(true)
  }

  const handleFormSubmit = async (formData: any) => {
    if (!selectedJob) return

    console.log('Submitting job application:', { selectedJob, formData })
    setSubmitting(true)
    try {
      // If job has a specific form, use it; otherwise use a default application
      const formId = selectedJob.formId || 'default-application'
      
      // Extract user information for tracking
      const userInfo = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        applicationType: 'job_application'
      }
      
      console.log('User info extracted:', userInfo)
      await submitForm(formId, {
        ...formData,
        jobTitle: selectedJob.title,
        jobId: selectedJob.id,
        appliedAt: new Date().toISOString()
      }, userInfo)
      
      setShowApplicationForm(false)
      setSelectedJob(null)
      setApplicationData({})
      toast.success("Application Submitted Successfully!", "Your application has been received and we'll get back to you within 24 hours.")
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error("Submission Failed", "There was an error submitting your application. Please try again or contact us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpportunityFormSubmit = async () => {
    if (!selectedForm) return

    console.log('Submitting opportunity form:', { selectedForm, formData })
    setSubmittingForm(true)
    try {
      // Extract user information from form data - try multiple possible field names
      const userInfo = {
        email: formData.email || formData.field_email || formData.user_email || 
               formData['email'] || formData['Email'] || formData['EMAIL'] ||
               Object.values(formData).find((value, index) => 
                 Object.keys(formData)[index].toLowerCase().includes('email')
               ),
        name: formData.name || formData.field_name || formData.user_name || 
              formData['name'] || formData['Name'] || formData['NAME'] ||
              formData['full_name'] || formData['fullName'] || formData['Full Name'] ||
              Object.values(formData).find((value, index) => 
                Object.keys(formData)[index].toLowerCase().includes('name')
              ),
        phone: formData.phone || formData.field_phone || formData.user_phone || 
               formData['phone'] || formData['Phone'] || formData['PHONE'] ||
               formData['mobile'] || formData['Mobile'] || formData['contact'] ||
               Object.values(formData).find((value, index) => 
                 Object.keys(formData)[index].toLowerCase().includes('phone') ||
                 Object.keys(formData)[index].toLowerCase().includes('mobile') ||
                 Object.keys(formData)[index].toLowerCase().includes('contact')
               ),
        applicationType: 'opportunity_application'
      }
      
      console.log('User info extracted:', userInfo)
      await submitForm(selectedForm.id!, formData, userInfo)
      
      setShowFormModal(false)
      setSelectedForm(null)
      setFormData({})
      toast.success("Application Submitted Successfully!", "Your application has been received and we'll get back to you within 24 hours.")
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error("Submission Failed", "There was an error submitting your application. Please try again or contact us directly.")
    } finally {
      setSubmittingForm(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800'
      case 'part-time': return 'bg-blue-100 text-blue-800'
      case 'contract': return 'bg-purple-100 text-purple-800'
      case 'internship': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case 'tech': return 'bg-blue-100 text-blue-800'
      case 'design': return 'bg-pink-100 text-pink-800'
      case 'marketing': return 'bg-green-100 text-green-800'
      case 'sales': return 'bg-yellow-100 text-yellow-800'
      case 'support': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(-45deg, #f59e0b, #f97316, #f59e0b, #f97316)',
          backgroundSize: '400% 400%'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Join Our Team
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            Build the future with us. We're looking for passionate individuals who want to make a difference in the digital world.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            {...fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <Link href="/careers/team">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-yellow-600 hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Team
                </Button>
              </motion.div>
            </Link>
            <Link href="/careers/internship">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-yellow-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Apply for Internship
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 py-12"
        {...fadeInUp}
        transition={{ delay: 0.8 }}
      >
        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-8"
          {...fadeInUp}
          transition={{ delay: 1.0 }}
        >
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <motion.button
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'bg-white text-yellow-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Openings
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('opportunities')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'opportunities'
                  ? 'bg-white text-yellow-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Opportunities
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filters - Only show for jobs tab */}
        <AnimatePresence>
          {activeTab === 'jobs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          placeholder="Search jobs by title, description, or requirements..."
                          defaultValue={searchTerm}
                          onChange={handleSearchChange}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-full sm:w-48 transition-all duration-300 focus:ring-2 focus:ring-yellow-500">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full sm:w-48 transition-all duration-300 focus:ring-2 focus:ring-yellow-500">
                          <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jobs List */}
        <AnimatePresence mode="wait">
          {activeTab === 'jobs' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex items-center justify-between"
                {...fadeInUp}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  Open Positions ({filteredJobs.length})
                </h2>
                <Badge variant="outline" className="text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated daily
                </Badge>
              </motion.div>

              {filteredJobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                      <p className="text-gray-500">
                        Try adjusting your search criteria or check back later for new opportunities.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div 
                  className="grid gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      variants={fadeInUp}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                      >
                        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                            <Badge className={getTypeColor(job.type)}>
                              {job.type.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={getDepartmentColor(job.department)}>
                              {job.department}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.experience}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Posted {formatDate(job.postedDate)}
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {job.requirements.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.requirements.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:min-w-[200px]">
                          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Button 
                              onClick={() => handleApply(job)}
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-300 font-semibold"
                            >
                              Apply Now
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedJob(job)}
                              className="w-full transition-all duration-300 hover:bg-gray-50"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opportunities Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'opportunities' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex items-center justify-between"
                {...fadeInUp}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Opportunities ({forms.length})
                </h2>
                <Badge variant="outline" className="text-sm">
                  <Zap className="w-4 h-4 mr-1" />
                  Dynamic Forms
                </Badge>
              </motion.div>

            {forms.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No opportunities available</h3>
                  <p className="text-gray-500">
                    Check back later for new opportunities or contact us directly.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                  <Card key={form.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {form.title}
                          </CardTitle>
                          {form.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {form.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          <Star className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <FileText className="w-4 h-4 mr-2" />
                          {form.fields?.length || 0} fields
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          Created {formatDate(form.createdAt || '')}
                        </div>

                        <div className="pt-2">
                          <Button 
                            onClick={() => {
                              setSelectedForm(form)
                              setShowFormModal(true)
                            }}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Details Modal */}
        <Dialog open={!!selectedJob && !showApplicationForm} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {selectedJob?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getTypeColor(selectedJob.type)}>
                    {selectedJob.type.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={getDepartmentColor(selectedJob.department)}>
                    {selectedJob.department}
                  </Badge>
                  <Badge variant="outline">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedJob.location}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedJob.experience}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Job Description</h4>
                  <p className="text-gray-700">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Benefits</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleApply(selectedJob)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Apply Now
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedJob(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Application Form Modal */}
        <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Job Details</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Position:</strong> {selectedJob.title}<br/>
                    <strong>Department:</strong> {selectedJob.department}<br/>
                    <strong>Location:</strong> {selectedJob.location}<br/>
                    <strong>Type:</strong> {selectedJob.type.replace('-', ' ').toUpperCase()}
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleFormSubmit(applicationData)
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <Input
                        required
                        value={applicationData.name || ''}
                        onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        type="email"
                        required
                        value={applicationData.email || ''}
                        onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone *</label>
                      <Input
                        type="tel"
                        required
                        value={applicationData.phone || ''}
                        onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                      <Input
                        value={applicationData.linkedin || ''}
                        onChange={(e) => setApplicationData({...applicationData, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Cover Letter *</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      value={applicationData.coverLetter || ''}
                      onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                      placeholder="Tell us why you're interested in this position..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Resume/CV *</label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={(e) => setApplicationData({...applicationData, resume: e.target.files?.[0]})}
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX files only</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowApplicationForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Form Modal for Opportunities */}
        <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {selectedForm?.title}
              </DialogTitle>
              {selectedForm?.description && (
                <p className="text-gray-600 text-sm mt-2">{selectedForm.description}</p>
              )}
            </DialogHeader>
            {selectedForm && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Opportunity Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Form Type:</strong> {selectedForm.title}
                    </div>
                    <div>
                      <strong>Fields:</strong> {selectedForm.fields?.length || 0} questions
                    </div>
                    <div>
                      <strong>Created:</strong> {formatDate(selectedForm.createdAt || '')}
                    </div>
                    <div>
                      <strong>Status:</strong> <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Application Form</h4>
                  <form onSubmit={(e) => { e.preventDefault(); handleOpportunityFormSubmit(); }} className="space-y-4">
                    {selectedForm.fields?.map((field, index) => (
                      <div key={field.id || index} className="space-y-2">
                        <label className="block text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' ? (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="w-full"
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                          />
                        ) : field.type === 'textarea' ? (
                          <textarea
                            placeholder={field.placeholder}
                            required={field.required}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                          />
                        ) : field.type === 'select' ? (
                          <Select 
                            value={formData[field.id] || ''} 
                            onValueChange={(value) => setFormData({...formData, [field.id]: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option, optIndex) => (
                                <SelectItem key={optIndex} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'checkbox' ? (
                          <div className="space-y-2">
                            {field.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id={`${field.id}_${optIndex}`}
                                  checked={formData[field.id]?.includes(option) || false}
                                  onChange={(e) => {
                                    const currentValues = formData[field.id] || []
                                    if (e.target.checked) {
                                      setFormData({...formData, [field.id]: [...currentValues, option]})
                                    } else {
                                      setFormData({...formData, [field.id]: currentValues.filter((v: string) => v !== option)})
                                    }
                                  }}
                                />
                                <label htmlFor={`${field.id}_${optIndex}`} className="text-sm">{option}</label>
                              </div>
                            ))}
                          </div>
                        ) : field.type === 'radio' ? (
                          <div className="space-y-2">
                            {field.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <input 
                                  type="radio" 
                                  name={field.id} 
                                  id={`${field.id}_${optIndex}`} 
                                  value={option}
                                  checked={formData[field.id] === option}
                                  onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                                />
                                <label htmlFor={`${field.id}_${optIndex}`} className="text-sm">{option}</label>
                              </div>
                            ))}
                          </div>
                        ) : field.type === 'date' ? (
                          <Input 
                            type="date" 
                            required={field.required} 
                            className="w-full"
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                          />
                        ) : field.type === 'file' ? (
                          <div>
                            <Input 
                              type="file" 
                              required={field.required} 
                              className="w-full"
                              onChange={(e) => setFormData({...formData, [field.id]: e.target.files?.[0]})}
                            />
                            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>
                          </div>
                        ) : (
                          <Input 
                            placeholder={field.placeholder} 
                            required={field.required} 
                            className="w-full"
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                          />
                        )}
                      </div>
                    ))}
                    
                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit"
                        disabled={submittingForm}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        {submittingForm ? 'Submitting...' : 'Submit Application'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setShowFormModal(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>

              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}