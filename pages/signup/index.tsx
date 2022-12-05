import type { NextPage } from "next";
import SignupComponent from "../../components/authentication/signup";
import Nookies from "nookies";
import { urlFetcher } from "../../utils/Helper/urlFetcher";

const SignupPage: NextPage = () => {
  return <SignupComponent />;
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
export default SignupPage;
