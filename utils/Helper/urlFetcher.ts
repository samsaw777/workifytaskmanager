const mode = process.env.NODE_ENV;

if (!mode) {
  throw new Error("Node ENV is absent!");
}

export const urlFetcher = () => {
  //If mode is development then return localhost else the hoisted URL.
  if (mode === "development") {
    return "http://localhost:3000";
  } else {
    return "https://workifytask.vercel.app";
  }
};
