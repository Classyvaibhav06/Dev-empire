const db = require('../config/db');
const { getLocalDateString } = require('./dateUtils');

const handleDailyStreak = async (user) => {
  const now = new Date();
  const todayStr = getLocalDateString(now);

  let streak_count = user.streak_count || 0;
  let last_active = user.last_active_date;
  let xp_gained = 0;

  if (!last_active) {
    streak_count = 1;
    xp_gained = 5;
  } else {
    const lastActiveStr = getLocalDateString(last_active);

    if (lastActiveStr === todayStr) {
      return { streak_count, xp_gained: 0, new_level: user.level, new_xp: user.xp };
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    if (lastActiveStr === yesterdayStr) {
      streak_count += 1;
      xp_gained = 5;
    } else {
      streak_count = 1;
      xp_gained = 5;
    }
  }

  let newXp = (user.xp || 0) + xp_gained;
  let newLevel = Math.floor(newXp / 100) + 1;

  await db.query(
    'UPDATE users SET streak_count = $1, last_active_date = $2, xp = $3, level = $4 WHERE id = $5',
    [streak_count, todayStr, newXp, newLevel, user.id]
  );

  return { streak_count, xp_gained, new_xp: newXp, new_level: newLevel };
};

module.exports = {
  handleDailyStreak
};
