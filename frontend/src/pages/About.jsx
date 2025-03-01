import Navbar from "./Navbar"
import Footer from "./Footer"

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <Navbar />
            
            {/* Hero Section */}
            <div className="pt-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="relative group mb-20">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative bg-gray-900/80 p-8 rounded-xl">
                            <img 
                                src="https://images.squarespace-cdn.com/content/v1/64415617801599406d587238/903ad8c7-1c5b-415f-a881-d4d80350ed71/9.png?format=1500w" 
                                alt="Digital Time Capsule" 
                                className="w-full max-w-3xl mx-auto h-auto object-contain rounded-lg shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Who is Digital Time Capsule Section */}
                    <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto mb-16 p-8 bg-gray-900/50 rounded-xl backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 font-sans mb-6">
                                Who is Digital Time Capsule?
                            </h2>
                        </div>
                        <div className="md:w-2/3">
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans">
                                Virtual Time Capsule (VTC) is a platform that allows you to send written messages, voice recordings, pictures, and videos to the future. The platform was born out of founder Rob Glaser's personal journey, where he recognized the importance of capturing and sharing stories, wisdom, and memories that often fade with time.
                            </p>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans mt-6">
                                After the sudden loss of his grandfather, Rob realized that photos and stories alone couldn't fully capture the essence of a person's life, inspiring him to create a better way to preserve these priceless memories for future generations.
                            </p>
                        </div>
                    </div>

                    {/* What is Digital Time Capsule Section */}
                    <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto p-8 bg-gray-900/50 rounded-xl backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 font-sans mb-6">
                                What is Digital Time Capsule?
                            </h2>
                        </div>
                        <div className="md:w-2/3 space-y-6">
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans">
                                Virtual Time Capsule is your chance to create a priceless, lasting legacy for your children, your family, and future generations. It's like building a bridge between today's precious moments and tomorrow's milestones.
                            </p>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans">
                                Imagine capturing your child's first giggle, their messy art projects, or the way they light up during their school plays—and having those memories delivered to them when they turn 18, get married, or become parents themselves.
                            </p>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans">
                                Picture preserving your parents' incredible life stories—their wisdom, love, and the moments that shaped your family—so that your kids and grandkids can always feel connected to them.
                            </p>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans">
                                This isn't just about memories—it's about making the most meaningful moments last. It's about creating a treasure chest filled with your family's love, history, and togetherness, delivered at the perfect time in the future.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for Footer */}
            <div className="h-20"></div>
            
            <Footer />
        </div>
    )
}