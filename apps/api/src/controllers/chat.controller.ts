import { COMMON_ERROR_CODES, DeleteChatParams, logError } from "@repo/shared";
import { NextFunction, Request, Response } from "express";
import { AppError, UnauthorizedError } from "../errors/api-errors.js";
import { chatService } from "../services/chat.service.js";
import { successResponse } from "../utils/response.js";

export const chatController = {
  getPromptSuggestions: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          "Please sign in to view suggestions."
        );
      }

      const responseData = await chatService.generatePromptSuggestions();

      res.status(200).json(successResponse(responseData));
    } catch (error) {
      next(error);
    }
  },

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

  getChatThread: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          "Please sign in to view this chat."
        );
      }

      const { id: chatId } = req.params;

      const responseData = await chatService.getChatThread(req.user.id, chatId);

      res.status(200).json(successResponse(responseData));
    } catch (error) {
      next(error);
    }
  },

  streamMessage: async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<{ id: string }, any, { content: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          "Please sign in to send messages."
        );
      }

      const { id: chatId } = req.params;

      const { content } = req.body;

      if (!content || typeof content !== "string" || content.trim() === "") {
        throw new AppError(
          400,
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          "Message content is required."
        );
      }

      // Set headers for SSE / Chunked text streaming
      res.setHeader("Content-Type", "text/plain; charset=utf-8");

      res.setHeader("Transfer-Encoding", "chunked");

      res.setHeader("Cache-Control", "no-cache");

      res.setHeader("Connection", "keep-alive");

      const stream = chatService.streamMessage(req.user.id, chatId, content);

      for await (const chunk of stream) {
        res.write(chunk);
      }

      res.end();
    } catch (error) {
      if (!res.headersSent) {
        next(error);
      } else {
        console.error(
          "❌ [Controller Error] Error during active stream response"
        );

        logError(error);

        res.end();
      }
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
