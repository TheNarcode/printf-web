import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - printf',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <header className="px-6 py-8 max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] font-bold tracking-tight uppercase transition-opacity hover:opacity-50"
          style={{ color: 'var(--color-text)' }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Home
        </Link>
        <span className="text-[16px] font-black tracking-[-0.04em] uppercase">printf</span>
      </header>

      <main className="px-6 py-20 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1] mb-12" style={{ color: 'var(--color-text)' }}>
          Privacy Policy
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none" style={{ color: 'var(--color-text-secondary)' }}>
          <p className="text-sm font-mono tracking-widest uppercase mb-12 opacity-60">Last updated: June 28, 2026</p>
          
          <p className="text-xl font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          <p className="text-xl font-medium leading-relaxed mb-12" style={{ color: 'var(--color-text)' }}>
            We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
          </p>

          <h2 className="text-3xl font-bold tracking-tight mt-16 mb-8" style={{ color: 'var(--color-text)' }}>Interpretation and Definitions</h2>
          
          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Interpretation</h3>
          <p className="mb-6 text-[17px] leading-relaxed">The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          
          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Definitions</h3>
          <p className="mb-6 text-[17px] leading-relaxed">For the purposes of this Privacy Policy:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-4">
            <li><strong style={{ color: 'var(--color-text)' }}>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Application</strong> refers to printf, the software program provided by the Company.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Privacy Policy) refers to printf.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Country</strong> refers to: Maharashtra, India</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Personal Data</strong> (or &quot;Personal Information&quot;) is any information that relates to an identified or identifiable individual. We use &quot;Personal Data&quot; and &quot;Personal Information&quot; interchangeably unless a law uses a specific term.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Service</strong> refers to the Application or the Website or both.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Website</strong> refers to printf, accessible from <a href="https://print-f.top" rel="external nofollow noopener" target="_blank" style={{ color: 'var(--color-text)', textDecoration: 'underline' }}>https://print-f.top</a>.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
          </ul>

          <h2 className="text-3xl font-bold tracking-tight mt-16 mb-8" style={{ color: 'var(--color-text)' }}>Collecting and Using Your Personal Data</h2>
          
          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Types of Data Collected</h3>
          
          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Personal Data</h4>
          <p className="mb-4 text-[17px] leading-relaxed">While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-2">
            <li>Email address</li>
            <li>First name and last name</li>
          </ul>

          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Payment Information</h4>
          <p className="mb-4 text-[17px] leading-relaxed">We use third-party services for payment processing. We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council.</p>
          <p className="mb-4 text-[17px] leading-relaxed">Our payment processor is <strong style={{ color: 'var(--color-text)' }}>Razorpay</strong>.</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-2">
            <li>Their Privacy Policy can be viewed at <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text)', textDecoration: 'underline' }}>https://razorpay.com/privacy-policy/</a>.</li>
            <li>When You make a payment through Razorpay, they may securely collect additional information such as Your address, mobile number, third-party wallet details, bank account information, card details, and email addresses. We share information with Razorpay only if You consent to sharing it during transactions on Our Service.</li>
            <li>Razorpay handles this information independently to execute payments, detect fraud, and comply with regulatory requirements. Razorpay is an independent Service Provider, and Your data processed by them is subject to their own strict data policies and safeguards.</li>
          </ul>

          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Usage Data</h4>
          <p className="mb-4 text-[17px] leading-relaxed">Usage Data is collected automatically when using the Service.</p>
          <p className="mb-4 text-[17px] leading-relaxed">Usage Data may include information such as Your Device&apos;s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
          <p className="mb-4 text-[17px] leading-relaxed">When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device&apos;s unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
          <p className="mb-8 text-[17px] leading-relaxed">We may also collect information that Your browser sends whenever You visit Our Service or when You access the Service by or through a mobile device.</p>

          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Information Collected while Using the Application</h4>
          <p className="mb-4 text-[17px] leading-relaxed">While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:</p>
          <ul className="mb-4 text-[17px] leading-relaxed list-disc pl-5 space-y-2">
            <li>Pictures and other information from your Device&apos;s camera and photo library</li>
          </ul>
          <p className="mb-4 text-[17px] leading-relaxed">We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company&apos;s servers and/or a Service Provider&apos;s server or it may be simply stored on Your device.</p>
          <p className="mb-8 text-[17px] leading-relaxed">You can enable or disable access to this information at any time, through Your Device settings.</p>

          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Tracking Technologies and Cookies</h4>
          <p className="mb-4 text-[17px] leading-relaxed">We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies We use include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
          <ul className="mb-6 text-[17px] leading-relaxed list-disc pl-5 space-y-4">
            <li><strong style={{ color: 'var(--color-text)' }}>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
          </ul>
          <p className="mb-4 text-[17px] leading-relaxed">Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.</p>
          <p className="mb-4 text-[17px] leading-relaxed">Where required by law, we use non-essential cookies (such as analytics, advertising, and remarketing cookies) only with Your consent. You can withdraw or change Your consent at any time using Our cookie preferences tool (if available) or through Your browser/device settings. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>
          <p className="mb-4 text-[17px] leading-relaxed">We use both Session and Persistent Cookies for the purposes set out below:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-4">
            <li>
              <strong style={{ color: 'var(--color-text)' }}>Necessary / Essential Cookies</strong><br/>
              Type: Session Cookies<br/>
              Administered by: Us<br/>
              Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
            </li>
            <li>
              <strong style={{ color: 'var(--color-text)' }}>Cookies Policy / Notice Acceptance Cookies</strong><br/>
              Type: Persistent Cookies<br/>
              Administered by: Us<br/>
              Purpose: These Cookies identify if users have accepted the use of cookies on the Website.
            </li>
            <li>
              <strong style={{ color: 'var(--color-text)' }}>Functionality Cookies</strong><br/>
              Type: Persistent Cookies<br/>
              Administered by: Us<br/>
              Purpose: These Cookies allow Us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
            </li>
          </ul>
          <p className="mb-8 text-[17px] leading-relaxed">For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of Our Privacy Policy.</p>

          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Use of Your Personal Data</h3>
          <p className="mb-4 text-[17px] leading-relaxed">The Company may use Personal Data for the following purposes:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-4">
            <li><strong style={{ color: 'var(--color-text)' }}>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application&apos;s push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>To provide You</strong> with news, special offers, and general information about other goods, services and events which We offer that are similar to those that you have already purchased or inquired about unless You have opted not to receive such information.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>For business transfers:</strong> We may use Your Personal Data to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
          </ul>

          <p className="mb-4 text-[17px] leading-relaxed">We may share Your Personal Data in the following situations:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-4">
            <li><strong style={{ color: 'var(--color-text)' }}>With Service Providers:</strong> We may share Your Personal Data with Service Providers to monitor and analyze the use of our Service, to contact You.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>For business transfers:</strong> We may share or transfer Your Personal Data in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>With Affiliates:</strong> We may share Your Personal Data with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>With business partners:</strong> We may share Your Personal Data with Our business partners to offer You certain products, services or promotions.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>With other users:</strong> If Our Service offers public areas, when You share Personal Data or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>With Your consent</strong>: We may disclose Your Personal Data for any other purpose with Your consent.</li>
          </ul>

          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Retention of Your Personal Data</h3>
          <p className="mb-4 text-[17px] leading-relaxed">The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if We are required to retain Your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
          <p className="mb-4 text-[17px] leading-relaxed">Where possible, We apply shorter retention periods and/or reduce identifiability by deleting, aggregating, or anonymizing data. Unless otherwise stated, the retention periods below are maximum periods (&quot;up to&quot;) and We may delete or anonymize data sooner when it is no longer needed for the relevant purpose. We apply different retention periods to different categories of Personal Data based on the purpose of processing and legal obligations:</p>
          <ul className="mb-4 text-[17px] leading-relaxed list-disc pl-5 space-y-4">
            <li>
              Account Information
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>User Accounts: retained for the duration of your account relationship plus up to 24 months after account closure to handle any post-termination issues or resolve disputes.</li>
              </ul>
            </li>
            <li>
              Customer Support Data
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Support tickets and correspondence: up to 24 months from the date of ticket closure to resolve follow-up inquiries, track service quality, and defend against potential legal claims</li>
                <li>Chat transcripts: up to 24 months for quality assurance and staff training purposes.</li>
              </ul>
            </li>
            <li>
              Usage Data
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Website analytics data (cookies, IP addresses, device identifiers): up to 24 months from the date of collection, which allows us to analyze trends while respecting privacy principles.</li>
                <li>Application usage statistics: up to 24 months to understand feature adoption and service improvements.</li>
                <li>Server logs (IP addresses, access times): up to 24 months for security monitoring and troubleshooting purposes.</li>
              </ul>
            </li>
          </ul>
          <p className="mb-4 text-[17px] leading-relaxed">Usage Data is retained in accordance with the retention periods described above, and may be retained longer only where necessary for security, fraud prevention, or legal compliance.</p>
          <p className="mb-4 text-[17px] leading-relaxed">We may retain Personal Data beyond the periods stated above for different reasons:</p>
          <ul className="mb-4 text-[17px] leading-relaxed list-disc pl-5 space-y-2">
            <li>Legal obligation: We are required by law to retain specific data (e.g., financial records for tax authorities).</li>
            <li>Legal claims: Data is necessary to establish, exercise, or defend legal claims.</li>
            <li>Your explicit request: You ask Us to retain specific information.</li>
            <li>Technical limitations: Data exists in backup systems that are scheduled for routine deletion.</li>
          </ul>
          <p className="mb-4 text-[17px] leading-relaxed">You may request information about how long We will retain Your Personal Data by contacting Us.</p>
          <p className="mb-4 text-[17px] leading-relaxed">When retention periods expire, We securely delete or anonymize Personal Data according to the following procedures:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-2">
            <li>Deletion: Personal Data is removed from Our systems and no longer actively processed.</li>
            <li>Backup retention: Residual copies may remain in encrypted backups for a limited period consistent with our backup retention schedule and are not restored except where necessary for security, disaster recovery, or legal compliance.</li>
            <li>Anonymization: In some cases, We convert Personal Data into anonymous statistical data that cannot be linked back to You. This anonymized data may be retained indefinitely for research and analytics.</li>
          </ul>

          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Transfer of Your Personal Data</h3>
          <p className="mb-4 text-[17px] leading-relaxed">Your information, including Personal Data, is processed at the Company&apos;s operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may protection laws may differ from those from Your jurisdiction.</p>
          <p className="mb-8 text-[17px] leading-relaxed">Where required by applicable law, We will ensure that international transfers of Your Personal Data are subject to appropriate safeguards and supplementary measures where appropriate. The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p>

          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Delete Your Personal Data</h3>
          <p className="mb-4 text-[17px] leading-relaxed">You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
          <p className="mb-4 text-[17px] leading-relaxed">Our Service may give You the ability to delete certain information about You from within the Service.</p>
          <p className="mb-4 text-[17px] leading-relaxed">You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any Personal Data that You have provided to Us.</p>
          <p className="mb-8 text-[17px] leading-relaxed">Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</p>

          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Disclosure of Your Personal Data</h3>
          
          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Business Transactions</h4>
          <p className="mb-4 text-[17px] leading-relaxed">If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
          
          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Law enforcement</h4>
          <p className="mb-4 text-[17px] leading-relaxed">Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
          
          <h4 className="text-lg font-bold tracking-tight mt-6 mb-3" style={{ color: 'var(--color-text)' }}>Other legal requirements</h4>
          <p className="mb-4 text-[17px] leading-relaxed">The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-2">
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of the Company</li>
            <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>Protect the personal safety of Users of the Service or the public</li>
            <li>Protect against legal liability</li>
          </ul>

          <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" style={{ color: 'var(--color-text)' }}>Security of Your Personal Data</h3>
          <p className="mb-8 text-[17px] leading-relaxed">The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>

          <h2 className="text-3xl font-bold tracking-tight mt-16 mb-8" style={{ color: 'var(--color-text)' }}>Children&apos;s Privacy</h2>
          <p className="mb-4 text-[17px] leading-relaxed">Our Service does not address anyone under the age of 16. We do not knowingly collect personally identifiable information from anyone under the age of 16. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 16 without verification of parental consent, We take steps to remove that information from Our servers.</p>
          <p className="mb-8 text-[17px] leading-relaxed">If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent&apos;s consent before We collect and use that information.</p>

          <h2 className="text-3xl font-bold tracking-tight mt-16 mb-8" style={{ color: 'var(--color-text)' }}>Links to Other Websites</h2>
          <p className="mb-4 text-[17px] leading-relaxed">Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party&apos;s site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
          <p className="mb-8 text-[17px] leading-relaxed">We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>

          <h2 className="text-3xl font-bold tracking-tight mt-16 mb-8" style={{ color: 'var(--color-text)' }}>Changes to this Privacy Policy</h2>
          <p className="mb-4 text-[17px] leading-relaxed">We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
          <p className="mb-4 text-[17px] leading-relaxed">We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.</p>
          <p className="mb-8 text-[17px] leading-relaxed">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

          <h2 className="text-3xl font-bold tracking-tight mt-16 mb-8" style={{ color: 'var(--color-text)' }}>Contact Us</h2>
          <p className="mb-4 text-[17px] leading-relaxed">If you have any questions about this Privacy Policy, You can contact us:</p>
          <ul className="mb-8 text-[17px] leading-relaxed list-disc pl-5 space-y-2">
            <li>By email: thenarcode@gmail.com</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
