import Logo from "../components/Logo";
import NavbarPublic from "../components/NavbarPublic";

const Landing = () => {
    return (
        <div className="">
            <NavbarPublic />
            {/* <> */}
            <div className="relative isolate mt-8 bg-white px-6 lg:px-8">
                {/* Top Decorative Blur Background */}
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#154DE8] to-[#4E9FFF] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="mx-auto mt-10 max-w-2xl py-16 sm:py-48 lg:py-32">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
                    <div className="text-center">
                        <Logo className="text-6xl" />
                        <p className="mt-8 text-2xl font-medium text-gray-500 sm:text-xl">
                            Where Exams Meet Simplicity. Create, Take, and Track
                            Tests…
                            <br /> All in One Click
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="/login"
                                className="rounded-md bg-gradient-to-r from-blue-700 to-blue-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Login to Get Started
                            </a>
                            <a
                                href="/register"
                                className="text-sm font-semibold text-gray-900"
                            >
                                Register <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Blur Background */}
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#154DE8] to-[#4E9FFF] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
            </div>
            {/* </> */}
        </div>
    );
};

export default Landing;
