'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button } from '@/components/FormComponents';
import { uploadResume, getResume, getCurrentUser, updateUserProfile } from '@/lib/services';
import { Upload, FileText, Download } from 'lucide-react';

export default function ResumePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [savingSummary, setSavingSummary] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadResume();
      loadSummary();
    }
  }, [isAuthenticated, router]);

  const loadResume = async () => {
    try {
      const response = await getResume();
      setResumeText(response?.resume_text || '');
    } catch (error) {
      console.error('Failed to load resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const user = await getCurrentUser();
      setSummaryText(user?.resume_text || '');
    } catch (error) {
      console.error('Failed to load profile summary:', error);
    }
  };

  const handleSaveSummary = async () => {
    setSavingSummary(true);
    try {
      await updateUserProfile({ resume_text: summaryText });
      alert('Profile summary updated!');
    } catch (error) {
      alert('Failed to update profile summary');
      console.error(error);
    } finally {
      setSavingSummary(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    setUploading(true);
    try {
      await uploadResume(file);
      await loadResume();
      alert('Resume uploaded successfully!');
    } catch (error) {
      alert('Failed to upload resume');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resume</h1>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <label htmlFor="resume-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center">
                <Upload size={48} className="text-gray-400 mb-4" />
                <p className="font-medium text-lg mb-2">
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </p>
                <p className="text-gray-600">
                  Drag and drop or click to select
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  PDF or DOCX (Max 10MB)
                </p>
              </div>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleResumeUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Profile Summary</h2>
          <p className="text-gray-600 mb-4">
            This summary appears on your public portfolio in the About section.
          </p>
          <textarea
            className="w-full min-h-[160px] border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a short summary about your experience and strengths..."
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            maxLength={5000}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {summaryText.length}/5000 characters
            </span>
            <Button onClick={handleSaveSummary} disabled={savingSummary}>
              {savingSummary ? 'Saving...' : 'Save Summary'}
            </Button>
          </div>
        </Card>

        {resumeText && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FileText size={24} className="text-blue-600" />
                <h2 className="text-2xl font-bold">Extracted Resume Text</h2>
              </div>
              <Button variant="secondary" className="flex items-center gap-2">
                <Download size={18} />
                Download
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                {resumeText}
              </pre>
            </div>

            <p className="text-gray-600 text-sm mt-4">
              The text above has been extracted from your resume and will be displayed on your public portfolio.
            </p>
          </Card>
        )}

        {!resumeText && !uploading && (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">
                No resume uploaded yet. Upload your resume to get started!
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
