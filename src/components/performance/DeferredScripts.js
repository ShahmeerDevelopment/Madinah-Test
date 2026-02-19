import Script from "next/script";

/**
 * Component for loading non-critical scripts after the page has loaded
 * This helps improve initial page load performance
 */
const DeferredScripts = () => {
  return (
    <>
      {/* Hotjar - Load with low priority */}
      {/* <Script
        id="hotjar"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6}; // Replace with your Hotjar ID
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
        }}
      /> */}

      {/* Google Tag Manager - Additional tracking */}
      <Script
        id="gtm-additional"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            // Additional GTM events can be loaded here
            if (window.dataLayer) {
              window.dataLayer.push({
                event: 'deferred_scripts_loaded',
                timestamp: Date.now()
              });
            }
          `,
        }}
      />
    </>
  );
};

export default DeferredScripts;
