import { withIronSessionApiRoute } from "iron-session/next";
import { findUser } from "../../database";
import { sessionConfig } from "../../logic/session";

export default withIronSessionApiRoute(async function login(req, res) {
  const { username, password } = req.body;
  const user = await findUser(username, password);
  if (user) {
    req.session.user = user;
    await req.session.save();
    return res.status(200).json({ user: user });
  }
  return res
    .status(400)
    .json({
      status: 400,
      error: "invalid-username-password",
      message: "Invalid username/password",
    });
}, sessionConfig);
