import Nookies from "nookies";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import type { NextPage } from "next";

const LoginPage: NextPage = () => {
  return (
    <div>
      <a
        href="/api/google"
        className="p-2 bg-blue-500 text-white rounded cursor-pointer"
      >
        Gogin with Google
      </a>
    </div>
  );
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
