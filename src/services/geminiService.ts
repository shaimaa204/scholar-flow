import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SchedulePlan {
  startTime: string;
  endTime: string;
  activity: string;
  type: 'study' | 'break' | 'exam';
}

export async function generateStudySchedule(userData: {
  availableHours: number;
  subjects: string[];
  tasks: string[];
  exams: string[];
  dailyGoal?: string;
}) {
  const prompt = `Generate a smart daily study schedule for a school student.
  Available study hours today (after school): ${userData.availableHours} hours.
  Specific Goal for today: ${userData.dailyGoal || 'Complete homework and review subjects'}.
  Subjects: ${userData.subjects.join(', ')}.
  Homework/Tasks: ${userData.tasks.join(', ')}.
  Upcoming Exams/Quizzes: ${userData.exams.join(', ')}.
  
  Provide a structured plan with focused sessions (30-45 mins for school level) and short breaks. 
  Prioritize completing specific homework and then reviewing subjects with upcoming quizzes.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            startTime: { type: Type.STRING, description: "HH:MM format" },
            endTime: { type: Type.STRING, description: "HH:MM format" },
            activity: { type: Type.STRING, description: "Subject name or break description" },
            type: { type: Type.STRING, enum: ["study", "break", "exam"] }
          },
          required: ["startTime", "endTime", "activity", "type"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text) as SchedulePlan[];
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
}
