import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
	userId: string;
	role: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

			req.user = {
				userId: decoded.userId,
				role: decoded.role,
			};

			next();
		} catch (error) {
			res.status(401).json({ message: 'Not authorized, token failed' });
		}
	}

	if (!token) {
		res.status(401).json({ message: 'Not authorized, no token' });
	}
};
