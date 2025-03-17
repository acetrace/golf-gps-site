
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="antialiased">
      <NavBar />
      <main className="pt-32 pb-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Golf GPS - Ace Trace mobile application and website, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
            <p>
              Permission is granted to download and use the Golf GPS - Ace Trace mobile application on your personal mobile devices subject to the following conditions:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>The app is licensed, not sold, to you for use strictly in accordance with the terms of this agreement.</li>
              <li>You shall not modify, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, 
                transfer, or sell any information, software, products or services obtained from the app.</li>
              <li>You shall not use the app in a manner that exceeds reasonable use.</li>
              <li>Your license to use the app is subject to your compliance with these Terms of Service.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Content</h2>
            <p>
              Our app may allow you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. 
              You are responsible for the content that you post, including its legality, reliability, and appropriateness.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Accuracy of Information</h2>
            <p>
              While we strive to provide accurate GPS data and golf course information, we cannot guarantee the accuracy, completeness, or 
              reliability of any content or data within the app. You acknowledge that any reliance on such material is at your own risk.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Subscription and Billing</h2>
            <p>
              Some features of our app may require a subscription. By subscribing, you agree to pay the subscription fees as they become due. 
              Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. 
              You can manage subscriptions through your app store account settings.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclaimer</h2>
            <p>
              The app and all content is provided on an "as is" and "as available" basis without warranties of any kind. 
              We do not warrant that the app will be uninterrupted or error-free, that defects will be corrected, 
              or that the app is free of viruses or other harmful components.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              In no event shall Golf GPS - Ace Trace, its officers, directors, employees, or agents, be liable for any indirect, 
              incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, 
              use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or 
              use the app.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              We will provide notice of any changes by posting the new Terms on this page. 
              Your continued use of the app after any such changes constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@golfgps-acetrace.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
