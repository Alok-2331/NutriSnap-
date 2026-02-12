
import { FitnessGoal, Gender, UserProfile, ActivityLevel } from './types';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  age: 28,
  gender: Gender.MALE,
  weight: 78,
  height: 182,
  targetWeight: 75,
  goal: FitnessGoal.WEIGHT_LOSS,
  activityLevel: ActivityLevel.MODERATELY_ACTIVE,
  dailyCalorieGoal: 2100
};

export const WATER_GOAL = 2500; // ml
export const WATER_STEP = 250; // ml

export const THEME_COLORS = {
  primary: 'emerald-500',
  primaryDark: 'emerald-600',
  secondary: 'emerald-100',
  accent: 'emerald-400',
};
