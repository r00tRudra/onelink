'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { getPublicPortfolio } from '@/lib/services';
import { ExternalLink, Github } from 'lucide-react';

interface Portfolio {
  user: {
    github_username: string;
    portfolio_username: string;
    bio?: string;
    profile_image_url?: string;
    resume_text?: string;
  };
  projects: any[];
  experience: any[];
  education: any[];
  skills: any[];
  media: any[];
}

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params.username as string;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await getPublicPortfolio(username);
        setPortfolio(data);
      } catch (err) {
        setError('Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [username]);

  // Scroll animation setup
  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, portfolio]);

  if (loading) {
    return (
      <Layout>
        <div className="portfolio-loading">
          <div className="loading-spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <div className="portfolio-error">
          <div className="error-card">
            <h2>Portfolio Not Found</h2>
            <p>The portfolio you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="portfolio-container">
        <style jsx global>{`
          /* ========================================
             DESIGN TOKENS
             ======================================== */
          :root {
            /* Colors */
            --bg-primary: #fafafa;
            --bg-secondary: #ffffff;
            --bg-elevated: #ffffff;
            --text-primary: #0a0a0a;
            --text-secondary: #525252;
            --text-tertiary: #a3a3a3;
            --accent-primary: #2563eb;
            --accent-hover: #1d4ed8;
            --accent-light: #dbeafe;
            --accent-surface: #eff6ff;
            --border-subtle: #e5e5e5;
            
            /* Shadows */
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.06);
            
            /* Typography */
            --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --text-xs: 0.75rem;
            --text-sm: 0.875rem;
            --text-base: 1rem;
            --text-lg: 1.125rem;
            --text-xl: 1.25rem;
            --text-2xl: 1.5rem;
            --text-3xl: 1.875rem;
            --text-4xl: 2.25rem;
            
            /* Spacing */
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-6: 1.5rem;
            --space-8: 2rem;
            --space-12: 3rem;
            --space-16: 4rem;
            
            /* Motion */
            --duration-fast: 150ms;
            --duration-base: 250ms;
            --duration-slow: 350ms;
            --duration-slower: 500ms;
            --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
            --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
            --stagger-delay: 75ms;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-primary: #0a0a0a;
              --bg-secondary: #141414;
              --bg-elevated: #1a1a1a;
              --text-primary: #fafafa;
              --text-secondary: #a3a3a3;
              --text-tertiary: #525252;
              --accent-primary: #3b82f6;
              --accent-hover: #5679a3;
              --accent-light: #1e3a8a;
              --accent-surface: #172554;
              --border-subtle: #262626;
              --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.5);
              --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
              --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3);
            }
          }

          /* ========================================
             BASE STYLES
             ======================================== */
          .portfolio-container {
            max-width: 72rem;
            margin: 0 auto;
            padding: var(--space-12) var(--space-6);
            font-family: var(--font-sans);
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
          }

          /* ========================================
             ANIMATION SYSTEM
             ======================================== */
          .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity var(--duration-slower) var(--ease-out),
                        transform var(--duration-slower) var(--ease-out);
          }

          .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
          }

          /* Header animation (faster) */
          .animate-header {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity var(--duration-slow) var(--ease-out),
                        transform var(--duration-slow) var(--ease-out);
          }

          .animate-header.animate-in {
            opacity: 1;
            transform: translateY(0);
          }

          /* Staggered animations for lists */
          .stagger-item:nth-child(1) { transition-delay: 0ms; }
          .stagger-item:nth-child(2) { transition-delay: 75ms; }
          .stagger-item:nth-child(3) { transition-delay: 150ms; }
          .stagger-item:nth-child(4) { transition-delay: 225ms; }
          .stagger-item:nth-child(5) { transition-delay: 300ms; }
          .stagger-item:nth-child(6) { transition-delay: 375ms; }
          .stagger-item:nth-child(7) { transition-delay: 450ms; }
          .stagger-item:nth-child(8) { transition-delay: 525ms; }

          /* ========================================
             HEADER SECTION
             ======================================== */
          .portfolio-header {
            background: var(--bg-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: var(--space-10);
            margin-bottom: var(--space-12);
            box-shadow: var(--shadow-sm);
            transition: box-shadow var(--duration-base) var(--ease-out);
          }

          .portfolio-header:hover {
            box-shadow: var(--shadow-md);
          }

          .header-content {
            display: grid;
            grid-template-columns: 88px 1fr;
            align-items: center;
            gap: var(--space-6);
          }

          .avatar {
            width: 88px;
            height: 88px;
            border-radius: 999px;
            background: var(--accent-surface);
            border: 2px solid var(--border-subtle);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-primary);
            font-size: var(--text-2xl);
            font-weight: 700;
            overflow: hidden;
          }

          .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .header-text h1 {
            font-size: var(--text-4xl);
            font-weight: 700;
            margin: 0 0 var(--space-3) 0;
            color: var(--text-primary);
            letter-spacing: -0.02em;
          }

          .header-text p {
            font-size: var(--text-lg);
            color: var(--text-secondary);
            line-height: 1.6;
            margin: 0;
          }

          .header-meta {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-3);
            margin-top: var(--space-4);
          }

          .chip {
            background: var(--accent-surface);
            color: var(--accent-primary);
            border: 1px solid var(--accent-light);
            font-size: var(--text-xs);
            font-weight: 600;
            padding: 0.4rem 0.6rem;
            border-radius: 999px;
          }

          .github-link {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            margin-top: var(--space-6);
            color: var(--accent-primary);
            text-decoration: none;
            font-size: var(--text-base);
            font-weight: 500;
            transition: color var(--duration-fast) var(--ease-out),
                        transform var(--duration-fast) var(--ease-out);
          }

          .github-link:hover {
            color: var(--accent-hover);
            transform: translateX(2px);
          }

          /* ========================================
             SECTION STYLES
             ======================================== */
          .portfolio-section {
            margin-bottom: var(--space-16);
          }

          .section-title {
            font-size: var(--text-2xl);
            font-weight: 700;
            margin: 0 0 var(--space-6) 0;
            color: var(--text-primary);
            letter-spacing: -0.01em;
          }

          /* ========================================
             CARD COMPONENTS
             ======================================== */
          .portfolio-card {
            background: var(--bg-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: 10px;
            padding: var(--space-6);
            box-shadow: var(--shadow-sm);
            transition: transform var(--duration-base) var(--ease-out),
                        box-shadow var(--duration-base) var(--ease-out),
                        border-color var(--duration-fast) var(--ease-out);
          }

          .portfolio-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: var(--accent-light);
          }

          /* Projects Grid */
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: var(--space-6);
          }

          .project-card h3 {
            font-size: var(--text-lg);
            font-weight: 600;
            margin: 0 0 var(--space-3) 0;
            color: var(--text-primary);
          }

          .project-description {
            font-size: var(--text-sm);
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: var(--space-4);
          }

          .project-languages {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-2);
            margin-bottom: var(--space-4);
          }

          .language-tag {
            background: var(--accent-surface);
            color: var(--accent-primary);
            font-size: var(--text-xs);
            font-weight: 500;
            padding: var(--space-2) var(--space-3);
            border-radius: 6px;
            transition: background var(--duration-fast) var(--ease-out);
          }

          .project-card:hover .language-tag {
            background: var(--accent-light);
          }

          .project-link {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            color: var(--accent-primary);
            text-decoration: none;
            font-size: var(--text-sm);
            font-weight: 600;
            transition: color var(--duration-fast) var(--ease-out),
                        transform var(--duration-fast) var(--ease-out);
          }

          .project-link:hover {
            color: var(--accent-hover);
            transform: translateX(2px);
          }

          /* Experience & Education */
          .timeline-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-6);
          }

          .timeline-card h3 {
            font-size: var(--text-lg);
            font-weight: 600;
            margin: 0 0 var(--space-2) 0;
            color: var(--text-primary);
          }

          .timeline-card .company,
          .timeline-card .field {
            font-size: var(--text-base);
            color: var(--text-secondary);
            margin-bottom: var(--space-2);
          }

          .timeline-meta {
            font-size: var(--text-sm);
            color: var(--text-tertiary);
            margin-bottom: var(--space-3);
          }

          .timeline-description {
            font-size: var(--text-base);
            color: var(--text-secondary);
            line-height: 1.6;
            margin-top: var(--space-3);
          }

          /* Skills */
          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-3);
          }

          .skill-tag {
            background: var(--accent-surface);
            color: var(--accent-primary);
            padding: var(--space-3) var(--space-4);
            border-radius: 20px;
            font-size: var(--text-sm);
            font-weight: 500;
            transition: background var(--duration-fast) var(--ease-out),
                        transform var(--duration-fast) var(--ease-out);
          }

          .skill-tag:hover {
            background: var(--accent-light);
            transform: translateY(-1px);
          }

          /* ========================================
             LOADING & ERROR STATES
             ======================================== */
          .portfolio-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: var(--space-4);
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-subtle);
            border-top-color: var(--accent-primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .portfolio-loading p {
            color: var(--text-secondary);
            font-size: var(--text-base);
          }

          .portfolio-error {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: var(--space-4);
          }

          .error-card {
            background: var(--bg-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: var(--space-8);
            max-width: 400px;
            text-align: center;
          }

          .error-card h2 {
            font-size: var(--text-2xl);
            font-weight: 700;
            color: #dc2626;
            margin: 0 0 var(--space-3) 0;
          }

          .error-card p {
            color: var(--text-secondary);
            margin: 0;
          }

          /* ========================================
             RESPONSIVE
             ======================================== */
          @media (max-width: 768px) {
            .portfolio-container {
              padding: var(--space-8) var(--space-4);
            }

            .header-text h1 {
              font-size: var(--text-3xl);
            }

            .header-content {
              grid-template-columns: 1fr;
            }

            .avatar {
              width: 72px;
              height: 72px;
            }

            .projects-grid {
              grid-template-columns: 1fr;
            }

            .section-title {
              font-size: var(--text-xl);
            }
          }

          /* ========================================
             ACCESSIBILITY & PERFORMANCE
             ======================================== */
          @media (prefers-reduced-motion: reduce) {
            .animate-on-scroll,
            .animate-header,
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }

          /* Focus states */
          .github-link:focus-visible,
          .project-link:focus-visible {
            outline: 2px solid var(--accent-primary);
            outline-offset: 4px;
            border-radius: 4px;
          }
        `}</style>

        {/* Header - No animation (hero anchor) */}
        <div className="portfolio-header">
          <div className="header-content">
            <div className="avatar">
              {portfolio.user.profile_image_url ? (
                <img
                  src={portfolio.user.profile_image_url}
                  alt={`${portfolio.user.github_username} avatar`}
                />
              ) : (
                <span>
                  {portfolio.user.github_username
                    ?.slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="header-text">
              <h1>{portfolio.user.github_username}</h1>
              <p>{portfolio.user.bio}</p>
              <div className="header-meta">
                <span className="chip">@{portfolio.user.portfolio_username}</span>
                {portfolio.projects?.length > 0 && (
                  <span className="chip">{portfolio.projects.length} Projects</span>
                )}
                {portfolio.skills?.length > 0 && (
                  <span className="chip">{portfolio.skills.length} Skills</span>
                )}
              </div>
              <a
                href={`https://github.com/${portfolio.user.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <Github size={18} />
                View GitHub Profile
              </a>
            </div>
          </div>
        </div>

        {/* Projects */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="portfolio-section animate-on-scroll animate-header">
            <h2 className="section-title">Projects</h2>
            <div className="projects-grid">
              {portfolio.projects.map((project) => (
                <div
                  key={project.id}
                  className="portfolio-card project-card animate-on-scroll stagger-item"
                >
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  {project.languages && (
                    <div className="project-languages">
                      {Object.keys(project.languages).map((lang) => (
                        <span key={lang} className="language-tag">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <ExternalLink size={16} />
                    View Repository
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section className="portfolio-section animate-on-scroll animate-header">
            <h2 className="section-title">Experience</h2>
            <div className="timeline-list">
              {portfolio.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="portfolio-card timeline-card animate-on-scroll stagger-item"
                >
                  <h3>{exp.title}</h3>
                  <p className="company">{exp.company}</p>
                  {exp.location && <p className="timeline-meta">{exp.location}</p>}
                  <p className="timeline-meta">
                    {new Date(exp.start_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })} -{' '}
                    {exp.end_date 
                      ? new Date(exp.end_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : 'Present'}
                  </p>
                  {exp.description && (
                    <p className="timeline-description">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.education && portfolio.education.length > 0 && (
          <section className="portfolio-section animate-on-scroll animate-header">
            <h2 className="section-title">Education</h2>
            <div className="timeline-list">
              {portfolio.education.map((edu) => (
                <div
                  key={edu.id}
                  className="portfolio-card timeline-card animate-on-scroll stagger-item"
                >
                  <h3>{edu.school}</h3>
                  <p className="field">{edu.field_of_study}</p>
                  {edu.graduation_year && (
                    <p className="timeline-meta">Graduated: {edu.graduation_year}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <section className="portfolio-section animate-on-scroll animate-header">
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="skill-tag animate-on-scroll stagger-item"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}