"use client";
import React from "react";
import { useTheme } from "../../theme/ThemeContext";
import Header from "../Header";
import { useAppNav } from "../../app/dashboard/layout";

export default function TermsScreen() {
  const { colors } = useTheme();
  const { pop } = useAppNav();
  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      <Header title="Terms of Usage" showBack onBack={pop} />
      <main className="flex-1 overflow-y-auto">
        <div
          className="max-w-2xl mx-auto px-6 pt-8 pb-6 prose prose-sm dark:prose-invert"
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: termsHTML }}
        />
      </main>
    </div>
  );
}

const termsHTML = `
<h1 style="font-size:1.4rem;font-weight:800;margin-bottom:0.5rem">Terms &amp; Conditions</h1>
<p>Last updated: June 28, 2026</p>
<p>Please read these Terms and Conditions carefully before using the Shree Printer and Xerox (printf) application.</p>
<h2>Agreement to Terms</h2>
<p>By accessing or using Shree Printer and Xerox, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
<h2>Use of Service</h2>
<p>Shree Printer and Xerox provides a document printing service. By uploading files and placing print orders, you confirm that you have the right to print the content and that it does not violate any applicable laws or third-party rights.</p>
<h2>User Accounts</h2>
<p>Access to Shree Printer and Xerox is provided through Google Sign-In. You are responsible for maintaining the security of your Google account and for all activities that occur under your account.</p>
<h2>Payments</h2>
<p>All payments are processed securely through Razorpay. Shree Printer and Xerox does not store your payment card details. Orders are confirmed only after successful payment.</p>
<h2>Document Handling</h2>
<p>Uploaded documents are used solely for fulfilling your print order and are deleted after printing is complete. We do not read, distribute, or retain your documents beyond what is necessary to process your order.</p>
<h2>Limitation of Liability</h2>
<p>Shree Printer and Xerox is provided on an "as is" basis. We are not liable for any indirect, incidental, or consequential damages arising out of your use of the service.</p>
<h2>Changes to Terms</h2>
<p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
<h2>Contact</h2>
<p>For any questions regarding these Terms, please contact us through the app.</p>
`;
