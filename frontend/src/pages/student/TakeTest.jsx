// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../config/axios";
// import toast from "react-hot-toast";

// const TakeTest = () => {
//     const { testId } = useParams();
//     const navigate = useNavigate();
//     const [test, setTest] = useState(null);
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [timeLeft, setTimeLeft] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const questionRefs = useRef({});

//     useEffect(() => {
//         const fetchTestData = async () => {
//             try {
//                 const testRes = await axios.get(`/api/student/tests/${testId}`);
//                 const questionsRes = await axios.get(`/api/student/questions/${testId}`);

//                 const testData = testRes.data.test;
//                 const testQuestions = questionsRes.data.questions;

//                 if (!testData || !testQuestions || testQuestions.length === 0) {
//                     toast.error("Test or questions not found");
//                     navigate("/student");
//                     return;
//                 }

//                 setTest(testData);
//                 setQuestions(testQuestions);
//                 setTimeLeft(testData.duration * 60);
//                 setLoading(false);
//             } catch (error) {
//                 toast.error("Error loading test");
//                 console.error("Error loading test:", error);
//                 navigate("/student");
//             }
//         };

//         fetchTestData();
//     }, [testId, navigate]);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTimeLeft((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(timer);
//                     toast.error("Time is up! Submitting test.");
//                     handleSubmitTest();
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [test]);

//     const handleChange = (qid, value) => {
//         setAnswers((prev) => ({ ...prev, [String(qid)]: value }));
//     };

//     const handleSubmitTest = async () => {
//         try {
//             console.log("Submitting answers:", answers);
//             await axios.post(`/api/student/submit/${testId}`, { answers });
//             toast.success("Test submitted successfully!");
//             navigate("/student");
//         } catch (error) {
//             toast.error("Failed to submit test");
//             console.error("Submit error:", error);
//         }
//     };

//     const scrollToQuestion = (qid) => {
//         questionRefs.current[String(qid)]?.scrollIntoView({
//             behavior: "smooth",
//             block: "center",
//         });
//     };

//     const handleQuestionDoubleClick = (qid) => {
//         setAnswers((prev) => {
//             const newAnswers = { ...prev };
//             delete newAnswers[String(qid)];
//             return newAnswers;
//         });
//     };

//     if (loading)
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
//                 <div className="text-center">
//                     <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
//                     <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
//                         Loading...
//                     </div>
//                 </div>
//             </div>
//         );

//     return (
//         <div className="min-h-full bg-white">
//             <div className="max-w-8xl mx-auto grid gap-6 p-6 md:grid-cols-4">
//                 <div className="col-span-3 bg-gray-300/10">
//                     <div className="mb-6 rounded-2xl border border-blue-400 bg-blue-600/10 p-8 shadow-[0_2px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h1 className="mb-2 bg-blue-600 bg-clip-text text-3xl font-bold text-transparent text-shadow-lg">{test.title}</h1>
//                                 <p className="text-lg text-gray-600">{test.description}</p>
//                             </div>
//                             <div className="text-right">
//                                 <div className={`text-3xl font-bold transition-colors duration-300 ${timeLeft > 300 ? "text-green-500" : timeLeft > 120 ? "text-yellow-500" : "text-red-500"}`}>
//                                     {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
//                                 </div>
//                                 <p className="text-sm font-medium text-gray-500">Time Left</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="space-y-6rounded-2xl">
//                         {questions.map((q, index) => {
//                             const qid = q.id || q._id.toString();
//                             return (
//                                 <div key={qid} ref={(el) => (questionRefs.current[qid] = el)} onDoubleClick={() => handleQuestionDoubleClick(qid)}>
//                                     <div className="p-8">
//                                         <div className="mb-6 flex items-start space-x-4">
//                                             <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500">
//                                                 <span className="text-sm font-bold text-white">{index + 1}</span>
//                                             </div>
//                                             <p className="flex-1 text-xl leading-relaxed font-semibold text-gray-800">Q{index + 1}: {q.text}</p>
//                                         </div>

//                                         {q.type === "multiple-choice" && (
//                                             <div className="ml-14 space-y-3">
//                                                 {q.options.map((opt, idx) => (
//                                                     <label key={idx} className={`flex cursor-pointer items-center space-x-4 rounded-xl border-2 p-4 transition-all duration-300 ${answers[qid] === opt.id ? "border-blue-300 bg-blue-50 shadow-md" : "hover:bg-blue-25 border-gray-200 bg-gray-50 hover:border-blue-200"}`}>
//                                                         <div className="relative">
//                                                             <input
//                                                                 type="radio"
//                                                                 name={qid}
//                                                                 value={opt.id}
//                                                                 checked={answers[qid] === opt.id}
//                                                                 onChange={() => handleChange(qid, opt.id)}
//                                                                 className="sr-only"
//                                                             />
//                                                             <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ${answers[qid] === opt.id ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
//                                                                 {answers[qid] === opt.id && <div className="h-2 w-2 rounded-full bg-white"></div>}
//                                                             </div>
//                                                         </div>
//                                                         <span className="flex-1 font-medium text-gray-700">{opt.text}</span>
//                                                     </label>
//                                                 ))}
//                                             </div>
//                                         )}

