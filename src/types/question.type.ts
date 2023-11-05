import { QuestionType } from "@/enums/question.enum";
import { QuestionDocument, QuestionOptionDocument } from "@/interfaces/question.interface";
import { Model } from "mongoose";

export type QuestionModelInterface = Model<QuestionDocument>;
export type QuestionOptionModelInterface = Model<QuestionOptionDocument>;

export type CreateQuestionInput = {
  question: string;
  questionType: QuestionType;
  options?: QuestionOptionDocument[];
  correctAnswer?: QuestionOptionDocument[];
};

export type UpdateQuestionInput = {
    question ?: string;
    options?: QuestionOptionDocument[];
    correctAnswer?: QuestionOptionDocument[];
}