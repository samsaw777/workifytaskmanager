import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import ProjectContext from "../Context/ProjectContext";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }: AppProps) {
  // NextNProgress.configure({ showSpinner: false });
  return (
    <ProjectContext>
      <Toaster />
      <NextNProgress color="#28BEBD" options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </ProjectContext>
  );
}

export default MyApp;
