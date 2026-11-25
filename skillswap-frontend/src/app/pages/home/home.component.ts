import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-home',
    imports: [RouterLink],
    template: `
    <div class="home">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg-shapes">
          <div class="shape s1"></div>
          <div class="shape s2"></div>
          <div class="shape s3"></div>
        </div>
        <div class="hero-content">
          <div class="hero-badge">🎓 Student Skill Exchange</div>
          <h1>Trade Skills,<br><span class="highlight">Not Money</span></h1>
          <p class="hero-sub">SkillSwap Campus connects students with complementary talents. You teach what you know, learn what you want — zero cost, maximum growth.</p>
          <div class="hero-actions">
            <a routerLink="/auth" class="btn btn-primary btn-lg">Get Started Free →</a>
            <a href="#how" class="btn btn-ghost btn-lg">See How It Works</a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-num">500+</span>
              <span class="stat-label">Skills Available</span>
            </div>
            <div class="stat">
              <span class="stat-num">1.2k</span>
              <span class="stat-label">Students</span>
            </div>
            <div class="stat">
              <span class="stat-num">800+</span>
              <span class="stat-label">Swaps Done</span>
            </div>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="swap-card card-a">
            <div class="swap-avatar">👩‍💻</div>
            <div>
              <div class="swap-name">Priya</div>
              <div class="swap-skill teaches">Teaches Python</div>
              <div class="swap-skill wants">Wants Design</div>
            </div>
          </div>
          <div class="swap-arrow">⇄</div>
          <div class="swap-card card-b">
            <div class="swap-avatar">🎨</div>
            <div>
              <div class="swap-name">Arjun</div>
              <div class="swap-skill teaches">Teaches Design</div>
              <div class="swap-skill wants">Wants Python</div>
            </div>
          </div>
          <div class="match-badge">✨ Perfect Match!</div>
        </div>
      </section>
    
      <!-- How it works -->
      <section class="section" id="how">
        <div class="section-inner">
          <div class="section-header">
            <h2>How SkillSwap Works</h2>
            <p>Four simple steps to start learning for free</p>
          </div>
          <div class="steps">
            <div class="step">
              <div class="step-num">01</div>
              <div class="step-icon">👤</div>
              <h3>Create Profile</h3>
              <p>List the skills you can teach and the ones you want to learn</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-num">02</div>
              <div class="step-icon">🔍</div>
              <h3>Get Matched</h3>
              <p>Our engine finds students whose skills complement yours perfectly</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-num">03</div>
              <div class="step-icon">🤝</div>
              <h3>Send Request</h3>
              <p>Send a swap request and wait for acceptance from both sides</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-num">04</div>
              <div class="step-icon">📅</div>
              <h3>Book Session</h3>
              <p>Schedule a time slot and start your skill exchange journey</p>
            </div>
          </div>
        </div>
      </section>
    
      <!-- Skills Cloud -->
      <section class="section skills-section">
        <div class="section-inner">
          <div class="section-header">
            <h2>Popular Skills Being Swapped</h2>
          </div>
          <div class="skills-cloud">
            @for (tag of skillTags; track tag) {
              <span class="cloud-tag">{{ tag }}</span>
            }
          </div>
        </div>
      </section>
    
      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-inner">
          <h2>Ready to Start Swapping?</h2>
          <p>Join hundreds of students already learning and teaching on campus.</p>
          <a routerLink="/auth" class="btn btn-primary btn-lg">Join SkillSwap →</a>
        </div>
      </section>
    
      <!-- Footer -->
      <footer class="footer">
        <span>🎓 SkillSwap Campus &nbsp;|&nbsp; Built for Students, By Students</span>
      </footer>
    </div>
    `,
    styles: [`
    .home { min-height: 100vh; }
    /* Hero */
    .hero {
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4rem 5%;
      gap: 3rem;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #f0f7f4 0%, #f8f4ec 50%, #fdf8ee 100%);
    }
    .hero-bg-shapes { position: absolute; inset: 0; z-index: 0; }
    .shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.15;
      animation: float 6s ease-in-out infinite;
    }
    .s1 { width: 400px; height: 400px; background: var(--primary); top: -100px; left: -100px; }
    .s2 { width: 250px; height: 250px; background: var(--accent); bottom: -50px; left: 30%; animation-delay: 2s; }
    .s3 { width: 180px; height: 180px; background: var(--secondary); top: 20%; right: 10%; animation-delay: 4s; }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .hero-content { flex: 1; z-index: 1; max-width: 560px; }
    .hero-badge {
      display: inline-block;
      background: rgba(95,127,115,0.12);
      color: var(--primary-dark);
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.2rem;
      border: 1px solid rgba(95,127,115,0.2);
    }
    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      color: var(--text);
      margin-bottom: 1.2rem;
    }
    .highlight {
      background: linear-gradient(135deg, #5F7F73, #A8BDB2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-sub { font-size: 1.05rem; color: var(--text-light); line-height: 1.7; margin-bottom: 2rem; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .btn-lg { padding: 0.85rem 2rem; font-size: 1rem; }
    .hero-stats { display: flex; gap: 2rem; }
    .stat { display: flex; flex-direction: column; }
    .stat-num { font-size: 1.6rem; font-weight: 800; color: var(--primary-dark); }
    .stat-label { font-size: 0.78rem; color: var(--text-light); }
    /* Illustration */
    .hero-illustration {
      flex: 1;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      z-index: 1;
    }
    .swap-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      border-radius: var(--radius);
      padding: 1.2rem 1.5rem;
      width: 100%;
      box-shadow: var(--shadow);
      border: 1.5px solid var(--border);
      animation: slideIn 0.6s ease;
    }
    .card-b { animation-delay: 0.2s; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    .swap-avatar { font-size: 2rem; }
    .swap-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.3rem; }
    .swap-skill { font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 10px; display: inline-block; margin-right: 0.3rem; }
    .teaches { background: #d4eade; color: #3a7a58; }
    .wants { background: #fdefc3; color: #9a7a1a; margin-top: 0.3rem; display: block; }
    .swap-arrow { font-size: 2rem; color: var(--primary-dark); font-weight: 800; }
    .match-badge {
      background: linear-gradient(135deg, #5F7F73, #A8BDB2);
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(95,127,115,0.3);
      animation: bounce 1s ease infinite;
    }
    @keyframes bounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
    /* Sections */
    .section { padding: 5rem 5%; }
    .section-inner { max-width: 1100px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 3rem; }
    .section-header h2 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
    .section-header p { color: var(--text-light); }
    /* Steps */
    .steps { display: flex; align-items: flex-start; gap: 0; justify-content: center; flex-wrap: wrap; gap: 1rem; }
    .step {
      flex: 1;
      min-width: 180px;
      max-width: 220px;
      text-align: center;
      padding: 1.5rem 1rem;
      background: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      transition: var(--transition);
    }
    .step:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .step-num { font-size: 0.75rem; font-weight: 800; color: var(--primary-dark); letter-spacing: 1px; margin-bottom: 0.5rem; }
    .step-icon { font-size: 2rem; margin-bottom: 0.8rem; }
    .step h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .step p { font-size: 0.83rem; color: var(--text-light); line-height: 1.5; }
    .step-arrow { font-size: 1.5rem; color: var(--primary); align-self: center; padding: 0 0.5rem; }
    /* Skills Cloud */
    .skills-section { background: linear-gradient(135deg, #eef5f2, #f7f3e8); }
    .skills-cloud { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
    .cloud-tag {
      padding: 0.5rem 1.2rem;
      background: white;
      border-radius: 20px;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      border: 1px solid var(--border);
      transition: var(--transition);
      cursor: default;
    }
    .cloud-tag:hover { background: var(--primary-dark); color: white; transform: scale(1.05); }
    /* CTA */
    .cta-section {
      padding: 5rem 5%;
      background: linear-gradient(135deg, #5F7F73, #A8BDB2);
      text-align: center;
    }
    .cta-inner h2 { font-size: 2rem; font-weight: 800; color: white; margin-bottom: 0.8rem; }
    .cta-inner p { color: rgba(255,255,255,0.85); margin-bottom: 2rem; font-size: 1rem; }
    .cta-section .btn-primary { background: white; color: var(--primary-dark); }
    /* Footer */
    .footer {
      padding: 1.5rem;
      text-align: center;
      background: #f0ede6;
      color: var(--text-light);
      font-size: 0.85rem;
    }
    @media (max-width: 900px) {
      .hero { flex-direction: column; text-align: center; padding: 3rem 5%; }
      .hero-content h1 { font-size: 2.5rem; }
      .hero-actions { justify-content: center; }
      .hero-stats { justify-content: center; }
      .hero-illustration { max-width: 100%; }
    }
  `]
})
export class HomeComponent {
  skillTags = [
    '🐍 Python', '⚛️ React', '🎨 UI Design', '📱 Flutter', '🎥 Video Editing',
    '📊 Excel', '🎸 Guitar', '📝 Content Writing', '🤖 Machine Learning',
    '💡 Public Speaking', '🖼️ Photoshop', '🌐 Web Dev', '📸 Photography',
    '🎭 Acting', '🧪 Chemistry', '📐 Mathematics', '🎬 Video Production',
    '🔧 Arduino', '📊 Data Analysis', '✏️ Sketching'
  ];

  constructor(public auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) this.router.navigate(['/dashboard']);
  }
}
