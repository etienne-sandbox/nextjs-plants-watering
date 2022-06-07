import { goToNextDay, today } from "../../database";

export default async function todayApi(req, res) {
  if (req.method === "POST") {
    const today = await goToNextDay();
    return res.status(200).json({ today });
  }
  const currentDay = await today();
  res.status(200).json({ today: currentDay });
}
