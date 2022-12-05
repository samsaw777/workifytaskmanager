import Nookies from "nookies";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import type { NextPage } from "next";
import LoginComponent from "../../components/authentication/login";

const LoginPage: NextPage = () => {
  return <LoginComponent />;
};

export async function getServerSideProps(context: any) {
  const { req, res } = context;

  const cookie = Nookies.get({ req });

  if (cookie.token) {
    return {
      redirect: {
        destination: `${urlFetcher()}`,
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default LoginPage;