//                                         {q.type === "numerical" && (
//                                             <div className="ml-14">
//                                                 <input
//                                                     type="number"
//                                                     className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg transition-all duration-300 outline-none focus:border-blue-500 focus:ring-0"
//                                                     placeholder="Enter your answer..."
//                                                     value={answers[qid] || ""}
//                                                     onChange={(e) => handleChange(qid, e.target.value)}
//                                                 />
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     <div className="mt-8 text-center">
//                         <button
//                             className="inline-flex transform items-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
//                             onClick={handleSubmitTest}
//                         >
//                             <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Submit Test
//                         </button>
//                     </div>
//                 </div>

//                 <div className="sticky top-6 col-span-1 h-fit rounded-2xl bg-white/80 p-6 shadow-[0_1px_10px_rgba(0,0,0,0.25)]">
//                     <h2 className="mb-6 bg-blue-600 bg-clip-text text-center text-3xl font-bold text-transparent text-shadow-lg">Questions</h2>

//                     <div className="mb-6">
//                         <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
//                             <span>Progress</span>
//                             <span>{Object.keys(answers).length}/{questions.length}</span>
//                         </div>
//                         <div className="h-2 w-full rounded-full bg-gray-200">
//                             <div
//                                 className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 transition-all duration-500"
//                                 style={{
//                                     width: `${questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0}%`,
//                                 }}
//                             ></div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-5 gap-3">
//                         {questions.map((q, index) => {
//                             const qid = q.id || q._id.toString();
//                             return (
//                                 <button
//                                     key={qid}
//                                     onClick={() => scrollToQuestion(qid)}
//                                     onDoubleClick={() => handleQuestionDoubleClick(qid)}
//                                     className={`relative h-12 w-12 transform rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 ${answers[qid] ? "bg-green-500 text-white" : "border-2 border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"}`}
//                                     title="Double-click to clear answer"
//                                 >
//                                     {index + 1}
//                                     {answers[qid] && (
//                                         <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-700">
//                                             <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                             </svg>
//                                         </div>
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>

//                     <div className="mt-4 text-center text-xs text-gray-500">Double-click question to clear answer</div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TakeTest;




import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import toast from "react-hot-toast";
// Import from better-react-mathjax
import { MathJax, MathJaxContext } from "better-react-mathjax";

// Configuration for MathJax
const mathJaxConfig = {
    loader: { load: ["input/tex", "output/svg"] },
    tex: {
        inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
        ],
        displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
        ],
    },
    svg: {
        fontCache: "global",
    },
};


