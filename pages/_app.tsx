import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import ProjectContext from "../Context/ProjectContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProjectContext>
      <Toaster />
      <Component {...pageProps} />
    </ProjectContext>
  );
}

export default MyApp;
