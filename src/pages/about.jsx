import React, { useEffect } from 'react';

function About() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'About'; // Set the title when the component mounts
    return () => {
      // Reset the title to the previous one when the component unmounts
      document.title = previousTitle;
    };
  }, []);

return (
    <div className="mt-[-2rem] bg-black pt-[120px] pb-[50px] ">
    <div className="max-w-[50rem] mx-auto px-4 py-8 text-base leading-6 text-white">
        <div className="mb-4">
        <h1 className="p-2 font-bold text-3xl">About</h1>
        <h3 className="font-bold text-lg mt-2 p-2">What's Anveshna.?</h3>
        <p className="mt-2 p-2">
            Anveshna. is an anime streaming site where you can watch anime online
            in HD quality with English subtitles or dubbing. You can also
            download any anime you want without registration.
          </p>
        </div>
        <div className="mb-4 p-2">
          <h3 className="font-bold text-lg">Is Anveshna. safe?</h3>
          <p className="mt-2">
            Yes. We started this site to improve UX and are committed to
            keeping our users safe. We encourage all our users to notify us if
            anything looks suspicious.
        </p>
        </div>
        <div >
          <h3 className="font-bold text-lg p-2">Why Anveshna.?</h3>
          <p className="mt-2 p-2">
            <strong>Content Library:</strong> We have a vast collection of both
            old and new anime, making us one of the largest anime libraries on
            the web.
          </p>
          <p className="mt-2 p-2">
            <strong>Streaming Experience:</strong> Enjoy{' '}
            <span className="font-bold text-custom-color">fast and reliable</span>{' '}
            streaming with our{' '}
            <span className="font-bold text-custom-color">top-of-the-line servers</span>.
          </p>
          <p className="mt-2 p-2">
            <strong>Quality/Resolution:</strong> Our videos are available in{' '}
            <span className="font-bold text-custom-color">high resolution</span>, and we offer
            quality settings to suit your internet speed.
          </p>
          <p className="mt-2 p-2">
            <strong>Frequent Updates:</strong> Our content is updated hourly to
            provide you with the <span className="font-bold text-custom-color">latest releases</span>.
          </p>
          <p className="mt-2 p-2">
            <strong>User-Friendly Interface:</strong> We focus on{' '}
            <span className="font-bold text-custom-color">simplicity and ease of use</span>.
          </p>
          <p className="mt-2 p-2">
            <strong>Device Compatibility:</strong> Anveshna. works seamlessly on both{' '}
            <span className="font-bold text-custom-color">desktop and mobile devices</span>.
          </p>
          <p className="mt-2 p-2">
            <strong>Community:</strong> Join our active{' '}
            <span className="font-bold text-custom-color">community of anime lovers</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
