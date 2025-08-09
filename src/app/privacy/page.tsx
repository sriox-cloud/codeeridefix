import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-gugi)' }}>
                        PRIVACY POLICY
                    </h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            Codeer collects information to provide better services to our users. We collect information in the following ways:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Account Information:</strong> When you create an account via GitHub OAuth, we collect your GitHub username, email address, and profile information.</li>
                            <li><strong>Usage Data:</strong> We collect information about how you use our compiler, including code execution patterns, language preferences, and feature usage.</li>
                            <li><strong>Technical Data:</strong> We automatically collect IP addresses, browser type, device information, and other technical data for service improvement and security.</li>
                            <li><strong>Cookies and Local Storage:</strong> We use cookies and local storage to enhance your experience and remember your preferences.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the collected information for:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Providing and maintaining our online compiler service</li>
                            <li>Authenticating users and securing accounts</li>
                            <li>Improving our service quality and user experience</li>
                            <li>Analyzing usage patterns and service performance</li>
                            <li>Communicating with users about service updates</li>
                            <li>Displaying relevant advertisements through Google AdSense</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Google AdSense and Advertising</h2>
                        <p className="mb-4">
                            Codeer uses Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Third-party vendors, including Google, use cookies to serve ads based on user's prior visits to our website</li>
                            <li>Google's use of advertising cookies enables it and its partners to serve ads based on visits to our site and/or other sites on the Internet</li>
                            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                        <p className="mb-4">
                            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Encryption of data in transit using HTTPS</li>
                            <li>Secure authentication through GitHub OAuth</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to personal data by authorized personnel only</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Disclosure</h2>
                        <p className="mb-4">
                            We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>With your explicit consent</li>
                            <li>To comply with legal obligations or law enforcement requests</li>
                            <li>To protect our rights, property, or safety, or that of our users</li>
                            <li>With service providers who assist in operating our website (subject to confidentiality agreements)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
                        <p className="mb-4">You have the following rights regarding your personal information:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Access:</strong> You can request access to your personal data</li>
                            <li><strong>Correction:</strong> You can request correction of inaccurate data</li>
                            <li><strong>Deletion:</strong> You can request deletion of your account and associated data</li>
                            <li><strong>Portability:</strong> You can request export of your data</li>
                            <li><strong>Opt-out:</strong> You can opt out of certain data collection and processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Children's Privacy</h2>
                        <p>
                            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have it removed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our service after such modifications constitutes acceptance of the updated Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Email: privacy@codeer.org</li>
                            <li>Website: <Link href="/" className="text-blue-400 hover:text-blue-300">https://codeer.org</Link></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. International Users</h2>
                        <p>
                            If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located. By using our service, you consent to such transfer, storage, and processing.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-400">
                        © 2025 Codeer. All rights reserved. |
                        <Link href="/terms" className="text-blue-400 hover:text-blue-300 ml-2">Terms of Service</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export const metadata = {
    title: "Privacy Policy - Codeer",
    description: "Codeer's Privacy Policy - Learn how we collect, use, and protect your personal information when using our online compiler service.",
    robots: "index, follow"
};
