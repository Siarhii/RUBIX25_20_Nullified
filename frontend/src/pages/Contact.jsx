import Navbar from "./Navbar"
import Footer from "./Footer"

function Contact() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                <Navbar />
                
                <div className="pt-24 pb-16">
                    {/* Hero Section with Image and Contact Info Side by Side */}
                    <div className="container mx-auto px-4 mb-16">
                        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                            {/* Left side - Image */}
                            <div className="w-full md:w-1/2">
                                <img 
                                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2940&auto=format&fit=crop"
                                    alt="Contact Support Illustration" 
                                    className="rounded-lg shadow-lg object-cover w-full h-[400px]"
                                />
                            </div>

                            {/* Right side - Contact Information */}
                            <div className="w-full md:w-1/2 text-left space-y-8">
                                <h1 className="text-4xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
                                    Contact Information
                                </h1>
                                
                                {/* Email */}
                                <div className="transform hover:translate-x-2 transition-all duration-300">
                                    <a href="mailto:digitaltimecapsule1122@gmail.com" 
                                       className="text-white hover:text-blue-400 text-xl font-sans inline-flex items-center space-x-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        <span>digitaltimecapsule1122@gmail.com</span>
                                    </a>
                                </div>
                                
                                {/* Phone */}
                                <div className="transform hover:translate-x-2 transition-all duration-300">
                                    <p className="text-white text-xl font-sans inline-flex items-center space-x-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                        <span>+91-9876543210</span>
                                    </p>
                                </div>

                                {/* Additional Contact Description */}
                                <p className="text-gray-300 text-lg font-sans leading-relaxed">
                                    Have questions or need assistance? Our support team is here to help you with any inquiries about your digital time capsule.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Support Section - Centered Below */}
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold text-center font-sans text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-8">
                                Support
                            </h2>
                            
                            <div className="space-y-4">
                                {/* Terms and Conditions details */}
                                <details className="group bg-gray-900/50 p-4 rounded-lg shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                                    <summary className="cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-300 font-sans flex items-center">
                                        <svg className="w-5 h-5 mr-2 transform group-open:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                        Terms and Conditions
                                    </summary>
                                    <div className="mt-4 text-sm text-gray-300 space-y-4 font-sans">
                                        <p><strong>Welcome to Virtual Time Capsule (“VTC”).</strong> By accessing or using the application, you agree to be bound by the following terms and conditions:</p>
                                        
                                        <h3 className="font-semibold">Purpose</h3>
                                        <p>VTC is intended for entertainment purposes. The purpose of the application is to send messages into the future to elicit a positive feeling or emotion. It is not meant to be used for legal, business, or professional purposes. Users are expected to engage with the application in a manner consistent with its entertainment nature.</p>
                                        
                                        <h3 className="font-semibold">Data Protection</h3>
                                        <p>We are committed to safeguarding your data. We will make every attempt to protect the data you share with us. However, due to the nature of entertainment-focused applications, we do not provide any guarantee regarding data security or confidentiality.</p>
                                        
                                        <h3 className="font-semibold">Non-Sale of Information</h3>
                                        <p>We will not sell, trade, or otherwise transfer your personal or usage information to third parties. Your information will only be used for VTC to communicate with you and others you specify.</p>
                                        
                                        <h3 className="font-semibold">User Responsibility</h3>
                                        <p>You are responsible for maintaining the security of your account credentials and for any actions taken using your account. Do not share your account details with others. Any activities conducted through your account are your responsibility.</p>
                                        
                                        <h3 className="font-semibold">Prohibited Activities</h3>
                                        <p>Users are prohibited from using the application for any illegal, unethical, or immoral purposes. This includes but is not limited to using the application for any fraudulent, harmful, or unauthorized activities. If your time capsule is going to offend or upset someone, please do not send it.</p>
                                        
                                        <h3 className="font-semibold">Intellectual Property</h3>
                                        <p>All content, trademarks, and intellectual property associated with the application are the property of Virtual Time Capsule LLC and are protected by applicable copyright and trademark laws. Users may not reproduce, modify, distribute, or use any part of the application without prior written consent.</p>
                                        
                                        <h3 className="font-semibold">Changes to Terms and Conditions</h3>
                                        <p>These terms and conditions may be updated or modified from time to time. Users are encouraged to periodically review these terms for any changes. Your continued use of the application after such modifications will constitute your acceptance of the revised terms.</p>
                                        
                                        <h3 className="font-semibold">Termination</h3>
                                        <p>We reserve the right to terminate or suspend your access to the application at our discretion, without notice, if you violate these terms and conditions or engage in inappropriate or unauthorized use.</p>
                                        
                                        <h3 className="font-semibold">No Warranty</h3>
                                        <p>We provide the application on an "as is" and "as available" basis. We do not make any warranties, express or implied, regarding the functionality, accuracy, or availability of the application. Users access and use the application at their own risk.</p>
                                        
                                        <h3 className="font-semibold">Governing Law</h3>
                                        <p>These terms and conditions are governed by and construed in accordance with the laws of Illinois.</p>
                                        
                                        <p>By using this application, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you do not agree with any part of these terms, please refrain from using the application.</p>
                                        
                                        <p>If you have any questions or concerns, please contact us at info@tryvtc.com.</p>
                                    </div>
                                </details>

                                {/* Privacy Policy details - similar styling */}
                                <details className="group bg-gray-900/50 p-4 rounded-lg shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                                    <summary className="cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-300 font-sans flex items-center">
                                        <svg className="w-5 h-5 mr-2 transform group-open:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                        Privacy Policy
                                    </summary>
                                    <div className="mt-4 text-sm text-gray-300 space-y-4 font-sans">
                                        <p><strong>Virtual Time Capsule LLC ("we," "us," or "our")</strong> is committed to protecting the privacy of our users. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of personal information when users access or use our mobile application ("the App").</p>

                                        <p>By using the App, you agree to the terms of this Privacy Policy.</p>

                                        <h3 className="font-semibold text-lg mt-6">Information We Collect</h3>

                                        <div className="ml-4 space-y-4">
                                            <div>
                                                <h4 className="font-semibold">1. Google Sign-In Information:</h4>
                                                <p className="mt-2">When you log into our App using Google Sign-In, we collect the following information:</p>
                                                <ul className="list-disc ml-6 mt-2">
                                                    <li>Your Google email address</li>
                                                    <li>Your Google user ID</li>
                                                    <li>Basic profile information provided by Google (e.g., name, profile picture)</li>
                                                </ul>
                                                <p className="mt-2">We use this information solely for the purpose of authenticating your identity and facilitating your access to our App.</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold">2. Usage Information:</h4>
                                                <p className="mt-2">We may collect information about how you interact with the App, such as your usage patterns, preferences, and interactions with features.</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold">3. How We Use Your Information</h4>
                                                <p className="mt-2">We use the collected information for the following purposes:</p>
                                                <ul className="list-disc ml-6 mt-2">
                                                    <li><strong>Authentication:</strong> To verify your identity and facilitate your access to the App.</li>
                                                    <li><strong>Improvement of Services:</strong> To analyze usage patterns and improve the functionality and user experience of the App.</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold">4. Information Sharing</h4>
                                                <p className="mt-2">We do not share your personal information with third parties. Your information is used solely for the purposes outlined in this Privacy Policy.</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold">5. Security</h4>
                                                <p className="mt-2">We take reasonable measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is completely secure.</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold">6. Your Choices</h4>
                                                <p className="mt-2">You may choose not to provide certain information, but this may limit your ability to use certain features of the App.</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold">7. Changes to this Privacy Policy</h4>
                                                <p className="mt-2">We reserve the right to update this Privacy Policy. Any changes will be effective immediately upon posting the revised Privacy Policy on the App.</p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <p>Please feel free to contact us anytime if you have any questions or concerns about this Privacy Policy: <a href="mailto:hello@tryvtc.com" className="text-blue-600 hover:text-blue-800">hello@tryvtc.com</a></p>
                                        </div>

                                        <p className="mt-4 text-sm text-gray-500">Last Updated: December 28, 2023</p>
                                    </div>
                                </details>

                                {/* FAQs details - similar styling */}
                                <details className="group bg-gray-900/50 p-4 rounded-lg shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                                    <summary className="cursor-pointer text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-300 font-sans flex items-center">
                                        <svg className="w-5 h-5 mr-2 transform group-open:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                        FAQs
                                    </summary>
                                    <div className="mt-4 text-sm text-gray-300 space-y-4 font-sans">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="font-semibold">What is a Virtual Time Capsule?</h3>
                                                <p className="mt-2">VTC is a platform that allows you to send messages and memories to anyone at a later date in the future, preserving your stories, and creating a nice nostalgic gift for the future recipient.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">How do I VTC?</h3>
                                                <p className="mt-2 font-medium">Step-by-Step Instructions:</p>
                                                <ol className="list-decimal ml-6 mt-2 space-y-4">
                                                    <li>
                                                        <p className="font-medium">Sign In / Create Account</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>Click "Sign In" or "Create Account" on the homepage.</li>
                                                            <li>Enter your email and password or SSO with your google account</li>
                                                            <li>Get double authentication code in email</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Pick Your Themes or Categories</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>After logging in, choose the themes that resonate with you (e.g., Family, Legacy, Birthdays, etc.).</li>
                                                            <li>Select up to 3 categories from the list. You can choose things like "New Parent," "Dear Future Me," "Leaving a Legacy", "Students", "Future Birthdays, Celebrations, Holidays, Weddings", all the way to "Unique life questions and philosophy".</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Select Prompts</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>Browse the top 10 prompts from your chosen category.</li>
                                                            <li>Use filters or hashtags (e.g., #Advice, #Holidays, #Memories) to narrow down the options.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Upload Your Content</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>Upload photos/videos from your device (you'll see a progress bar showing your remaining storage).</li>
                                                            <li>Record videos or write text directly on the platform.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Invite Collaborators</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>Invite friends or family to contribute to specific prompts.</li>
                                                            <li>Send them an invitation via email with edit permissions.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Review & Customize</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>Rearrange content.</li>
                                                            <li>Add a personalized cover or intro message.</li>
                                                            <li>Make last-minute edits or adjustments.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Finalize Your Capsule</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>Choose your capsule delivery date.</li>
                                                            <li>Review everything before confirming.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Complete Payment</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>Enter your payment details to complete the process.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Submit Your Capsule</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>You'll receive a confirmation email, and a reminder email will be sent to you one month before the delivery date.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <p className="font-medium">Manage Your Capsule</p>
                                                        <ul className="list-disc ml-6 mt-1">
                                                            <li>You can return at any time to edit, update, or cancel your capsule.</li>
                                                            <li>Look out for monthly community emails and quarterly reminders to update your contact details.</li>
                                                        </ul>
                                                    </li>
                                                </ol>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">Can I send a message or memory to someone in the future?</h3>
                                                <p className="mt-2">Yes! Our platform allows you to schedule the delivery of specific photos, videos, or personal messages to a person at a future date. Whether it's for a milestone birthday, wedding, or special anniversary, your memories will reach your loved ones exactly when you want.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">How safe are my family photos and videos?</h3>
                                                <p className="mt-2">We take privacy and security very seriously. All your memories are encrypted both in transit and at rest, ensuring no one but you can access them. We use top-tier security measures to protect your data from breaches.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">What makes this platform different from Google Photos or iCloud?</h3>
                                                <p className="mt-2">While other platforms focus on simple storage, we focus on preserving memories for future delivery. Our platform helps you create meaningful storylines from your memories, and our time capsule feature allows you to send memories at specific future dates. We also offer advanced privacy options and personalized legacy planning.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">Will I always have access to my memories?</h3>
                                                <p className="mt-2">Yes, you will always have access as long as you maintain your account. We provide reliable cloud storage with continuous backups, so your memories will be safe for years to come. Even if something happens to us as a company, we have safeguards in place to ensure you can always retrieve your data.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">What happens to my memories if I pass away?</h3>
                                                <p className="mt-2">We offer features where you can designate a trusted contact to manage your account after your passing. This ensures your memories are safely passed on to your loved ones, as per your wishes.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">Can I change or cancel my plan?</h3>
                                                <p className="mt-2">Of course! You can adjust your plan or cancel at any time. We offer flexible options to meet your needs as they change over time.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">What types of memories can I include in a Virtual Time Capsule for my family?</h3>
                                                <p className="mt-2">You can include photos, videos, audio recordings, written messages, scanned documents, and more. Popular ideas include first steps, letters to children, family traditions, and shared advice.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">Can multiple family members contribute to a single time capsule?</h3>
                                                <p className="mt-2">Yes! Invite family members to contribute their own photos, messages, or videos to create a collective time capsule filled with diverse perspectives and memories.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">Will my photos be used for advertising or sold to third parties?</h3>
                                                <p className="mt-2">No. We respect your privacy, and your data is yours alone. We do not use your photos for advertising, and we never sell your information to third parties.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">What happens if I forget my password?</h3>
                                                <p className="mt-2">If you forget your password, you can easily reset it by clicking on the "forgot password" link on the login page.</p>
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    )
}

export default Contact