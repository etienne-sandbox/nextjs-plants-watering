import { withIronSessionApiRoute } from "iron-session/next";
import { sessionConfig } from "../../logic/session";

export default withIronSessionApiRoute(async function login(req, res) {
  req.session.destroy();
  return res.status(204).end();
}, sessionConfig);
