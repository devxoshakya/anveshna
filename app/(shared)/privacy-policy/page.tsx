export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-muted-foreground">
        <p className="text-sm text-foreground">
          Last Updated: March 6, 2026
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to Anveshna. We respect your privacy and are committed to protecting your personal 
            data. This privacy policy will inform you about how we handle your data when you visit our 
            website and tell you about your privacy rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
          <p className="leading-relaxed mb-3">
            Anveshna collects minimal personal information to provide you with our service:
          </p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
            <li><strong className="text-foreground">Usage Data:</strong> Information about how you use our website, such as pages visited, time spent, and interactions</li>
            <li><strong className="text-foreground">Watch History:</strong> Information about the anime you watch to provide personalized recommendations (stored locally)</li>
            <li><strong className="text-foreground">Technical Data:</strong> Browser type, device information, IP address, and similar technical information</li>
            <li><strong className="text-foreground">Cookies:</strong> Small data files stored on your device to enhance user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
          <p className="leading-relaxed mb-3">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
            <li>To provide and maintain our service</li>
            <li>To improve and personalize your experience</li>
            <li>To track watch history and provide recommendations</li>
            <li>To analyze usage patterns and improve our platform</li>
            <li>To detect and prevent technical issues and abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Data Storage and Security</h2>
          <p className="leading-relaxed">
            Most of your data, including watch history and preferences, is stored locally in your 
            browser using localStorage. This means your personal viewing data stays on your device 
            and is not transmitted to our servers. We implement appropriate security measures to 
            protect any data we do process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
          <p className="leading-relaxed">
            Our service integrates with third-party content providers to deliver anime streaming. 
            These third parties may collect their own data according to their privacy policies. We 
            recommend reviewing the privacy policies of these third-party services. Anveshna does 
            not control and is not responsible for the privacy practices of third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">6. Cookies and Tracking Technologies</h2>
          <p className="leading-relaxed">
            We use cookies and similar tracking technologies to track activity on our service and 
            store certain information. Cookies are small data files that may include an anonymous 
            unique identifier. You can instruct your browser to refuse all cookies or to indicate 
            when a cookie is being sent. However, if you do not accept cookies, you may not be able 
            to use some portions of our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">7. Your Privacy Rights</h2>
          <p className="leading-relaxed mb-3">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed ml-4">
            <li><strong className="text-foreground">Access:</strong> Request access to your personal data</li>
            <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data (you can clear browser data)</li>
            <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</li>
            <li><strong className="text-foreground">Objection:</strong> Object to our processing of your personal data</li>
            <li><strong className="text-foreground">Data Portability:</strong> Request transfer of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
          <p className="leading-relaxed">
            Our service is not directed to individuals under the age of 13. We do not knowingly 
            collect personal information from children under 13. If you are a parent or guardian 
            and believe your child has provided us with personal data, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">9. Data Retention</h2>
          <p className="leading-relaxed">
            Since most data is stored locally in your browser, you have full control over its 
            retention. You can clear your watch history and preferences at any time through your 
            browser settings. Any data we process is retained only as long as necessary to provide 
            our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">10. International Data Transfers</h2>
          <p className="leading-relaxed">
            Your information may be transferred to and maintained on computers located outside of 
            your state, province, country, or other governmental jurisdiction where data protection 
            laws may differ from those in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">11. Changes to This Privacy Policy</h2>
          <p className="leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">12. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us through our 
            social media channels listed in the footer.
          </p>
        </section>

        <section className="bg-accent/20 p-4 rounded-lg mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">Summary</h2>
          <p className="leading-relaxed">
            <strong className="text-foreground">Your privacy matters:</strong> We collect minimal data, 
            store most information locally on your device, and do not sell your data to third parties. 
            You have full control over your watch history and preferences.
          </p>
        </section>
      </div>
    </div>
  );
}
