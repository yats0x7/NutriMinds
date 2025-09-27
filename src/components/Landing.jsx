import { useEffect, useState } from "react"
import "./Landing.css"

export default function Landing({ onGetHealthy, onSeeDemo, showDemoPreview = false }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger staggered animations on load
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleGetHealthy = () => {
    if (onGetHealthy) {
      onGetHealthy()
    } else {
      console.log("Get Healthy clicked - wire up onGetHealthy prop")
    }
  }

  const handleSeeDemo = () => {
    if (onSeeDemo) {
      onSeeDemo()
    } else {
      // Scroll to demo section
      const demoSection = document.getElementById("demo-preview")
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div className="landing-container">
      {/* Animated background */}
      <div className="landing-bg-gradient" />

      {/* Floating decorative elements */}
      <div className="floating-elements">
        <div className="floating-element floating-element-1">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="var(--color-accent)" opacity="0.1" />
            <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="var(--color-accent)" opacity="0.3" />
          </svg>
        </div>
        <div className="floating-element floating-element-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8l4-8z" fill="var(--color-warm)" opacity="0.2" />
          </svg>
        </div>
        <div className="floating-element floating-element-3">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 6c6.6 0 12 5.4 12 12s-5.4 12-12 12S6 24.6 6 18 11.4 6 18 6z"
              fill="var(--color-accent)"
              opacity="0.15"
            />
          </svg>
        </div>
      </div>

      <main className="landing-hero">
        <div className="hero-content">
          <div className={`hero-text ${isLoaded ? "animate-in" : ""}`}>
            <h1 className="hero-headline">FoodLens</h1>
            <p className="hero-subheadline">
              Turn every meal into a healthy habit — instant food detection, nutrition & gamified tracking.
            </p>
            <div className="hero-ctas">
              <button
                className="cta-primary"
                onClick={handleGetHealthy}
                aria-label="Get started with FoodLens healthy tracking"
              >
                <span>Get Healthy!</span>
                <div className="button-ripple"></div>
              </button>
              <button className="cta-secondary" onClick={handleSeeDemo} aria-label="See FoodLens demo and features">
                See Demo
              </button>
            </div>
          </div>

          <div className={`hero-visual ${isLoaded ? "animate-in" : ""}`}>
            <div className="device-mockup">
              {/* Background gradient blob */}
              <div className="visual-bg-blob"></div>

              {/* Stylized plate illustration */}
              <div className="plate-illustration">
                <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
                  {/* Plate base */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="#ffffff"
                    stroke="var(--color-muted)"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <circle cx="140" cy="140" r="100" fill="#f9fafb" opacity="0.5" />

                  {/* Food items */}
                  <circle cx="120" cy="120" r="15" fill="var(--color-warm)" opacity="0.8" />
                  <circle cx="160" cy="130" r="12" fill="var(--color-accent)" opacity="0.7" />
                  <circle cx="140" cy="160" r="18" fill="#10b981" opacity="0.6" />
                  <circle cx="110" cy="150" r="10" fill="#f59e0b" opacity="0.7" />
                  <circle cx="170" cy="110" r="8" fill="#ef4444" opacity="0.8" />
                </svg>
              </div>

              {/* Phone mockup overlay */}
              <div className="phone-mockup">
                <div className="phone-frame">
                  <div className="phone-screen">
                    <div className="dashboard-preview">
                      <div className="dashboard-header">
                        <div className="dashboard-title">Today's Progress</div>
                        <div className="dashboard-score">85%</div>
                      </div>
                      <div className="dashboard-stats">
                        <div className="stat-item">
                          <div className="stat-value">1,847</div>
                          <div className="stat-label">Calories</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">12</div>
                          <div className="stat-label">Foods</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Demo preview section (optional) */}
      {showDemoPreview && (
        <section id="demo-preview" className="demo-section">
          <div className="demo-card">
            <h3>See FoodLens in Action</h3>
            <p>Snap a photo, get instant nutrition insights, and track your healthy habits.</p>
            <div className="demo-features">
              <div className="feature-item">
                <span className="feature-icon">📸</span>
                <span>Instant Detection</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Nutrition Analysis</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Goal Tracking</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Accessibility live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="announcements"></div>
    </div>
  )
}