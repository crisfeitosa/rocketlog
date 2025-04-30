import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { authConfig } from "@/configs/auth";
import AppError from "@/utils/AppError";
import { compare } from "bcrypt";
import { Secret, sign, SignOptions } from "jsonwebtoken";
import { z } from "zod";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    };

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401);
    };

    const { secret, expiresIn } = authConfig.jwt;

    const payload = { role: user.role ?? "customer" };

    const jwtSecret = secret;
    
    const options: SignOptions = {
      subject: user.id,
      expiresIn: expiresIn,
    };

    const token = sign(payload, jwtSecret, options);

    const { password: hashedPassword, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };