import { QuestionType } from "@/enums/question.enum";
import { UserDocument } from "./user.interface";
import { Document } from "mongoose";

export interface QuestionOption {
  option: string;
  points: number;
}

export interface Question {
  question: string;
  author: UserDocument;
  questionType: QuestionType;
  options?: QuestionOption[];
  correctAnswer?: QuestionOption[];
}

export interface QuestionDocument extends Question, Document {}
export interface QuestionOptionDocument extends QuestionOption, Document {}
