
export enum FitnessGoal {
  WEIGHT_LOSS = 'Weight Loss',
  WEIGHT_GAIN = 'Weight Gain',
  MAINTENANCE = 'Maintenance',
  MUSCLE_GAIN = 'Muscle Gain'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary',
  LIGHTLY_ACTIVE = 'Lightly Active',
  MODERATELY_ACTIVE = 'Moderately Active',
  VERY_ACTIVE = 'Very Active',
  EXTRA_ACTIVE = 'Extra Active'
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  targetWeight: number; // in kg
  goal: FitnessGoal;
  activityLevel: ActivityLevel;
  dailyCalorieGoal: number;
}

export interface NutrientInfo {
  name: string;
  percent: number;
}

export interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  vitamins: NutrientInfo[];
  minerals: NutrientInfo[];
  healthAdvice: {
    isHealthy: boolean;
    reasoning: string;
    whoShouldAvoid: string[];
    bestTimeToEat: string;
    portionRecommendation: string;
  };
  alternatives: {
    healthier: string[];
    similar: string[];
  };
}

export interface LogEntry {
  id: string;
  timestamp: number;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image?: string;
}

export interface FavoriteItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppSettings {
  useMetric: boolean;
  notificationsEnabled: boolean;
}

export interface AppState {
  profile: UserProfile;
  waterIntake: number; // in ml
  foodLogs: LogEntry[];
  favorites: FavoriteItem[];
  chatHistory: ChatMessage[];
  settings: AppSettings;
  hasOnboarded: boolean;
}
