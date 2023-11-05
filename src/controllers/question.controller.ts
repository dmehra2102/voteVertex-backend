import { QuestionType } from "@/enums/question.enum";
import { QuestionDocument } from "@/interfaces/question.interface";
import { UserRequest } from "@/interfaces/userRequest.interface";
import QuestionModel from "@/models/question.model";
import { CreateQuestionInput, UpdateQuestionInput } from "@/types/question.type";
import { logger } from "@/utils/logger";
import { NextFunction, Response, response } from "express";
import { FilterQuery } from "mongoose";

class QuestionController {
  public createQuestion = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      logger.info("createQuestion controller execution started");
      const { _id } = req.user;
      const { question, questionType, correctAnswer, options }: CreateQuestionInput = req.body;

      const existingQuestion = await QuestionModel.findOne({ question: new RegExp(question, "i") });

      if (existingQuestion) {
        return res.status(400).send({ error: true, message: "Question already exists." });
      }

      const newQuestion = new QuestionModel({ author: _id, question, questionType });

      if (questionType === QuestionType.MULTIPLECHOICE && (!options || !options.length)) {
        return res.status(400).send({ error: true, message: "For a multiple type question , options are required." });
      } else if (questionType === QuestionType.MULTIPLECHOICE) {
        newQuestion.options = options;
      }

      if (correctAnswer) newQuestion.correctAnswer = correctAnswer;

      await newQuestion.save();
      logger.info("Successfully executed createQuestion controller.");
      return res.status(201).send({ error: false, message: "Question created successfully", data: newQuestion });
    } catch (error: any) {
      logger.error(`Error in questionController.createQuestion : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public deleteQuestionById = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;
      await QuestionModel.findByIdAndDelete(questionId);

      if (!questionId) return res.status(404).send({ error: true, message: `Question with id ${questionId} not found.` });

      logger.info(`Successfully executed deleteQuestionById controller. Question with id ${questionId} deleted successfully`);
      return res.status(200).send({ error: true, message: `Successfully deleted question with id ${questionId}` });
    } catch (error: any) {
      logger.error(`Error in questionController.deleteQuestionById : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public getAllQuestions = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const questions = await QuestionModel.find();
      logger.info(`Successfully executed getAllQuestions controller.`);
      return res.status(200).send({ error: false, message: "Successfully fetched all questions.", data: questions });
    } catch (error: any) {
      logger.error(`Error in questionController.getAllQuestions : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public getQuestionById = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;
      const question = await QuestionModel.findById(questionId);

      if (!question) return res.status(404).send({ error: true, message: `Question with id ${questionId} not found.` });

      logger.info(`Successfully executed getQuestionById controller.`);
      return res.status(200).send({ error: false, message: "Successfully fetched question.", data: question });
    } catch (error: any) {
      logger.error(`Error in questionController.getQuestionById : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public updateQuestionById = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;
      const { correctAnswer, options, question }: UpdateQuestionInput = req.body;

      const updatedData: FilterQuery<QuestionDocument> = {};
      const ques = await QuestionModel.findById(questionId);
      if (!ques) return res.status(404).send({ error: true, message: `Question with id ${questionId} not found.` });

      if (question) updatedData.question = question;
      if (correctAnswer) updatedData.correctAnswer = correctAnswer;
      if (ques.questionType === QuestionType.MULTIPLECHOICE && (!options || !options.length)) {
        return res.status(400).send({ error: true, message: "For a multiple type question , options are required." });
      } else if (ques.questionType === QuestionType.MULTIPLECHOICE) {
        updatedData.options = options;
      }

      const updatedQuestion = await QuestionModel.findByIdAndUpdate(questionId, updatedData, { new: true });
      
      logger.info(`Successfully executed updateQuestionById controller.`);
      return res.status(200).send({ error: false, message: "Successfully updated question.", data: updatedQuestion });
    } catch (error: any) {
      logger.error(`Error in questionController.updateQuestionById : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };
}

export default QuestionController;
