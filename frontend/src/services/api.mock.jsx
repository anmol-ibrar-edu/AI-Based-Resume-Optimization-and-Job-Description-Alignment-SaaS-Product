// src/services/api.mock.jsx

const fakeDelay = (data, time = 800) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), time));

// AUTH
export const authAPI = {
  register: (data) =>
    fakeDelay({ message: "Registered successfully", user: data }),

  login: (data) => {
    localStorage.setItem("token", "demo-token-123");
    return fakeDelay({
      access_token: "demo-token-123",
      user: {
        id: "U001",
        name: "Demo Student",
        email: data.email,
      },
    });
  },
};

// USER
export const userAPI = {
  getMe: () =>
    fakeDelay({
      id: "U001",
      name: "Demo Student",
      email: "demo@university.edu",
    }),

  getStats: () =>
    fakeDelay({
      resumes: 3,
      jobs: 2,
      analyses: 5,
    }),

  update: (data) => fakeDelay({ ...data }),
};

// RESUME
export const resumeAPI = {
  upload: () =>
    fakeDelay({
      id: "R001",
      filename: "resume.pdf",
      uploaded_at: new Date(),
    }),

  getAll: () =>
    fakeDelay([
      { id: "R001", filename: "resume.pdf" },
      { id: "R002", filename: "resume_v2.pdf" },
    ]),

  getOne: (id) =>
    fakeDelay({ id, filename: "resume.pdf" }),

  delete: () => fakeDelay({ success: true }),
};

// JOB
export const jobAPI = {
  create: (data) => fakeDelay({ id: "J001", ...data }),

  getAll: () =>
    fakeDelay([
      { id: "J001", title: "Frontend Developer" },
      { id: "J002", title: "AI Engineer" },
    ]),

  getOne: (id) =>
    fakeDelay({ id, title: "Frontend Developer" }),

  delete: () => fakeDelay({ success: true }),
};

// ANALYSIS
export const analysisAPI = {
  getHistory: () =>
    fakeDelay([
      {
        id: "A001",
        ats_score: 82,
        resume_filename: "JohnDoe.pdf",
        job_title: "Frontend Developer",
        created_at: new Date().toISOString(),
      },
      {
        id: "A002",
        ats_score: 76,
        resume_filename: "JaneDoe.pdf",
        job_title: "AI Engineer",
        created_at: new Date().toISOString(),
      },
    ]),
  analyze: () =>
    fakeDelay({
      ats_score: 82,
      matchLevel: "Strong Match",
      missingSkills: ["Docker", "AWS"],
      suggestions: [
        "Improve keyword alignment",
        "Add quantified achievements",
      ],
    }, 1200),
  getOne: (id) =>
    fakeDelay({
      id,
      ats_score: 82,
      resume_filename: "JohnDoe.pdf",
      job_title: "Frontend Developer",
      created_at: new Date().toISOString(),
    }),
  delete: () => fakeDelay({ success: true }),
};

// DASHBOARD
export const dashboardAPI = {
  getStats: () =>
    fakeDelay({
      total_analyses: 5,
      best_score: 95,
      improvement: 10,
    }),
};

