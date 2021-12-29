import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, url, method } = req;
    const { statusCode } = res;
    Logger.verbose(`${ip} ${url} ${method} ${statusCode}`);
    next();
  }
}