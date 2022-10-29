import { ImageResponse } from '@vercel/og';
import clsx from 'clsx';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default async function (req: NextRequest) {
  // Get these URLs by doing curl:
  // curl 'https://fonts.googleapis.com/css?family=Inter:@wght=400,700' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'User-Agent: AppleWebKit/537.36 (KHTML, like Gecko) Chrome'
  // Because Google Fonts would return woff2 for most modern browsers, which `satori` (the engine used by @vercel/og)
  // does not support yet.
  const interFontArrayBuffer = await fetch(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjg.woff',
  ).then((res) => res.arrayBuffer());
  const interFontBoldArrayBuffer = await fetch(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjg.woff',
  ).then((res) => res.arrayBuffer());

  const url = req.nextUrl;
  const title = url.searchParams.get('title') || 'jackyef.com';
  const description = url.searchParams.get('description');

  return new ImageResponse(
    (
      <div
        tw={clsx('bg-slate-50', 'flex flex-col justify-center')}
        style={{
          fontFamily: 'Inter',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',

            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(300px) saturate(150%)',
            backgroundImage: `linear-gradient(45deg, #50B4B4 50%, #D980FF 50%)`,
          }}
        />

        <div tw="flex flex-col p-16 mb-16">
          <span
            tw="mb-4"
            style={{
              fontWeight: 700,
              fontSize: 90,
            }}
          >
            {title}
          </span>
          {Boolean(description) && (
            <span tw="mb-2 text-3xl text-slate-600">{description}</span>
          )}
        </div>
        <span
          tw="absolute bottom-16 left-16 text-slate-500"
          style={{
            fontSize: 70,
          }}
        >
          🤓📝
        </span>
        <span
          tw="absolute text-2xl bottom-16 right-16 text-slate-500"
          style={{
            fontWeight: 400,
          }}
        >
          @jackyef__
        </span>
      </div>
    ),
    {
      debug: false,
      fonts: [
        {
          name: 'Inter',
          data: interFontArrayBuffer,
          weight: 400,
        },
        {
          name: 'Inter',
          data: interFontBoldArrayBuffer,
          weight: 800,
        },
      ],
      emoji: 'fluent',
    },
  );
}
