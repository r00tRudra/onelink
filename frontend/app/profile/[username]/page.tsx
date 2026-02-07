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
  const [theme, setTheme] = useState('dark');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.section');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [portfolio]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>Portfolio Not Found</h2>
          <p>The portfolio you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const visibleProjects = showAllProjects ? portfolio.projects : portfolio.projects.slice(0, 6);
  const githubAvatarUrl = `https://github.com/${portfolio.user.github_username}.png?size=400`;
  const profileImageUrl = portfolio.user.profile_image_url || githubAvatarUrl;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

        :root {
          --bg-primary: #000000;
          --bg-secondary: #111111;
          --text-primary: #ffffff;
          --text-secondary: #888888;
          --accent: #ffffff;
          --border: #333333;
        }

        [data-theme="light"] {
          --bg-primary: #ffffff;
          --bg-secondary: #f8f8f8;
          --text-primary: #000000;
          --text-secondary: #666666;
          --accent: #000000;
          --border: #e0e0e0;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.7;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 400;
        }

        .loading-container,
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--bg-primary);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes skillFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-card {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          text-align: center;
        }

        .error-card h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .error-card p {
          color: var(--text-secondary);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Floating Header */
        .floating-navbar {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          min-width: 320px;
          max-width: 90vw;
          padding: 0.5rem 2.5rem;
          border-radius: 999px;
          background: rgba(30, 30, 30, 0.45);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1.5px solid rgba(255, 255, 255, 0.18);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.4s, box-shadow 0.4s;
        }

        [data-theme="light"] .floating-navbar {
          background: rgba(255, 255, 255, 0.7);
          border: 1.5px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
        }

        .logo {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: var(--text-primary);
        }

        .theme-toggle {
          background: none;
          border: 1px solid var(--border);
          border-radius: 50px;
          padding: 8px 16px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          background: var(--bg-secondary);
          transform: rotate(180deg) scale(1.1);
        }

        .mobile-menu {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.5rem;
          cursor: pointer;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
        }

        .hero-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          text-align: left;
        }

        .hero-text {
          flex: 1;
        }

        .hero-content h1 {
          font-size: clamp(2.5rem, 8vw, 4rem);
          font-weight: 300;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          opacity: 0;
          animation: gentleFadeIn 2s ease-out forwards;
        }

        .hero-content .subtitle {
          font-size: clamp(1rem, 3vw, 1.2rem);
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-weight: 400;
          opacity: 0;
          animation: gentleFadeIn 2s ease-out 0.5s forwards;
        }

        .hero-content p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin-bottom: 2rem;
          opacity: 0;
          animation: gentleFadeIn 2s ease-out 1s forwards;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          opacity: 0;
          animation: gentleFadeIn 2s ease-out 1.5s forwards;
        }

        @keyframes gentleFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn {
          padding: 12px 24px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn:hover {
          background: var(--bg-secondary);
        }

        .btn.primary {
          background: var(--accent);
          color: var(--bg-primary);
          border-color: var(--accent);
        }

        .btn.primary:hover {
          opacity: 0.8;
        }

        .hero-dp {
          width: 320px;
          height: 320px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid var(--accent);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
          background: var(--bg-secondary);
          transition: box-shadow 0.4s;
        }

        .hero-dp:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        }

        /* Sections */
        .section {
          padding: 80px 0;
          border-top: 1px solid var(--border);
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .section-title {
          font-size: 2rem;
          font-weight: 300;
          margin-bottom: 3rem;
          text-align: center;
          letter-spacing: 0.5px;
        }

        /* About Grid */
        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
        }

        .about-card {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          animation: breathe 6s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-2px) scale(1.01);
          }
        }

        .about-card:hover {
          transform: translateY(-8px) scale(1.02);
          animation: none;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        [data-theme="light"] .about-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }

        .about-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 1px;
          background: var(--accent);
          opacity: 0.3;
          transition: left 2s ease-in-out;
        }

        .about-card:hover::before {
          left: 100%;
        }

        .about-card h3 {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .about-card p {
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        /* Skills Section */
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .skill-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-secondary);
          color: var(--text-primary);
          padding: 0.5rem 1.1rem;
          border-radius: 24px;
          font-size: 0.9rem;
          border: 1px solid var(--border);
          font-weight: 500;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
        }

        .skill-tag:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .project-card {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: breathe 6s ease-in-out infinite;
        }

        .project-card:nth-child(2) { animation-delay: 1s; }
        .project-card:nth-child(3) { animation-delay: 2s; }
        .project-card:nth-child(4) { animation-delay: 3s; }

        .project-card:hover {
          transform: translateY(-8px) scale(1.02);
          animation: none;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        [data-theme="light"] .project-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }

        .project-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 1px;
          background: var(--accent);
          opacity: 0.3;
          transition: left 2s ease-in-out;
        }

        .project-card:hover::before {
          left: 100%;
        }

        .project-card h3 {
          font-size: 1.3rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .project-card p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .project-languages {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .language-tag {
          background: var(--bg-primary);
          color: var(--text-secondary);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          border: 1px solid var(--border);
        }

        .project-links {
          display: flex;
          gap: 1rem;
        }

        .project-links a {
          display: inline-block;
          background: var(--accent);
          color: var(--bg-primary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          border: 1px solid var(--accent);
          transition: background 0.3s, color 0.3s, box-shadow 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .project-links a:hover {
          background: var(--bg-primary);
          color: var(--accent);
        }

        /* Experience Section */
        .experience-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .experience-item {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          animation: breathe 6s ease-in-out infinite;
        }

        .experience-item:hover {
          transform: translateY(-8px) scale(1.02);
          animation: none;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        [data-theme="light"] .experience-item:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }

        .experience-item::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 1px;
          background: var(--accent);
          opacity: 0.3;
          transition: left 2s ease-in-out;
        }

        .experience-item:hover::before {
          left: 100%;
        }

        .experience-item h3 {
          font-size: 1.3rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .experience-item .company {
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .experience-item p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        /* Footer */
        footer {
          border-top: 1px solid var(--border);
          padding: 3rem 0;
          text-align: center;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .social-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .social-links a:hover {
          color: var(--text-primary);
        }

        footer p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--bg-primary);
            border-top: 1px solid var(--border);
            flex-direction: column;
            padding: 1rem 0;
            border-radius: 0 0 20px 20px;
          }

          .nav-links.active {
            display: flex;
            animation: menuFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes menuFadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .nav-links a {
            padding: 0.5rem 1rem;
          }

          .mobile-menu {
            display: block;
          }

          .floating-navbar {
            left: 50%;
            top: 12px;
            padding: 0.5rem 1rem;
            border-radius: 32px;
            width: 94vw;
            min-width: 0;
            max-width: 98vw;
          }

          .hero {
            min-height: 80vh;
            padding-top: 100px;
          }

          .hero-content {
            flex-direction: column;
            text-align: center;
          }

          .hero-dp {
            order: -1;
            width: 200px;
            height: 200px;
            margin-bottom: 1.5rem;
          }

          .hero-text {
            width: 100%;
          }

          .section {
            padding: 60px 0;
          }

          .about-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
        }
      `}</style>

      <div>
        {/* Floating Navigation */}
        <header>
          <nav className="floating-navbar container">
            <div className="logo">{portfolio.user.portfolio_username || portfolio.user.github_username.slice(0, 2).toUpperCase()}</div>
            <div className="nav-right">
              <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
                <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
                <li><a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a></li>
                <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a></li>
                <li><a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a></li>
                <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
              </ul>
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
              <button className="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section id="home" className="hero">
            <div className="container">
              <div className="hero-content">
                <div className="hero-text">
                  <h1>{portfolio.user.github_username}</h1>
                  <p className="subtitle">{portfolio.user.bio || 'Computer Science Student & Developer'}</p>
                  <p>
                    {portfolio.user.resume_text || 'Building innovative solutions with modern web technologies. Passionate about creating elegant, functional applications.'}
                  </p>
                  <div className="cta-buttons">
                    <a href="#projects" className="btn primary">View Work</a>
                    <a href="#contact" className="btn">Contact</a>
                    <a href={`https://github.com/${portfolio.user.github_username}`} target="_blank" rel="noopener noreferrer" className="btn">GitHub</a>
                  </div>
                </div>
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={portfolio.user.github_username} className="hero-dp" />
                ) : (
                  <div className="hero-dp" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '4rem',
                    fontWeight: 'bold'
                  }}>
                    {portfolio.user.github_username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="section">
            <div className="container">
              <h2 className="section-title">About</h2>
              <div className="about-grid">
                <div className="about-card">
                  <h3>Profile</h3>
                  <p><strong>{portfolio.user.github_username}</strong></p>
                  <p>{portfolio.user.bio || 'Developer & Creator'}</p>
                  <p>Building projects with passion</p>
                </div>
                {portfolio.education && portfolio.education.length > 0 && (
                  <div className="about-card">
                    <h3>Education</h3>
                    {portfolio.education.slice(0, 1).map(edu => (
                      <div key={edu.id}>
                        <p><strong>{edu.field_of_study || 'Computer Science'}</strong></p>
                        <p>{edu.school}</p>
                        {edu.graduation_year && <p>{edu.graduation_year}</p>}
                      </div>
                    ))}
                  </div>
                )}
                <div className="about-card">
                  <h3>Connect</h3>
                  <p>GitHub: {portfolio.user.github_username}</p>
                  <p>Projects: {portfolio.projects?.length || 0}</p>
                  <p>Skills: {portfolio.skills?.length || 0}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <section id="skills" className="section">
              <div className="container">
                <h2 className="section-title">Skills</h2>
                <div className="skills-container">
                  {portfolio.skills.map((skill, index) => (
                    <span 
                      key={skill.id} 
                      className="skill-tag"
                      style={{
                        animation: `skillFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Projects Section */}
          {portfolio.projects && portfolio.projects.length > 0 && (
            <section id="projects" className="section">
              <div className="container">
                <h2 className="section-title">Projects</h2>
                <div className="projects-grid">
                  {visibleProjects.map((project) => (
                    <div key={project.id} className="project-card">
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      {project.languages && Object.keys(project.languages).length > 0 && (
                        <div className="project-languages">
                          {Object.keys(project.languages).slice(0, 3).map((lang) => (
                            <span key={lang} className="language-tag">
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="project-links">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {portfolio.projects.length > 6 && (
                  <button 
                    className="btn" 
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    style={{ display: 'block', margin: '2rem auto 0' }}
                  >
                    {showAllProjects ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Experience Section */}
          {portfolio.experience && portfolio.experience.length > 0 && (
            <section id="experience" className="section">
              <div className="container">
                <h2 className="section-title">Experience</h2>
                <div className="experience-list">
                  {portfolio.experience.map((exp) => (
                    <div key={exp.id} className="experience-item">
                      <h3>{exp.title}</h3>
                      <p className="company">
                        {exp.company} • {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </p>
                      {exp.location && <p style={{ marginBottom: '0.5rem' }}>{exp.location}</p>}
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer id="contact">
          <div className="container">
            <h2 className="section-title">Connect</h2>
            <div className="social-links">
              <a href={`https://github.com/${portfolio.user.github_username}`} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={`mailto:${portfolio.user.github_username}@example.com`}>Email</a>
            </div>
            <p>© 2025 {portfolio.user.github_username}</p>
          </div>
        </footer>
      </div>
    </>
  );
}




