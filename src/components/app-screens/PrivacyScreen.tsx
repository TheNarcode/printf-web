"use client";
import React from "react";
import { useTheme } from "../../theme/ThemeContext";
import Header from "../Header";
import { useAppNav } from "../../app/dashboard/layout";

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const { pop } = useAppNav();
  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      <Header title="Privacy Policy" showBack onBack={pop} />
      <main className="flex-1 overflow-y-auto">
        <div
          className="max-w-2xl mx-auto px-6 pt-8 pb-6"
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: privacyHTML }}
        />
      </main>
    </div>
  );
}

const privacyHTML = `
<h1 style="font-size:1.4rem;font-weight:800;margin-bottom:0.5rem">Privacy Policy</h1>
<p>Last updated: June 28, 2026</p>
<p>This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use the Shree Printer and Xerox (printf) service and tells you about your privacy rights and how the law protects you.</p>
<h2>Information We Collect</h2>
<p>We collect the following information when you sign in with Google:</p>
<ul>
  <li><strong>Name</strong> — to personalize your dashboard</li>
  <li><strong>Email address</strong> — for order receipts and account identification</li>
  <li><strong>Profile photo</strong> — displayed in the app</li>
</ul>
<p>We do <strong>not</strong> access your Google Drive, contacts, calendar, or any other Google services.</p>
<h2>Documents You Upload</h2>
<p>Files you upload for printing are transmitted over an encrypted connection (HTTPS) and are used solely to fulfill your print order. Documents are deleted from our systems after printing is complete. We do not read, analyse, or share your documents.</p>
<h2>Payment Information</h2>
<p>Payments are processed by <strong>Razorpay</strong>. Shree Printer and Xerox does not store any payment card details. See <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Razorpay's Privacy Policy</a> for details on how they handle your payment data.</p>
<h2>How We Use Your Information</h2>
<ul>
  <li>To authenticate your account via Google Sign-In</li>
  <li>To display your name and photo in the app</li>
  <li>To send order confirmations to your email</li>
  <li>To associate your print orders with your account</li>
</ul>
<h2>Data Sharing</h2>
<p>We do not sell, trade, or rent your personal information to third parties. We share data only as required to operate the service (e.g., with Razorpay for payment processing).</p>
<h2>Data Retention</h2>
<p>Your account information is retained for as long as you use the service. You may request deletion of your data at any time by contacting us through the app.</p>
<h2>Security</h2>
<p>We implement industry-standard security measures including HTTPS encryption for all data in transit. We take reasonable steps to protect your information from unauthorised access.</p>
<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this policy.</p>
<h2>Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us through the app.</p>
`;
