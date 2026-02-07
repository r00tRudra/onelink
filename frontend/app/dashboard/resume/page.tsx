'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button } from '@/components/FormComponents';
import {
  uploadResume,
  getResume,
  getCurrentUser,
  updateUserProfile
} from '@/lib/services';
import { Upload, FileText, Download } from 'lucide-react';

export default function ResumePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [savingSummary, setSavingSummary] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const init = async () => {
      await loadResume();
      await loadSummary();
      setLoading(false);
    };

    init();
  }, [isAuthenticated, router]);

  const loadResume = async () => {
    try {
      const response = await getResume();
      setResumeText(response?.resume_text || '');
    } catch {
      setResumeText('');
    }
  };

  const loadSummary = async () => {
    try {
      const user = await getCurrentUser();
      setSummaryText(user?.resume_text || '');
    } catch {
      setSummaryText('');
    }
  };

  const handleSaveSummary = async () => {
    setSavingSummary(true);
    try {
      await updateUserProfile({ resume_text: summaryText });
      alert('Profile summary updated!');
    } catch {
      alert('Failed to update profile summary');
    } finally {
      setSavingSummary(false);
    }
  };

  const handleResumeUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    setUploading(true);
    try {
      await uploadResume(file);
      await loadResume(); // refresh UI instantly
      alert('Resume uploaded successfully!');
    } catch {
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
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

          <textarea
            className="w-full min-h-[160px] border border-gray-300 rounded-lg p-4"
            placeholder="Write a short summary about your experience..."
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            maxLength={5000}
          />

          <div className="flex justify-between mt-3">
            <span className="text-sm text-gray-500">
              {summaryText.length}/5000
            </span>

            <Button
              onClick={handleSaveSummary}
              disabled={savingSummary}
            >
              {savingSummary ? 'Saving...' : 'Save Summary'}
            </Button>
          </div>
        </Card>

        {resumeText ? (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={24} className="text-blue-600" />
              <h2 className="text-2xl font-bold">
                Extracted Resume Text
              </h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">
                {resumeText}
              </pre>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-8 text-gray-600">
              No resume uploaded yet. Upload your resume to get started!
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
