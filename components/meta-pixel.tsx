"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import {
  META_ADVANCED_MATCHING_STORAGE_KEY,
  META_PIXEL_ID,
  trackMetaPageView,
} from "@/lib/meta-pixel"

/**
 * Loads the Meta Pixel once and tracks a PageView on every route change.
 *
 * Advanced Matching is applied here in two ways:
 *   1. The saved customer data (email / phone / name / city ...) is read from
 *      sessionStorage during `fbq("init", ...)`, so it is available before the
 *      first event is sent.
 *   2. `setAdvancedMatching()` can be called from login, checkout, account, ...
 *      at any time. Each call re-runs `fbq("init", PIXEL_ID, data)` and merges
 *      the new values with the ones already stored for the session.
 */
export default function MetaPixel() {
  const pixelId = META_PIXEL_ID
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackMetaPageView()
  }, [pathname, searchParams])

  if (!pixelId) {
    return null
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            // Base initialisation (no customer data yet).
            fbq('init', '${pixelId}');

            // Manual Advanced Matching: re-apply the data saved during this
            // session (login, checkout, account page, ...). The pixel hashes
            // these values automatically with SHA-256.
            try {
              var storedAdvancedMatching = window.sessionStorage.getItem('${META_ADVANCED_MATCHING_STORAGE_KEY}');
              if (storedAdvancedMatching) {
                var advancedMatching = JSON.parse(storedAdvancedMatching);
                if (advancedMatching && typeof advancedMatching === 'object') {
                  fbq('init', '${pixelId}', advancedMatching);
                }
              }
            } catch (error) {}
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