const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const questionRefs = useRef({});
    const timerId = useRef(null); // Use ref to hold timer ID

    useEffect(() => {
        const fetchTestData = async () => {
            setLoading(true);
            try {
                const testRes = await axios.get(`/api/student/tests/${testId}`);
                const questionsRes = await axios.get(`/api/student/questions/${testId}`);

                const testData = testRes.data.test;
                const testQuestions = questionsRes.data.questions;

                if (!testData || !testQuestions || testQuestions.length === 0) {
                    toast.error("Test or questions not found");
                    navigate("/student");
                    return;
                }

                setTest(testData);
                setQuestions(testQuestions);
                setTimeLeft(testData.duration * 60);
            } catch (error) {
                toast.error("Error loading test data.");
                console.error("Error loading test:", error);
                navigate("/student");
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [testId, navigate]);

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0) {
            timerId.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerId.current);
                        toast.error("Time is up! Submitting test automatically.");
                        handleSubmitTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        // Cleanup function to clear interval
        return () => clearInterval(timerId.current);
    }, [timeLeft]); // Rerunning when timeLeft changes is intended

    const handleChange = (qid, value) => {
        setAnswers((prev) => ({ ...prev, [String(qid)]: value }));
    };

    const handleSubmitTest = async () => {
        clearInterval(timerId.current); // Stop the timer on submission
        try {
            await axios.post(`/api/student/submit/${testId}`, { answers });
            toast.success("Test submitted successfully!");
            navigate("/student");
        } catch (error) {
            toast.error("Failed to submit test");
            console.error("Submit error:", error);
        }
    };

    const scrollToQuestion = (qid) => {
        questionRefs.current[String(qid)]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const handleQuestionDoubleClick = (qid) => {
        setAnswers((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[String(qid)];
            return newAnswers;
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                        Loading Test...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div className="min-h-full bg-white">
                <div className="max-w-8xl mx-auto grid gap-6 p-6 md:grid-cols-4">
                    <div className="col-span-3 bg-gray-50/50 p-4 rounded-lg">
                        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/30 p-8 shadow-sm">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                                <div className="mb-4 md:mb-0">
                                    <h1 className="mb-2 text-3xl font-bold text-blue-800">{test.title}</h1>
                                    <p className="text-lg text-gray-600">{test.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-3xl font-bold transition-colors duration-300 ${timeLeft > 300 ? "text-green-500" : timeLeft > 120 ? "text-yellow-500" : "text-red-500"}`}>
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Time Left</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {questions.map((q, index) => {
                                    const qid = q.id || q._id.toString();
                                    return (
                                        <div
                                            key={qid}
                                            ref={(el) => (questionRefs.current[qid] = el)}
                                            onDoubleClick={() => handleQuestionDoubleClick(qid)}
                                            className="rounded-xl border bg-white p-6 shadow-sm"
                                        >
                                            {/* Question Header */}
                                            <div className="mb-6 flex items-start space-x-4">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500">
                                                    <span className="text-sm font-bold text-white">{index + 1}</span>
                                                </div>
                                                <div className="flex-1 text-xl leading-relaxed font-semibold text-gray-800">
                                                    <MathJax dynamic>{q.text}</MathJax>
                                                </div>
                                            </div>

                                            {/* Question Image */}
                                            {q.imageUrl && (
                                                <div className="ml-14 mb-4">
                                                    <img
                                                        src={q.imageUrl}
                                                        alt={`Question ${index + 1}`}
                                                        className="w-80 rounded-lg border shadow-sm"
                                                    />
                                                </div>
                                            )}

                                            {/* Multiple Choice Options */}
                                            {q.type === "multiple-choice" && (
                                                <div className="ml-14 space-y-3">
                                                    {q.options.map((opt, idx) => (
                                                        <label
                                                            key={idx}
                                                            className={`flex cursor-pointer items-center space-x-4 rounded-xl border-2 p-4 transition-all duration-300 ${
                                                                answers[qid] === opt.id
                                                                    ? "border-blue-400 bg-blue-50 shadow-md"
                                                                    : "hover:bg-blue-50 border-gray-200 bg-gray-50 hover:border-blue-200"
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={qid}
                                                                value={opt.id}
                                                                checked={answers[qid] === opt.id}
                                                                onChange={() => handleChange(qid, opt.id)}
                                                                className="sr-only"
                                                            />
                                                            <div
                                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                                                                    answers[qid] === opt.id
                                                                        ? "border-blue-500 bg-blue-500"
                                                                        : "border-gray-300"
                                                                }`}
                                                            >
                                                                {answers[qid] === opt.id && (
                                                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                                                )}
                                                            </div>
                                                            <span className="flex-1 font-medium text-gray-700">
                                                                <MathJax inline dynamic>{opt.text}</MathJax>
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Numerical Input */}
                                            {q.type === "numerical" && (
                                                <div className="ml-14">
                                                    <input
                                                        type="number"
                                                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg transition-all duration-300 outline-none focus:border-blue-500 focus:ring-0"
                                                        placeholder="Enter your answer..."
                                                        value={answers[qid] || ""}
                                                        onChange={(e) => handleChange(qid, e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                        </div>

                        <div className="mt-8 text-center">
                            <button
                                className="inline-flex transform items-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-300"
                                onClick={handleSubmitTest}
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit Test
                            </button>
                        </div>
                    </div>

                    <div className="sticky top-6 col-span-1 h-fit rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                        <h2 className="mb-6 text-center text-2xl font-bold text-blue-800">Questions</h2>
                        <div className="mb-6">
                            <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
                                <span>Progress</span>
                                <span>{Object.keys(answers).length}/{questions.length}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                                    style={{
                                        width: `${questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, index) => {
                                const qid = q.id || q._id.toString();
                                return (
                                    <button
                                        key={qid}
                                        onClick={() => scrollToQuestion(qid)}
                                        onDoubleClick={() => handleQuestionDoubleClick(qid)}
                                        className={`relative flex items-center justify-center h-12 w-12 transform rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 ${answers[qid] ? "bg-green-500 text-white shadow-md" : "border-2 border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"}`}
                                        title="Double-click to clear answer"
                                    >
                                        {index + 1}
                                        {answers[qid] && (
                                            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-700">
                                                <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-center text-xs text-gray-500">Double-click a number to clear the answer.</div>
                    </div>
                </div>
            </div>
        </MathJaxContext>
    );
};

export default TakeTest;
