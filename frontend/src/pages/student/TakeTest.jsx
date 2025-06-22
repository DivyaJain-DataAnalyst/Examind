import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import toast from "react-hot-toast";

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const questionRefs = useRef({});

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const testRes = await axios.get(`/api/student/tests/${testId}`);
                const questionsRes = await axios.get(
                    `/api/student/questions/${testId}`
                );

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
                setLoading(false);
            } catch (error) {
                toast.error("Error loading test");
                console.error("Error loading test:", error);
                navigate("/student");
            }
        };

        fetchTestData();
    }, [testId, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    toast.error("Time is up! Submitting test.");
                    handleSubmitTest();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [test]);

    const handleChange = (qid, value) => {
        setAnswers((prev) => ({ ...prev, [qid]: value }));
    };

    const handleSubmitTest = async () => {
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
        questionRefs.current[qid]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const handleQuestionDoubleClick = (qid) => {
        setAnswers((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[qid];
            return newAnswers;
        });
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Loading...
                    </div>
                </div>
            </div>
        );

    return (
        <div className="min-h-full bg-white">
            <div className="max-w-8xl mx-auto p-6 grid md:grid-cols-4 gap-6 ">
                {/* Test Content */}
                <div className="col-span-3 bg-gray-300/10 ">
                    <div className="bg-blue-600/10 backdrop-blur-sm shadow-[0_2px_20px_rgba(0,0,0,0.25)]  border border-blue-400 rounded-2xl p-8 mb-6 ">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold bg-blue-600 bg-clip-text text-transparent mb-2 text-shadow-lg">
                                    {test.title}
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    {test.description}
                                </p>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`text-3xl font-bold transition-colors duration-300 ${
                                        timeLeft > 300
                                            ? "text-green-500"
                                            : timeLeft > 120
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {Math.floor(timeLeft / 60)}:
                                    {(timeLeft % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                </div>
                                <p className="text-sm font-medium text-gray-500">
                                    Time Left
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6rounded-2xl">
                        {questions.map((q, index) => (
                            <div
                                key={q.id}
                                ref={(el) => (questionRefs.current[q.id] = el)}
                                className=""
                                onDoubleClick={() =>
                                    handleQuestionDoubleClick(q.id)
                                }
                            >
                                <div className="p-8">
                                    <div className="flex items-start space-x-4 mb-6">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-xl text-gray-800 leading-relaxed flex-1">
                                            Q{index + 1}: {q.text}
                                        </p>
                                    </div>

                                    {q.type === "multiple-choice" && (
                                        <div className="space-y-3 ml-14">
                                            {q.options.map((opt, idx) => (
                                                <label
                                                    key={idx}
                                                    className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                                                        answers[q.id] === opt.id
                                                            ? "bg-blue-50 border-blue-300 shadow-md"
                                                            : "bg-gray-50 border-gray-200 hover:bg-blue-25 hover:border-blue-200"
                                                    }`}
                                                >
                                                    <div className="relative">
                                                        <input
                                                            type="radio"
                                                            name={q.id}
                                                            value={opt.id}
                                                            checked={
                                                                answers[
                                                                    q.id
                                                                ] === opt.id
                                                            }
                                                            onChange={() =>
                                                                handleChange(
                                                                    q.id,
                                                                    opt.id
                                                                )
                                                            }
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                                answers[
                                                                    q.id
                                                                ] === opt.id
                                                                    ? "border-blue-500 bg-blue-500"
                                                                    : "border-gray-300"
                                                            }`}
                                                        >
                                                            {answers[q.id] ===
                                                                opt.id && (
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-700 font-medium flex-1">
                                                        {opt.text}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === "numerical" && (
                                        <div className="ml-14">
                                            <input
                                                type="number"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all duration-300 text-lg"
                                                placeholder="Enter your answer..."
                                                value={answers[q.id] || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        q.id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            onClick={handleSubmitTest}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Submit Test
                        </button>
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="col-span-1 shadow-[0_1px_10px_rgba(0,0,0,0.25)]  bg-white/80 p-6 rounded-2xl sticky top-6 h-fit">
                    <h2 className="font-bold text-3xl mb-6 text-center bg-blue-600 bg-clip-text text-transparent text-shadow-lg">
                        Questions
                    </h2>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>
                                {Object.keys(answers).length}/{questions.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 bg-gradient-to-r from-blue-500 to-blue-800 rounded-full transition-all duration-500"
                                style={{
                                    width: `${
                                        questions.length > 0
                                            ? (Object.keys(answers).length /
                                                  questions.length) *
                                              100
                                            : 0
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        {questions.map((q, index) => (
                            <button
                                key={q.id}
                                onClick={() => scrollToQuestion(q.id)}
                                onDoubleClick={() =>
                                    handleQuestionDoubleClick(q.id)
                                }
                                className={`relative w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-110 
                  ${
                      answers[q.id]
                          ? "bg-green-500 text-white"
                          : "bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                                title="Double-click to clear answer"
                            >
                                {index + 1}
                                {answers[q.id] && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-700 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-2 h-2 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 text-center text-xs text-gray-500">
                        Double-click question to clear answer
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeTest;
