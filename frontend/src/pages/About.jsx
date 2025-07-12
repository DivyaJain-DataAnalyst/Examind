import React from "react";
import { Link } from "react-router-dom";
import {
    BookCheck,
    Users,
    Award,
    Lightbulb,
    ShieldCheck,
    Code,
    Rocket,
    ArrowRight,
    PencilRuler,
    BarChart2,
    Clock,
} from "lucide-react";
import NavbarPublic from "../components/NavbarPublic"; // Assuming NavbarPublic is in ../components

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Public Navbar */}
            <NavbarPublic />

            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-20 pt-32 sm:px-6 lg:px-8">
                {" "}
                {/* Added pt-32 for navbar spacing */}
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="animate-fade-in-up mb-6 text-5xl leading-tight font-extrabold text-gray-900 sm:text-6xl">
                        Empowering Education Through{" "}
                        <br className="hidden sm:inline" />
                        <span className="bg-sky-600 bg-clip-text text-transparent">
                            Seamless Assessments
                        </span>
                    </h1>
                    <p className="animate-fade-in-up mx-auto mb-10 max-w-3xl text-xl text-gray-600 delay-200">
                        Examind simplifies the entire test-taking process, from
                        dynamic creation to insightful grading, for both
                        teachers and students.
                    </p>
                    <div className="animate-fade-in-up flex justify-center space-x-4 delay-400">
                        <Link
                            to="/register"
                            className="inline-flex transform items-center rounded-full border border-transparent bg-gradient-to-r from-sky-700 to-sky-800 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-800"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex transform items-center rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-800 transition-all duration-300 hover:bg-gray-100"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-white px-4 py-16 shadow-inner sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-center">
                    <h2 className="mb-8 text-4xl font-bold text-gray-900">
                        Our Mission
                    </h2>
                    <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-700">
                        At Examind, we believe that effective assessment is
                        crucial for learning and teaching. Our mission is to
                        eliminate the complexities of traditional exams,
                        providing a platform where teachers can effortlessly
                        create, manage, and grade tests, and students can focus
                        on demonstrating their knowledge in a clear, intuitive
                        environment. We strive for accuracy, fairness, and
                        simplicity in every step of the assessment journey.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
                        Features Built For You
                    </h2>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature Card 1: Dynamic Test Creation */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8 hover:border-black">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-sky-600">
                                <PencilRuler size={32} />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Dynamic Test Creation
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                Effortlessly build tests with multiple-choice
                                and numerical questions. Set points, correct
                                answers, and even negative marking for each
                                question.
                            </p>
                        </div>

                        {/* Feature Card 2: Automated Grading */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8 hover:border-black">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <BookCheck size={32} />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Instant & Accurate Grading
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                Say goodbye to manual grading. Our system
                                automatically grades tests upon submission,
                                providing immediate results and saving valuable
                                time.
                            </p>
                        </div>

                        {/* Feature Card 3: Comprehensive Results */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8 hover:border-black">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                <BarChart2 size={32} />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Insightful Performance Tracking
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                Teachers can view detailed student results,
                                including individual answers, scores, and
                                overall performance metrics.
                            </p>
                        </div>

                        {/* Feature Card 4: Role-Based Dashboards */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8 hover:border-black">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                                <Users size={32} />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Tailored User Experience
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                Distinct dashboards for teachers and students
                                ensure a focused and relevant experience for
                                every user.
                            </p>
                        </div>

                        {/* Feature Card 5: Secure & Reliable */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8 hover:border-black">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Robust Security
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                Built with JWT authentication and role-based
                                access control to keep your data and assessments
                                secure.
                            </p>
                        </div>

                        {/* Feature Card 6: Responsive Design */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8 hover:border-black">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                <Code size={32} />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Seamless Across Devices
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                A fully responsive interface ensures an optimal
                                experience whether you're on a desktop, tablet,
                                or mobile phone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="bg-gray-800 px-4 py-16 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-center">
                    <h2 className="mb-8 text-4xl font-bold">Our Tech Stack</h2>
                    <p className="mx-auto mb-10 max-w-4xl text-lg text-gray-300">
                        Examind is powered by modern, industry-standard
                        technologies to ensure performance, scalability, and
                        reliability.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex flex-col items-center rounded-lg bg-gray-700 p-4 shadow-md">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                                alt="React"
                                className="mb-2 h-16 w-16"
                            />
                            <span className="text-lg font-medium">
                                React.js
                            </span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-gray-700 p-4 shadow-md">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
                                alt="Node.js"
                                className="mb-2 h-16 w-16"
                            />
                            <span className="text-lg font-medium">Node.js</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-gray-700 p-4 shadow-md">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png"
                                alt="Express.js"
                                className="mb-2 h-16 w-16"
                            />
                            <span className="text-lg font-medium">
                                Express.js
                            </span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-gray-700 p-4 shadow-md">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg"
                                alt="MongoDB"
                                className="mb-2 h-16 w-16"
                            />
                            <span className="text-lg font-medium">MongoDB</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-gray-700 p-4 shadow-md">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
                                alt="TailwindCSS"
                                className="mb-2 h-16 w-16"
                            />
                            <span className="text-lg font-medium">
                                TailwindCSS
                            </span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-gray-700 p-4 shadow-md">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
                                alt="Redis"
                                className="mb-2 h-16 w-16"
                            />
                            <span className="text-lg font-medium">Redis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-gradient-to-r from-sky-600 to-sky-700 px-4 py-20 text-center text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-6 text-4xl font-bold">
                        Ready to Streamline Your Assessments?
                    </h2>
                    <p className="mb-10 text-xl">
                        Join Examind today and experience the future of online
                        testing.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex transform items-center rounded-full border border-transparent bg-white px-10 py-5 text-xl font-bold text-sky-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
                    >
                        Sign Up Now
                        <Rocket className="ml-3 h-6 w-6" />
                    </Link>
                </div>
            </section>

            {/* Footer (Optional, but good practice) */}
            <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600">
                <p>
                    &copy; {new Date().getFullYear()} Examind. All rights
                    reserved.
                </p>
                <p>Built with passion for education.</p>
            </footer>
        </div>
    );
};

export default About;
