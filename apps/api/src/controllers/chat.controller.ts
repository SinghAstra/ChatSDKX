import { NextFunction, Request, Response } from "express";
import { chatService } from "../services/chat.service.js";
import { successResponse } from "../utils/response.js";

export const chatController = {
  getChats: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const responseData = await chatService.getChats(req.user!.id);
      res.status(200).json(successResponse(responseData));
    } catch (error) {
      next(error);
    }
  },

  deleteChat: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id: chatId } = req.params;
      const responseData = await chatService.deleteChat(req.user!.id, chatId);
      res.status(200).json(successResponse(responseData));
    } catch (error) {
      next(error);
    }
  },
};
