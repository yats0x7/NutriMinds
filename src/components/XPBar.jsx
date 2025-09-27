import React, { useState, useEffect } from "react";
import "./XPBar.css";

const XPBar = ({ user, showAnimation, newBadges }) => {
  const [displayXP, setDisplayXP] = useState(user.totalXP);
  const [displayLevel, setDisplayLevel] = useState(user.currentLevel);

  useEffect(() => {
    // Animate XP changes
    const targetXP = user.totalXP;
    const startXP = displayXP;
    const difference = targetXP - startXP;

    if (difference > 0) {
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentXP = Math.round(startXP + difference * easeOut);

        setDisplayXP(currentXP);
        setDisplayLevel(Math.floor(currentXP / 100) + 1);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayXP(targetXP);
      setDisplayLevel(user.currentLevel);
    }
  }, [user.totalXP, user.currentLevel]);

  const currentLevelXP = displayXP % 100;
  const nextLevelXP = 100;
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100;

  const getBadgeIcon = (badge) => {
    const badgeIcons = {
      first_50: "🥉",
      xp_200: "🥈",
      xp_500: "🥇",
      streak_7: "🔥",
    };
    return badgeIcons[badge] || "🏆";
  };

  const getBadgeName = (badge) => {
    const badgeNames = {
      first_50: "First Steps",
      xp_200: "XP Master",
      xp_500: "XP Legend",
      streak_7: "Streak King",
    };
    return badgeNames[badge] || "Achievement";
  };

  return (
    <div className="xp-bar-container">
      {/* Level Display */}
      <div className="level-display">
        <div className="level-number">Level {displayLevel}</div>
        <div className="level-badges">
          {user.badges.map((badge, index) => (
            <div key={index} className="badge" title={getBadgeName(badge)}>
              {getBadgeIcon(badge)}
            </div>
          ))}
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="xp-progress">
        <div className="xp-info">
          <span className="current-xp">{displayXP} XP</span>
          <span className="next-level">
            Next: {nextLevelXP - currentLevelXP} XP
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="progress-glow"></div>
          </div>
        </div>
      </div>

      {/* Streak Display */}
      {user.streak > 0 && (
        <div className="streak-display">
          <div className="streak-icon">🔥</div>
          <div className="streak-text">
            <div className="streak-number">{user.streak}</div>
            <div className="streak-label">day streak</div>
          </div>
        </div>
      )}

      {/* XP Animation */}
      {showAnimation && (
        <div className="xp-animation">
          <div className="xp-popup">+XP!</div>
        </div>
      )}

      {/* New Badge Animation */}
      {newBadges.length > 0 && (
        <div className="badge-animation">
          {newBadges.map((badge, index) => (
            <div key={index} className="badge-popup">
              <div className="badge-icon">{getBadgeIcon(badge)}</div>
              <div className="badge-text">New Badge!</div>
              <div className="badge-name">{getBadgeName(badge)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default XPBar;
