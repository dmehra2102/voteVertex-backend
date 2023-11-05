import { QuestionType } from "@/enums/question.enum";
import { QuestionDocument, QuestionOptionDocument } from "@/interfaces/question.interface";
import { QuestionModelInterface, QuestionOptionModelInterface } from "@/types/question.type";
import { Schema, Types, model } from "mongoose";

const questionOptionSchema = new Schema<QuestionOptionDocument, QuestionOptionModelInterface>(
  {
    option: { type: String, required: true },
    points: { type: Number, required: true, default: 1 },
  },
  {
    versionKey: false,
  }
);

const questionSchema = new Schema<QuestionDocument, QuestionModelInterface>(
  {
    question: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User", required: true },
    questionType: { type: String, enum: Object.values(QuestionType), default: QuestionType.MULTIPLECHOICE, required: true },
    options: { type: [questionOptionSchema] },
    correctAnswer: { type: [questionOptionSchema] },
  },
  { versionKey: false, timestamps: true }
);

const QuestionModel = model("Question", questionSchema);

export default QuestionModel;
