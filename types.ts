import React from 'react';

export interface StudentData {
  name: string;
  studentId: string;
  subject: string;
  drName?: string;
  college: string;
  department?: string;
  logo?: File | null;
  collegeLogo?: File | null;
}

export interface QuizData {
  name: string;
  studentId: string;
  questionText: string;
  questionImage?: File | null;
  collegeLogo?: File | null;
}

export interface GeneratedContent {
  text: string;
  imageUrl?: string;
}

export enum AppRoute {
  HOME = 'home',
  ASSIGNMENT = 'assignment',
  REPORT = 'report',
  PRESENTATION = 'presentation',
  QUIZ = 'quiz',
  SHEET = 'sheet',
  SUBSCRIPTION = 'subscription',
  SETTINGS = 'settings',
  PROFILE = 'profile',
}

export interface UserCredits {
  available: number;
  isSubscribed: boolean;
  pendingRequest: boolean;
}

export interface SearchImage {
  title: string;
  link: string;
  thumbnail: string;
  contextLink: string;
}
