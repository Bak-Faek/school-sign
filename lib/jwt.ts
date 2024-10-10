import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface CustomJWTPayload extends JWTPayload {
  userId: number;
  firstname: string | null;
  lastname: string | null;
  schoolId: number;
  classId: number | null;
  role: null | string;
}

export async function createToken(payload: CustomJWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<CustomJWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as CustomJWTPayload;
}
