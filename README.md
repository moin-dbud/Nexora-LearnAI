# Nexora LearnAI

An intelligent study planning platform for college students preparing for exams. Combines rule-based scheduling algorithms with AI-powered learning insights to create effective, personalized study plans.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.7.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

---

## Team

**Team Name:** Nexora

**Members:**
- Moin Sheikh (Leader)
- Ritesh Tihile
- Shruti Badgujar
- Mohini Gathe
- Ananya Gupta

---

## Hackathon Context

**Track 4: Educational Technology (EdTech)**

This project addresses learning outcomes and pedagogical effectiveness through evidence-based study planning. Built using Google Cloud technologies (Firebase, Firestore) and Gemini API for AI-powered explanations. The platform focuses on helping students develop effective study habits through transparent, scientifically-backed scheduling rather than opaque AI-generated plans.

---

## The Problem

College students struggle with exam preparation:
- Overwhelming amount of material to cover
- Poor time management and procrastination
- Ineffective study strategies that don't align with learning science
- No clear roadmap from "start studying" to "exam ready"
- Difficulty prioritizing topics by importance and difficulty
- Lack of understanding about why certain study approaches work

These issues directly impact learning outcomes and academic performance.

## Our Solution

Nexora LearnAI provides a **deterministic, rule-based study planner** that generates scientifically-backed schedules using spaced repetition and priority-based task allocation. The platform emphasizes pedagogical transparency—students understand not just what to study, but why the schedule is structured that way. AI is used **only** for generating learning insights and explanations, ensuring students develop metacognitive awareness of effective study strategies.

This approach ensures:
- Predictable, consistent results based on learning science
- Transparent scheduling logic that teaches effective study habits
- No AI hallucinations in core functionality
- Cost-effective operation (AI used sparingly)
- Focus on learning outcomes over arbitrary task completion

---

## Why This Fits the EdTech Track

- **Learning Outcomes Focus**: Implements spaced repetition and priority-based scheduling proven to improve retention
- **Pedagogical Transparency**: Students understand the reasoning behind their study schedule
- **Metacognitive Development**: AI explanations help students learn how to learn effectively
- **Evidence-Based Design**: Planning algorithm based on cognitive science research
- **Scalable Education Technology**: Firebase and Firestore enable cost-effective deployment
- **Responsible AI Integration**: Gemini API used to enhance learning, not replace pedagogical decision-making
- **Student-Centered**: Adapts to individual confidence levels and time constraints

---

## Key Features

### Rule-Based Study Planning
The core planning engine uses a deterministic algorithm that:
- Analyzes topic difficulty (easy/medium/hard based on user confidence)
- Calculates optimal study time per topic
- Schedules primary study sessions and spaced revisions (1-day and 3-day intervals)
- Balances daily workload based on available study hours
- Prioritizes difficult topics first

**Why not AI for planning?** AI-generated schedules can be inconsistent, unpredictable, and difficult to trust. Our rule-based approach provides reliable, scientifically-backed plans every time, helping students understand effective study strategies.

### Multiple Subject Plans
- Create unlimited study plans, one per subject/exam
- Each plan tracks progress independently
- Clean dashboard overview of all active plans
- Delete plans when no longer needed

### Progress Tracking
- Real-time completion percentage
- Visual progress bars with gradient styling
- Task completion with checkbox interface
- "Today's Focus" highlighting for current day
- Per-plan and overall statistics

### AI-Powered Explanations
AI is used **only** for generating learning insights:
- **Day-level explanations**: Understand why today's task mix was chosen
- **Topic-level explanations**: Get exam-focused learning tips for each topic
- **User-triggered only**: No automatic AI calls
- **Firestore caching**: Explanations cached for instant re-access
- **Honest error handling**: Clear messages when API quota exceeded (no fake responses)

### Demo Cache Strategy
Production-ready caching architecture:
- **Cache-first**: Check Firestore before calling Gemini API
- **Instant responses**: Cached explanations load immediately
- **Cost optimization**: Minimize API calls through intelligent caching
- **Graceful degradation**: App continues working even when quota exceeded
- **Persistent storage**: Cache survives sessions and devices

---

## Architecture & Design Decisions

### Why Rule-Based Planning Over AI?
1. **Predictability**: Same inputs always produce same output
2. **Transparency**: Users understand how their schedule was created
3. **Reliability**: No AI hallucinations or inconsistencies
4. **Cost-Effective**: No API costs for core functionality
5. **Scientific Basis**: Built on proven spaced repetition research

### Why AI Only for Explanations?
1. **Value-Added**: AI excels at generating personalized learning insights
2. **Non-Critical**: Explanations enhance the experience but aren't required
3. **Cacheable**: Same topic explanations can be reused across users
4. **Honest**: Clear error messages when quota limits reached

### Why Firestore Caching?
1. **Performance**: Instant load for cached content
2. **Cost Reduction**: Avoid repeated API calls for same content
3. **Offline Support**: Cached explanations work without internet
4. **Scalability**: Firestore handles growth efficiently
5. **User Experience**: Consistent, fast responses

