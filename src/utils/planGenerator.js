function getDateForDay(dayOffset) {
  const date = new Date();
  date.setDate(date.getDate() + (dayOffset - 1));
  return date.toISOString().split("T")[0];
}

export function generateStudyPlan({
  examDate,
  dailyStudyHours,
  topics,
}) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const today = new Date();
  const exam = new Date(examDate);

  const daysLeft = Math.max(
    1,
    Math.ceil((exam - today) / MS_PER_DAY)
  );

  const dailyMinutes = dailyStudyHours * 60;

  /* ----------------------------------------
     CONFIGURATION
  ---------------------------------------- */

  const CONF_MAP = {
    hard:   { study: 90, revisions: 2 },
    medium: { study: 60, revisions: 1 },
    easy:   { study: 30, revisions: 0 },
  };

  /* ----------------------------------------
     STEP 1: Normalize Topics
  ---------------------------------------- */

  const normalized = topics.map(t => {
    const conf = CONF_MAP[t.confidence] || CONF_MAP.medium;
    return {
      name: t.name,
      confidence: t.confidence,
      studyTime: conf.study,
      revisionCount: conf.revisions,
      studied: false,
      revisionsDone: 0,
      lastStudyDay: null,
    };
  });

  // Sort hard → medium → easy
  const priorityOrder = { hard: 1, medium: 2, easy: 3 };
  normalized.sort(
    (a, b) => priorityOrder[a.confidence] - priorityOrder[b.confidence]
  );

  /* ----------------------------------------
     STEP 2: Build Plan Day-by-Day
  ---------------------------------------- */

  const plan = [];

  for (let day = 1; day <= daysLeft; day++) {
    let remaining = dailyMinutes;
    let tasksToday = [];
    let topicsUsed = new Set();

    /* -------- 1️⃣ PRIMARY STUDY (1 HARD / MEDIUM) -------- */

    const primary = normalized.find(t =>
      !t.studied &&
      (t.confidence === "hard" || t.confidence === "medium") &&
      t.studyTime <= remaining
    );

    if (primary) {
      tasksToday.push({
        topic: primary.name,
        type: "study",
        duration: primary.studyTime,
        priority: primary.confidence,
      });

      remaining -= primary.studyTime;
      topicsUsed.add(primary.name);
      primary.studied = true;
      primary.lastStudyDay = day;
    }

    /* -------- 2️⃣ SECONDARY STUDY (EASY / MEDIUM) -------- */

    const secondary = normalized.find(t =>
      !t.studied &&
      !topicsUsed.has(t.name) &&
      t.studyTime <= remaining
    );

    if (secondary) {
      tasksToday.push({
        topic: secondary.name,
        type: "study",
        duration: secondary.studyTime,
        priority: secondary.confidence,
      });

      remaining -= secondary.studyTime;
      topicsUsed.add(secondary.name);
      secondary.studied = true;
      secondary.lastStudyDay = day;
    }

    /* -------- 3️⃣ SPACED REVISIONS -------- */

    normalized.forEach(t => {
      if (
        t.studied &&
        t.revisionsDone < t.revisionCount &&
        !topicsUsed.has(t.name)
      ) {
        const gap = day - t.lastStudyDay;

        // Spaced repetition: +1 day, +3 days
        const validRevisionDay =
          (t.revisionsDone === 0 && gap >= 1) ||
          (t.revisionsDone === 1 && gap >= 3);

        if (validRevisionDay && remaining >= 30) {
          tasksToday.push({
            topic: t.name,
            type: "revision",
            duration: 30,
            priority: t.confidence,
          });

          remaining -= 30;
          topicsUsed.add(t.name);
          t.revisionsDone += 1;
        }
      }
    });

    /* -------- 4️⃣ FILLER BUFFER -------- */

    if (tasksToday.length && remaining >= 30) {
      tasksToday.push({
        topic: "Light revision / self-review",
        type: "buffer",
        duration: remaining,
        priority: "low",
      });
    }

    if (tasksToday.length) {
      plan.push({
        day,
        date: getDateForDay(day),
        tasks: tasksToday,
      });
    }
  }

  return plan;
}
