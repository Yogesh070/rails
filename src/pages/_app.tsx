import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, getSession } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

import type { NextPage } from 'next'
import Head from "next/head";
import { ConfigProvider, theme } from 'antd';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type PagePropsWithSession = {
  session?: Session | null,
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}: {
  Component: NextPageWithLayout,
  pageProps: PagePropsWithSession
}) => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <Head>
        <title>Rails</title>
        <meta name="description" content="A project management tool used to plan, track, and manage projects." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ConfigProvider
          theme={{
            token: {
              "colorPrimary": "#fe4365",
              "borderRadius": 4,
              "wireframe": true,
            },
            // algorithm: darkAlgorithm,
          }}
        >
          {
            getLayout(<Component {...pageProps} />)
          }
        </ConfigProvider>
      </SessionProvider>
    </>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  };
};

export default api.withTRPC(MyApp);
