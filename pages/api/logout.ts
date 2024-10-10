import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = serialize("session", "", {
    httpOnly: true,
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ message: "Logged out" });
}
