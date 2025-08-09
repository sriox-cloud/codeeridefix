import Link from 'next/link';

export default function TermsOfServicePage() {
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
                        TERMS OF SERVICE
                    </h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Codeer ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="mb-4">
                            Codeer is a free online compiler and code editor that allows users to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Write, edit, and execute code in 50+ programming languages</li>
                            <li>Save and manage code files through GitHub integration</li>
                            <li>Access programming tools and utilities</li>
                            <li>Share and collaborate on coding projects</li>
                            <li>Practice coding and solve programming challenges</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts and Authentication</h2>
                        <p className="mb-4">
                            To access certain features of the Service, you must create an account using GitHub OAuth. By creating an account, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use Policy</h2>
                        <p className="mb-4">You agree not to use the Service to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Execute malicious code or attempt to harm our systems or other users</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on intellectual property rights of others</li>
                            <li>Distribute spam, viruses, or other harmful content</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Use the service for cryptocurrency mining or similar resource-intensive activities</li>
                            <li>Upload or execute code that violates GitHub's Terms of Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Content and Intellectual Property</h2>
                        <p className="mb-4">
                            You retain ownership of the code and content you create using our Service. However, by using the Service, you grant us:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>A non-exclusive license to host, store, and display your content as necessary to provide the Service</li>
                            <li>The right to use anonymized, aggregated data for service improvement</li>
                            <li>The right to remove content that violates these terms</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Privacy and Data Protection</h2>
                        <p>
                            Your privacy is important to us. Please review our <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>, which explains how we collect, use, and protect your information when you use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Service Availability and Limitations</h2>
                        <p className="mb-4">
                            We strive to provide reliable service, but we do not guarantee:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>100% uptime or availability</li>
                            <li>Compatibility with all code or programming practices</li>
                            <li>Unlimited resource usage or execution time</li>
                            <li>Data backup or recovery services</li>
                        </ul>
                        <p className="mt-4">
                            We reserve the right to impose reasonable limits on resource usage, including execution time, memory usage, and API requests.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Advertising and Third-Party Services</h2>
                        <p className="mb-4">
                            Our Service may display advertisements through Google AdSense and integrate with third-party services such as:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>GitHub for authentication and repository management</li>
                            <li>Judge0 API for code compilation and execution</li>
                            <li>Google AdSense for displaying relevant advertisements</li>
                        </ul>
                        <p className="mt-4">
                            We are not responsible for the content, privacy practices, or terms of service of these third-party providers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Disclaimer of Warranties</h2>
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODEER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Termination</h2>
                        <p className="mb-4">
                            We may terminate or suspend your access to the Service at any time, with or without cause or notice, for conduct that we believe:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Violates these Terms of Service</li>
                            <li>Is harmful to other users or our Service</li>
                            <li>Violates applicable laws or regulations</li>
                        </ul>
                        <p className="mt-4">
                            You may terminate your account at any time by discontinuing use of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms of Service at any time. Material changes will be notified through the Service or via email. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
                        <p>
                            These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Information</h2>
                        <p className="mb-4">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Email: legal@codeer.org</li>
                            <li>Website: <Link href="/" className="text-blue-400 hover:text-blue-300">https://codeer.org</Link></li>
                        </ul>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-400">
                        © 2025 Codeer. All rights reserved. |
                        <Link href="/privacy" className="text-blue-400 hover:text-blue-300 ml-2">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export const metadata = {
    title: "Terms of Service - Codeer",
    description: "Codeer's Terms of Service - Read our terms and conditions for using our online compiler and code editor service.",
    robots: "index, follow"
};
