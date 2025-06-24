
'use client';

import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 20, 2024";

  return (
    <div className="space-y-12">
      <SectionTitle
        title="Privacy Policy"
        subtitle={`Last Updated: ${lastUpdated}`}
      />
      <Card className="max-w-4xl mx-auto shadow-lg bg-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldAlert className="mr-3 h-7 w-7 text-primary" />
            Our Commitment to Your Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground/80 prose prose-sm md:prose-base dark:prose-invert prose-headings:text-primary prose-a:text-accent max-w-none">
          
          <section>
            <h3>1. Introduction</h3>
            <p>
              Welcome to Pixar Educational Consultancy ("we," "our," "us"). We are committed to protecting your privacy and handling your personal information with transparency and care. This Privacy Policy outlines how we collect, use, share, and protect your information when you visit our website (www.pixaredu.com), use our services, or interact with our tools like the Pathway Planner and Document Checklist.
            </p>
            <p>
              By using our website and services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h3>2. Information We Collect</h3>
            <p>
              We collect information to provide and improve our services to you. The types of information we collect are:
            </p>
            <ul>
              <li>
                <strong>Personal Identification Information:</strong> When you use our contact forms or booking forms, we may ask you for your full name, email address, and phone number.
              </li>
              <li>
                <strong>Academic and Aspirational Information:</strong> To provide you with educational guidance, we collect information such as your last completed education level, English proficiency test status, preferred study destination, intended course of study, and GPA/academic standing through our various forms and AI-powered tools.
              </li>
              <li>
                <strong>Usage Data (Analytics):</strong> We automatically collect information about how you access and use our website. This may include your IP address, browser type, device type, pages visited, and time spent on pages. This data is collected through services like Firebase Analytics.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </li>
            </ul>
          </section>

          <section>
            <h3>3. How We Use Your Information</h3>
            <p>
              Your information is used for the following purposes:
            </p>
            <ul>
              <li>
                <strong>To Provide Services:</strong> To respond to your inquiries, book appointments, and provide personalized educational counseling and application assistance.
              </li>
              <li>
                <strong>To Power Our AI Tools:</strong> Information you input into tools like the Pathway Planner is sent to our AI service provider (Google's Vertex AI) to generate personalized university suggestions. The data is used solely to provide the result for your query.
              </li>
              <li>
                <strong>To Improve Our Website:</strong> We use analytics data to understand how our website is used and to improve its functionality and user experience.
              </li>
              <li>
                <strong>To Communicate With You:</strong> To send you information about our services, updates, or respond to your requests.
              </li>
            </ul>
          </section>

          <section>
            <h3>4. How We Share and Store Your Information</h3>
            <p>
              We do not sell your personal data. We may share your information with third parties only in the following ways:
            </p>
            <ul>
              <li>
                <strong>Third-Party Service Providers:</strong> We use third-party services to operate our website and provide our services.
                <ul>
                  <li><strong>Google (Vertex AI & Google Forms):</strong> User inputs for our AI tools are processed by Google's Vertex AI. Our contact forms are integrated with Google Forms for data collection and management. Your information is subject to Google's Privacy Policy.</li>
                  <li><strong>Firebase:</strong> We use Firebase (a Google service) for website analytics and performance monitoring.</li>
                </ul>
              </li>
              <li>
                <strong>Educational Institutions:</strong> With your explicit consent, we will share your personal and academic information with universities and colleges as part of the application process.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </li>
            </ul>
            <p>
              Your information is stored on secure servers managed by our third-party providers (e.g., Google Cloud). We take reasonable steps to protect your data, but no method of transmission over the Internet is 100% secure.
            </p>
          </section>
          
          <section>
            <h3>5. Your Data Rights</h3>
            <p>
              You have rights regarding your personal information. You have the right to:
            </p>
            <ul>
              <li><strong>Access:</strong> Request copies of your personal data that we hold.</li>
              <li><strong>Correction:</strong> Request that we correct any information you believe is inaccurate.</li>
              <li><strong>Deletion:</strong> Request that we delete your personal data, under certain conditions.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at <a href="mailto:info@pixaredu.com">info@pixaredu.com</a>.
            </p>
          </section>

          <section>
            <h3>6. Third-Party Links</h3>
            <p>
              Our website contains links to other websites (e.g., universities, official government sites) that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </section>

          <section>
            <h3>7. Children's Privacy</h3>
            <p>
              Our services are not intended for use by children under the age of 16. We do not knowingly collect personally identifiable information from children under 16. If we become aware that we have collected personal data from a child without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </section>

          <section>
            <h3>8. Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h3>9. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please do not hesitate to contact us:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:info@pixaredu.com">info@pixaredu.com</a><br/>
              <strong>Address:</strong> New Baneshwor, Kathmandu, Nepal, 44600
            </p>
            <div className="pt-4 text-center">
              <Button asChild>
                <Link href="/contact">Contact Page</Link>
              </Button>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
