import React from "react";
import "./Charts.css";

const Charts = ({ logs, stats, user }) => {
  // Calculate macro percentages
  const totalCalories = stats.totalCalories || 0;
  const proteinCalories = (stats.totalProtein || 0) * 4;
  const carbsCalories = (stats.totalCarbs || 0) * 4;
  const fatCalories = (stats.totalFat || 0) * 9;

  const proteinPercentage =
    totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
  const carbsPercentage =
    totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
  const fatPercentage =
    totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

  // Get last 7 days data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayLogs = logs.filter(
        (log) => new Date(log.timestamp).toDateString() === date.toDateString()
      );
      const dayCalories = dayLogs.reduce(
        (sum, log) => sum + (log.calories || 0),
        0
      );
      const dayXP = dayLogs.reduce((sum, log) => sum + (log.xp || 0), 0);
      days.push({ name: dayName, calories: dayCalories, xp: dayXP });
    }
    return days;
  };

  const last7Days = getLast7Days();
  const maxCalories = Math.max(...last7Days.map((d) => d.calories), 100);
  const maxXP = Math.max(...last7Days.map((d) => d.xp), 10);

  const MacroChart = () => {
    if (totalCalories === 0) {
      return (
        <div className="empty-chart">
          <div className="empty-icon">📊</div>
          <div className="empty-text">No data yet</div>
        </div>
      );
    }

    return (
      <div className="macro-chart">
        <div className="chart-center">
          <div className="center-circle">
            <div className="center-text">
              <div className="center-value">{totalCalories}</div>
              <div className="center-label">calories</div>
            </div>
          </div>
        </div>
        <div className="chart-slices">
          <div
            className="slice protein-slice"
            style={{
              "--percentage": proteinPercentage,
              "--offset": 0,
            }}
          >
            <div className="slice-label">Protein</div>
            <div className="slice-value">{proteinPercentage.toFixed(0)}%</div>
          </div>
          <div
            className="slice carbs-slice"
            style={{
              "--percentage": carbsPercentage,
              "--offset": proteinPercentage,
            }}
          >
            <div className="slice-label">Carbs</div>
            <div className="slice-value">{carbsPercentage.toFixed(0)}%</div>
          </div>
          <div
            className="slice fat-slice"
            style={{
              "--percentage": fatPercentage,
              "--offset": proteinPercentage + carbsPercentage,
            }}
          >
            <div className="slice-label">Fat</div>
            <div className="slice-value">{fatPercentage.toFixed(0)}%</div>
          </div>
        </div>
      </div>
    );
  };

  const WeeklyChart = () => {
    return (
      <div className="weekly-chart">
        <div className="chart-bars">
          {last7Days.map((day, index) => (
            <div key={index} className="bar-group">
              <div className="bar-container">
                <div
                  className="calories-bar"
                  style={{
                    height: `${(day.calories / maxCalories) * 100}%`,
                    opacity: day.calories > 0 ? 1 : 0.3,
                  }}
                ></div>
                <div
                  className="xp-bar"
                  style={{
                    height: `${(day.xp / maxXP) * 100}%`,
                    opacity: day.xp > 0 ? 1 : 0.3,
                  }}
                ></div>
              </div>
              <div className="bar-label">{day.name}</div>
              <div className="bar-values">
                <div className="calories-value">{day.calories}</div>
                <div className="xp-value">{day.xp}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color calories-color"></div>
            <span>Calories</span>
          </div>
          <div className="legend-item">
            <div className="legend-color xp-color"></div>
            <span>XP</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="charts-container">
      {/* Macros Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Today's Macros</h3>
        </div>
        <div className="chart-content">
          <MacroChart />
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">7-Day Overview</h3>
        </div>
        <div className="chart-content">
          <WeeklyChart />
        </div>
      </div>

      {/* Daily Target Progress */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Daily Target</h3>
        </div>
        <div className="target-progress">
          <div className="target-info">
            <div className="target-current">{totalCalories}</div>
            <div className="target-separator">/</div>
            <div className="target-goal">{user.dailyCalories}</div>
            <div className="target-label">calories</div>
          </div>
          <div className="target-bar">
            <div
              className="target-fill"
              style={{
                width: `${Math.min(
                  (totalCalories / user.dailyCalories) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <div className="target-percentage">
            {Math.round((totalCalories / user.dailyCalories) * 100)}% of daily
            goal
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
