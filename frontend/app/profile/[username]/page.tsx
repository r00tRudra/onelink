'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card } from '@/components/FormComponents';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [portfolio]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
          <Card>
            <h2 className="text-2xl font-bold text-red-500">Portfolio Not Found</h2>
            <p className="text-gray-400 mt-2">The portfolio you're looking for doesn't exist.</p>
          </Card>
        </div>
      </Layout>
    );
  }

  const githubAvatarUrl = `https://github.com/${portfolio.user.github_username}.png?size=400`;
  const profileImageUrl = portfolio.user.profile_image_url || githubAvatarUrl;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Orbitron:wght@400;700;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1147 50%, #0a0e27 100%);
          color: #e0e7ff;
          font-family: 'JetBrains Mono', monospace;
          overflow-x: hidden;
        }

        .tech-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: 
            linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 17, 71, 0.95) 50%, rgba(10, 14, 39, 0.95) 100%);
          overflow: hidden;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridScroll 20s linear infinite;
        }

        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }

        .cursor-glow {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          transition: transform 0.3s ease;
          transform: translate(-50%, -50%);
        }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        .stagger-6 { transition-delay: 0.6s; }

        .hero-title {
          font-family: 'Orbitron', monospace;
          font-size: 3.5rem;
          font-weight: 900;
          text-align: center;
          margin: 0;
          line-height: 1.2;
          letter-spacing: 0.02em;
        }

        .hero-subtitle {
          font-size: 2rem;
          text-align: center;
          margin: 1.5rem 0;
          font-weight: 300;
        }

        .highlight-blue {
          color: #818cf8;
          position: relative;
          display: inline-block;
        }

        .highlight-blue::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #818cf8, #6366f1);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: 2px solid #818cf8;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
          margin-top: 2rem;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
          background: linear-gradient(135deg, #818cf8, #6366f1);
        }

        .section-title {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin: 4rem 0 3rem;
          color: #818cf8;
          position: relative;
        }

        .section-title::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6366f1, transparent);
          z-index: -1;
        }

        .section-title span {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1147 100%);
          padding: 0 2rem;
        }

        .profile-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          margin: 4rem 0;
          flex-wrap: wrap;
        }

        .profile-image-wrapper {
          position: relative;
          width: 300px;
          height: 400px;
        }

        .profile-image-border {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 3px solid #6366f1;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.1));
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
        }

        .profile-image {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          z-index: 1;
        }

        .profile-stats {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          color: #818cf8;
          display: block;
        }

        .stat-label {
          font-size: 1rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .tech-card {
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tech-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .tech-card:hover::before {
          left: 100%;
        }

        .tech-card:hover {
          border-color: #818cf8;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
          transform: translateY(-5px);
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .timeline-item {
          position: relative;
          padding-left: 3rem;
          margin-bottom: 2rem;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: -2rem;
          width: 2px;
          background: linear-gradient(180deg, #6366f1, transparent);
        }

        .timeline-dot {
          position: absolute;
          left: -6px;
          top: 8px;
          width: 14px;
          height: 14px;
          background: #818cf8;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
        }

        .skill-tag {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid #6366f1;
          border-radius: 20px;
          font-size: 0.9rem;
          margin: 0.25rem;
          transition: all 0.3s ease;
        }

        .skill-tag:hover {
          background: rgba(129, 140, 248, 0.3);
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }

        .skill-bar-container {
          margin: 1rem 0;
        }

        .skill-bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .skill-bar {
          height: 8px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          border-radius: 10px;
          transition: width 1s ease;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
        }

        .github-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .github-link:hover {
          color: #c7d2fe;
          transform: translateX(5px);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(99, 102, 241, 0.2);
          border-top-color: #818cf8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin: 2rem 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .profile-container {
            flex-direction: column;
            gap: 2rem;
          }

          .profile-image-wrapper {
            width: 250px;
            height: 350px;
          }
        }
      `}</style>

      <div className="tech-bg">
        <div className="grid-overlay"></div>
      </div>

      <div 
        className="cursor-glow" 
        style={{ 
          left: `${mousePosition.x}px`, 
          top: `${mousePosition.y}px` 
        }}
      ></div>

      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8" style={{ position: 'relative', zIndex: 2 }}>
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col justify-center items-center">
            <div className="reveal-on-scroll stagger-1">
              <h1 className="hero-title">
                Hey, I am <span className="highlight-blue">{portfolio.user.github_username}</span>
              </h1>
            </div>
            <div className="reveal-on-scroll stagger-2">
              <p className="hero-subtitle">
                Building your dream <span className="highlight-blue">pixel</span> by <span className="highlight-blue">pixel</span>!
              </p>
            </div>
            {portfolio.user.bio && (
              <div className="reveal-on-scroll stagger-3">
                <p className="text-center text-gray-400 max-w-2xl text-lg mt-4">
                  {portfolio.user.bio}
                </p>
              </div>
            )}
            <div className="reveal-on-scroll stagger-4">
              <a href="#about" className="cta-button">
                Read More
              </a>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="my-20">
            <div className="reveal-on-scroll">
              <h2 className="section-title">
                <span>Why hire me for your next project?</span>
              </h2>
            </div>

            <div className="profile-container">
              <div className="reveal-on-scroll stagger-2 profile-image-wrapper">
                <div className="profile-image-border"></div>
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt={portfolio.user.github_username}
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-image" style={{ 
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {portfolio.user.github_username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="reveal-on-scroll stagger-3">
                <div className="tech-card">
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {portfolio.user.resume_text || "I am a professional with a degree in computer science, with more than two years of experience, including 1 year of experience working as a software developer and 2 years as a freelancer."}
                  </p>
                  
                  <div className="flex gap-4 mb-6">
                    <a 
                      href={`https://github.com/${portfolio.user.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-button"
                      style={{ margin: 0 }}
                    >
                      Portfolio
                    </a>
                    <button className="cta-button" style={{ margin: 0 }}>
                      Download CV
                    </button>
                  </div>

                  <div className="profile-stats flex gap-8">
                    <div className="stat-item">
                      <span className="stat-number">{portfolio.experience?.length || 5}</span>
                      <span className="stat-label">Years Experience</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">+{portfolio.projects?.length || 50}</span>
                      <span className="stat-label">Projects Github</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Journey Section */}
          <section className="my-20">
            <div className="reveal-on-scroll">
              <h2 className="section-title">
                <span>My Academic and Professional Journey</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Education */}
              {portfolio.education && portfolio.education.length > 0 && (
                <div className="reveal-on-scroll stagger-2">
                  <h3 className="text-2xl font-bold mb-6 text-indigo-300" style={{ fontFamily: 'Orbitron, monospace' }}>Education</h3>
                  <div className="space-y-6">
                    {portfolio.education.map((edu, index) => (
                      <div key={edu.id} className={`tech-card timeline-item reveal-on-scroll stagger-${index + 3}`}>
                        <div className="timeline-dot"></div>
                        {edu.graduation_year && (
                          <p className="text-indigo-400 text-sm mb-2">{edu.graduation_year}</p>
                        )}
                        <h4 className="text-lg font-bold text-white mb-1">{edu.field_of_study || 'Degree'}</h4>
                        <p className="text-gray-400">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {portfolio.experience && portfolio.experience.length > 0 && (
                <div className="reveal-on-scroll stagger-2">
                  <h3 className="text-2xl font-bold mb-6 text-indigo-300" style={{ fontFamily: 'Orbitron, monospace' }}>Professional Experience</h3>
                  <div className="space-y-6">
                    {portfolio.experience.map((exp, index) => (
                      <div key={exp.id} className={`tech-card timeline-item reveal-on-scroll stagger-${index + 3}`}>
                        <div className="timeline-dot"></div>
                        <p className="text-indigo-400 text-sm mb-2">
                          {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                        </p>
                        <h4 className="text-lg font-bold text-white mb-1">{exp.title}</h4>
                        <p className="text-gray-400 mb-2">{exp.company}</p>
                        {exp.location && <p className="text-sm text-gray-500 mb-2">{exp.location}</p>}
                        {exp.description && (
                          <p className="text-gray-300 text-sm">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Tools and Skills Section */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <section className="my-20">
              <div className="reveal-on-scroll">
                <h2 className="section-title">
                  <span>Tools <span className="text-white">and</span> Skills</span>
                </h2>
              </div>

              <div className="reveal-on-scroll stagger-2 tag-cloud">
                {portfolio.skills.map((skill, index) => (
                  <span 
                    key={skill.id} 
                    className={`skill-tag reveal-on-scroll stagger-${(index % 6) + 2}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>

              {/* Skill Bars - simulated top skills */}
              <div className="reveal-on-scroll stagger-4 mt-12 max-w-3xl mx-auto">
                <div className="tech-card">
                  <h3 className="text-xl font-bold mb-6 text-center text-indigo-300">Skills Proficiency</h3>
                  {portfolio.skills.slice(0, 8).map((skill, index) => (
                    <div key={skill.id} className="skill-bar-container">
                      <div className="skill-bar-label">
                        <span>{skill.name}</span>
                        <span>{90 - (index * 5)}%</span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className="skill-bar-fill" 
                          style={{ width: `${90 - (index * 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Projects */}
          {portfolio.projects && portfolio.projects.length > 0 && (
            <section className="my-20">
              <div className="reveal-on-scroll">
                <h2 className="section-title">
                  <span>Featured Projects</span>
                </h2>
              </div>

              <div className="project-grid">
                {portfolio.projects.map((project, index) => (
                  <div key={project.id} className={`tech-card reveal-on-scroll stagger-${(index % 4) + 2}`}>
                    <h3 className="text-xl font-bold mb-3 text-white">{project.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    {project.languages && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.keys(project.languages).slice(0, 3).map((lang) => (
                          <span key={lang} className="skill-tag">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-link"
                    >
                      <ExternalLink size={16} />
                      View Repository
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="reveal-on-scroll text-center py-12 mt-20">
            <a
              href={`https://github.com/${portfolio.user.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-link text-lg"
            >
              <Github size={24} />
              View GitHub Profile
            </a>
            <p className="text-gray-500 mt-6">© 2024 {portfolio.user.github_username}. Building the future, one pixel at a time.</p>
          </footer>
        </div>
      </Layout>
    </>
  );
}


