export const sessionConfig = {
  cookieName: "plants-watering-session",
  password: "6R91Z-2n1G3ebtu5b6w3Tx3xvLMRJuFp",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
