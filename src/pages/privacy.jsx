import React, { useEffect } from 'react';

const sections = [
  {
    title: 'Privacy Policy',
    content: (
      <p>
        <strong>Data Collection</strong>: We collect minimal user data necessary
        for the functioning of Anveshna., such as user
        preferences.
        <br />
        <br />
        <strong>Use of Data</strong>: The data collected is used to improve
        service quality and user experience. We do not share personal data with
        third parties except as required by law.
        <br />
        <br />
        <strong>Cookies and Tracking</strong>: Anveshna. uses cookies and similar
        tracking technologies to enhance the user experience like caching video
        timestamps and tracking watched content.
        <br />
        <br />
        <strong>Third-Party Services</strong>: Embedded videos from third-party
        sites may have their own privacy policies, and we advise users to read
        these policies on the respective sites.
        <br />
        <br />
        <strong>Security</strong>: We are committed to ensuring your data is
        secure but remind users that no method of transmission over the Internet
        is 100% secure.
        <br />
        <br />
        <strong>Changes to Privacy Policy</strong>: We may update our Privacy
        Policy from time to time. We will notify users of any changes by posting
        the new policy on this page.
        <br />
        <br />
        <strong>Contact Us</strong>: If you have any questions about these
        terms, please contact us at{' '}
        <a href='mailto:devxoshakya@gmail.com' className="font-bold text-indigo-600">
          devxoshakya@gmail.com
        </a>
      </p>
    ),
  },
  {
    title: 'Terms of Service',
    content: (
      <p>
        <strong>Acceptance of Terms</strong>: By using Anveshna., you agree to
        these Terms of Service and acknowledge that they affect your legal
        rights and obligations.
        <br />
        <br />
        <strong>Content</strong>: Anveshna. does not host video content but embeds
        videos from various third-party sources. We are not responsible for the
        content, quality, or the policies of these external sites.
        <br />
        <br />
        <strong>Use of Site</strong>: The service is provided "as is" and is
        used at the user’s own risk. Users must not misuse the service in any
        way that breaches laws or regulations.
        <br />
        <br />
        <strong>User Content</strong>: Users may share content, such as comments
        or reviews, responsibly. We reserve the right to remove any content that
        violates our policies or is deemed inappropriate.
        <br />
        <br />
        <strong>Intellectual Property</strong>: The intellectual property rights
        of the embedded videos remain with their respective owners. Anveshna.
        respects these rights and does not claim ownership of this content.
        <br />
        <br />
        <strong>Changes to Terms of Service</strong>: We reserve the right to
        modify these terms at any time. Continued use of the site after changes
        constitutes acceptance of the new terms.
        <br />
        <br />
        <strong>Termination</strong>: We may terminate or suspend access to our
        service immediately, without prior notice, for any breach of these
        Terms.
      </p>
    ),
  },
];

function PolicyTerms() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Policy & Terms'; // Set the title when the component mounts
    return () => {
      // Reset the title to the previous one when the component unmounts
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="mt-[-2rem]  bg-black pt-[120px] pb-[50px]">
      <div className="max-w-[50rem] mx-auto px-4 py-8 text-base leading-6 text-white">
        {sections.map((section, index) => (
          <div key={index}>
            {section.title && <h1 className="font-bold text-2xl mb-4">{section.title}</h1>}
            <div className="mb-4">{section.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PolicyTerms;
