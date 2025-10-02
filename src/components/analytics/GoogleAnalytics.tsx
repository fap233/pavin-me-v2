"use client";

import Script from "next/script";
import React from "react";

const GA_MEASUREMENT_ID = "G-JHN16PCE76";

const GoogleAnalytics = () => {
	if (process.env.NODE_ENV !== "production") {
		return null;
	}

	return (
		<>
			<Script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
				strategy="afterInteractive"
			></Script>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);}
      
      gtag("js", new Date());

      gtag("config", "${GA_MEASUREMENT_ID}");
    `}
			</Script>
		</>
	);
};

export default GoogleAnalytics;
