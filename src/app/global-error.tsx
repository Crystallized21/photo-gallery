"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import {useEffect} from "react";
import {getLocale} from "gt-next/server";
import {GTProvider} from "gt-next";

export default async function GlobalError({error}: { error: Error & { digest?: string; }; }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang={await getLocale()}>
    <body><GTProvider>
      {/* `NextError` is the default Next.js error page component. Its type
             definition requires a `statusCode` prop. However, since the App Router
             does not expose status codes for errors, we simply pass 0 to render a
             generic error message. */}
      <NextError statusCode={0}/>
    </GTProvider></body>
    </html>
  );
}
