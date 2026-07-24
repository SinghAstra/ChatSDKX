import { COMMON_ERROR_CODES, DeleteChatParams } from "@repo/shared";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/api-errors.js";
import { chatService } from "../services/chat.service.js";
import { successResponse } from "../utils/response.js";

export const chatController = {
  getChats: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          "Please sign in to view your chats."
        );
      }

      const responseData = await chatService.getChats(req.user.id);

      res.status(200).json(successResponse(responseData));
    } catch (error) {
      next(error);
    }
  },

  deleteChat: async (
    req: Request<DeleteChatParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          "Please sign in to delete this chat."
        );
      }

      const { id: chatId } = req.params;

      const responseData = await chatService.deleteChat(req.user.id, chatId);

      res.status(200).json(successResponse(responseData));
    } catch (error) {
      next(error);
    }
  },
};
