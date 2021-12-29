import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiredTime: process.env.JWT_EXPIRED_TIME
}))