### Hackathon Context
This project demonstrates responsible AI integration in educational technology:
- AI used where it adds pedagogical value (explanations)
- Traditional algorithms used where reliability matters (planning)
- Production-ready error handling
- Cost-conscious architecture suitable for educational institutions
- Honest about limitations

---

## Tech Stack

**Frontend**
- Next.js 16.1.1 (React framework with SSR)
- React 19.2.3 (UI library)
- Tailwind CSS 4 (utility-first styling)
- Framer Motion 12 (animations)
- Lucide React (icons)

**Backend**
- Firebase Authentication (Google OAuth)
- Firestore (NoSQL database)
- Next.js API Routes (serverless functions)

**AI**
- Google Gemini 2.0 Flash (explanations only)
- Custom Firestore caching layer

---

## Project Structure

```
nexora-learnai/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── features/
│   │   │   ├── Hero.jsx
│   │   │   ├── ProblemSolution.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── WhyNexora.jsx
│   │   │   └── FinalCTA.jsx
│   │   └── ExplanationModal.jsx
│   ├── pages/
│   │   ├── index.js                # Landing page
│   │   ├── login.jsx               # Authentication
│   │   ├── profile.jsx             # Profile setup
│   │   ├── planner.jsx             # Study plan creator
│   │   ├── dashboard.jsx           # Plans overview
│   │   ├── plan/
│   │   │   └── [planId].jsx        # Individual plan detail
│   │   └── api/
│   │       ├── explainPlan.js      # Day-level AI explanations
│   │       └── explainTopic.js     # Topic-level AI explanations
│   ├── services/
│   │   ├── explainPlan.js          # Day explanation service
│   │   └── explainTopic.js         # Topic explanation service
│   ├── utils/
│   │   └── planGenerator.js        # Rule-based planning algorithm
│   ├── lib/
│   │   └── firebase.js             # Firebase configuration
│   └── styles/
│       └── globals.css             # Global styles + animations
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Firebase project with Authentication and Firestore enabled
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd nexora-learnai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration (server-side only)
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

### User Flow

1. **Authentication**: Sign in with Google
2. **Profile Setup**: Enter student details (name, college, course)
3. **Create Plan**: 
   - Enter exam details (subject, date, daily study hours)
   - Add topics with confidence levels (easy/medium/hard)
   - Generate plan using rule-based algorithm
4. **Dashboard**: View all study plans as cards
5. **Study**: 
   - Open a plan to see day-by-day schedule
   - Complete tasks by checking boxes
   - Request AI explanations for topics
   - Track progress in real-time
6. **Manage**: Delete plans when no longer needed

### Planning Algorithm

The rule-based planner:
1. Calculates days until exam
2. Assigns study time based on topic difficulty:
   - Hard: 90 minutes + 2 revisions
   - Medium: 60 minutes + 1 revision
   - Easy: 30 minutes + 0 revisions
3. Schedules primary study sessions (prioritizing hard topics)
4. Adds spaced revisions (+1 day, +3 days)
5. Fills remaining time with buffer/review tasks
6. Balances daily workload within available hours

### Cache Strategy

**First Request (Cache Miss):**
```
User clicks "Explain" 
  → Check Firestore cache (miss)
  → Call Gemini API
  → Store in Firestore
  → Display to user
```

**Subsequent Requests (Cache Hit):**
```
User clicks "Explain"
  → Check Firestore cache (HIT)
  → Return cached explanation instantly
  → No API call needed
```

**Quota Exceeded:**
```
User clicks "Explain"
  → Check Firestore cache (miss)
  → Call Gemini API (429 error)
  → Return graceful message
  → Dashboard continues working normally
```

---

## Firestore Structure

```
users/
  {userId}/
    profile: {
      fullName, email, college, course, year, dob
      profileCompleted: boolean
      createdAt: timestamp
    }
    plans/
      {planId}/
        planId: string
        subjectName: string
        examDate: string
        dailyHours: number
        topics: array
        plan: array (day-wise tasks)
        progress: number (0-100)
        totalTasks: number
        completedTasks: number
        status: "active"
        createdAt: timestamp
    explanations/
      {topicKey}/
        topic: string
        explanation: string
        difficulty: string
        type: string
        generatedAt: timestamp
    planExplanations/
      {planKey}/
        explanation: string
        generatedAt: timestamp
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Known Limitations

- AI explanations require active internet connection
- Gemini API has daily quota limits (handled gracefully with caching)
- Study plans are static once generated (no dynamic re-scheduling)
- Single user per account (no study group features)

---

## Future Enhancements

- Study streak tracking and gamification
- Pomodoro timer integration
- Study analytics dashboard
- Mobile app (React Native)
- Collaborative study groups
- Custom revision interval configuration
- Export plans to calendar apps

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `GEMINI_API_KEY` | Google Gemini API key (server-side) | Yes |

---

## Contributing

This is a hackathon project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Next.js team for the framework
- Firebase for backend infrastructure
- Google for Gemini AI API
- Tailwind CSS for styling utilities
- The open-source community

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Built for students, by students.
