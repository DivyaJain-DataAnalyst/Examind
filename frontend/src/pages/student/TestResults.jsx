// // export default TestResults;
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ChevronLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
// import Navbar from "../../components/Navbar";
// import axios from "../../config/axios"; // 👈 your axios instance
// import toast from "react-hot-toast";

// const TestResults = () => {
//     const { testId } = useParams();
//     const navigate = useNavigate();

//     const [test, setTest] = useState(null);
//     const [questions, setQuestions] = useState([]);
//     const [score, setScore] = useState(0);
//     const [totalPoints, setTotalPoints] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchResults = async () => {
//             try {
//                 const res = await axios.get(`/api/student/results/${testId}`);
//                 setTest(res.data.test);
//                 setQuestions(res.data.detailedQuestions);
//                 setScore(res.data.score);
//                 setTotalPoints(res.data.totalPoints);
//             } catch (err) {
//                 console.error("Failed to load results", err);
//                 toast.error("Failed to load results");
//                 navigate("/student");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchResults();
//     }, [testId, navigate]);

//     const getScorePercentage = () =>
//         totalPoints === 0 ? 0 : Math.round((score / totalPoints) * 100);

//     const getGrade = () => {
//         const percentage = getScorePercentage();
//         if (percentage >= 90) return "A";
//         if (percentage >= 80) return "B";
//         if (percentage >= 70) return "C";
//         if (percentage >= 60) return "D";
//         return "F";
//     };

//     const getGradeColor = () => {
//         const grade = getGrade();
//         return {
//             A: "text-green-600",
//             B: "text-blue-600",
//             C: "text-yellow-600",
//             D: "text-orange-600",
//             F: "text-red-600",
//         }[grade];
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50">
//                 <Navbar title="Test Results" />
//                 <div className="py-12 text-center">
//                     <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
//                     <p className="mt-2 text-gray-600">Loading results...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="mt-16 h-screen w-screen overflow-y-auto bg-gray-50">
//             <Navbar title="Test Results" />
//             <div className="mx-auto max-w-7xl py-8">
//                 <div className="mb-6">
//                     <button
//                         onClick={() => navigate("/student")}
//                         className="mb-4 inline-flex items-center rounded border border-blue-300 p-1 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800"
//                     >
//                         <ChevronLeft size={16} className="mr-1" />
//                         Back to Dashboard
//                     </button>
//                     <h1 className="mt-2 text-2xl font-bold text-gray-900">
//                         Results: {test?.title}
//                     </h1>
//                 </div>

//                 {/* Score Summary */}
//                 <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
//                     <div className="rounded-lg bg-blue-50 p-6 text-center">
//                         <h2 className="text-lg font-medium">Score</h2>
//                         <div className="text-3xl font-bold text-blue-600">
//                             {score} / {totalPoints}
//                         </div>
//                         <div className="text-sm text-gray-600">
//                             {getScorePercentage()}%
//                         </div>
//                     </div>
//                     <div className="rounded-lg bg-green-50 p-6 text-center">
//                         <h2 className="text-lg font-medium">Grade</h2>
//                         <div
//                             className={`text-3xl font-bold ${getGradeColor()}`}
//                         >
//                             {getGrade()}
//                         </div>
//                         <div className="text-sm text-gray-600">
//                             {getScorePercentage() >= 60 ? "Passed" : "Failed"}
//                         </div>
//                     </div>
//                     <div className="rounded-lg bg-gray-100 p-6 text-center">
//                         <h2 className="text-lg font-medium">Questions</h2>
//                         <div className="text-3xl font-bold text-gray-700">
//                             {
//                                 questions.filter(
//                                     (q) =>
//                                         q.userAnswer !== null &&
//                                         q.userAnswer !== undefined,
//                                 ).length
//                             }{" "}
//                             / {questions.length}
//                         </div>
//                         <div className="text-sm text-gray-600">Attempted</div>
//                     </div>
//                 </div>

//                 {/* Questions */}
//                 <h2 className="mb-4 text-xl font-semibold text-gray-900">
//                     Question Review
//                 </h2>
//                 <div className="space-y-6">
//                     {questions.map((q, i) => (
//                         <div
//                             key={q.questionId}
//                             className={`rounded-lg border p-6 ${
//                                 q.isCorrect
//                                     ? "border-green-200 bg-green-50"
//                                     : q.userAnswer
//                                       ? "border-red-200 bg-red-50"
//                                       : "border-gray-200 bg-gray-50"
//                             }`}
//                         >
//                             <div className="mb-4 flex items-start justify-between">
//                                 <h3 className="text-lg font-medium text-gray-900">
//                                     Question {i + 1}
//                                 </h3>
//                                 <div className="flex items-center">
//                                     {q.isCorrect ? (
//                                         <div className="flex items-center text-green-600">
//                                             <CheckCircle
//                                                 size={18}
//                                                 className="mr-1"
//                                             />
//                                             Correct
//                                         </div>
//                                     ) : q.userAnswer ? (
//                                         <div className="flex items-center text-red-600">
//                                             <XCircle
//                                                 size={18}
//                                                 className="mr-1"
//                                             />
//                                             Incorrect
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center text-gray-500">
//                                             <AlertCircle
//                                                 size={18}
//                                                 className="mr-1"
//                                             />
//                                             Not Answered
//                                         </div>
//                                     )}
//                                     <span className="ml-2 text-sm text-gray-500">
//                                         {q.points} points
//                                     </span>
//                                 </div>
//                             </div>

//                             <p className="text-gray-800">{q.text}</p>

//                             {q.imageUrl && (
//                                 <div className="mt-3">
//                                     <img
//                                         src={q.imageUrl}
//                                         alt="Question"
//                                         className="max-h-48 rounded-md border bg-white object-contain"
//                                     />
//                                 </div>
//                             )}

//                             <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
//                                 <div>
//                                     <p className="mb-1 text-sm font-medium text-gray-700">
//                                         Your Answer:
//                                     </p>
//                                     <div
//                                         className={`rounded-md p-3 ${
//                                             q.userAnswer === null ||
//                                             q.userAnswer === undefined
//                                                 ? "bg-gray-100 text-gray-500 italic"
//                                                 : q.isCorrect
//                                                   ? "bg-green-100 text-green-800"
//                                                   : "bg-red-100 text-red-800"
//                                         }`}
//                                     >
//                                         {q.userAnswer ?? "Not Answered"}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <p className="mb-1 text-sm font-medium text-gray-700">
//                                         Correct Answer:
//                                     </p>
//                                     <div className="rounded-md bg-green-100 p-3 text-green-800">
//                                         {q.correctAnswer}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TestResults;




import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
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

const TestResults = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`/api/student/results/${testId}`);
                setTest(res.data.test);
                setQuestions(res.data.detailedQuestions);
                setScore(res.data.score);
                setTotalPoints(res.data.totalPoints);
            } catch (err) {
                console.error("Failed to load results", err);
                toast.error("Failed to load results");
                navigate("/student");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [testId, navigate]);

    const getScorePercentage = () =>
        totalPoints === 0 ? 0 : Math.round((score / totalPoints) * 100);

    const getGrade = () => {
        const percentage = getScorePercentage();
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    };

    const getGradeColor = () => {
        const grade = getGrade();
        return {
            A: "text-green-600",
            B: "text-blue-600",
            C: "text-yellow-600",
            D: "text-orange-600",
            F: "text-red-600",
        }[grade];
    };
    
    // Helper to get the text of an answer option by its ID
    const getOptionText = (question, optionId) => {
        if (question.type !== 'multiple-choice' || !optionId) return optionId;
        const option = question.options.find(opt => opt.id === optionId);
        return option ? option.text : optionId; // Fallback to ID if not found
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                     <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                     <p className="mt-4 text-lg font-semibold text-gray-600">Loading Results...</p>
                </div>
            </div>
        );
    }

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div className="min-h-screen bg-gray-50">
                <Navbar title="Test Results" />
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate("/student")}
                            className="mb-4 inline-flex items-center rounded-lg border border-transparent bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Back to Dashboard
                        </button>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Results: {test?.title}
                        </h1>
                    </div>

                    {/* Score Summary */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                            <h2 className="text-lg font-medium text-gray-500">Score</h2>
                            <div className="text-4xl font-bold text-blue-600">
                                {score} / {totalPoints}
                            </div>
                            <div className="text-lg font-semibold text-gray-600">
                                {getScorePercentage()}%
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                            <h2 className="text-lg font-medium text-gray-500">Grade</h2>
                            <div className={`text-4xl font-bold ${getGradeColor()}`}>
                                {getGrade()}
                            </div>
                             <div className="text-lg font-semibold text-gray-600">
                                {getScorePercentage() >= 60 ? "Passed" : "Failed"}
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                            <h2 className="text-lg font-medium text-gray-500">Questions</h2>
                            <div className="text-4xl font-bold text-gray-700">
                                {questions.filter(q => q.userAnswer != null).length} / {questions.length}
                            </div>
                            <div className="text-lg font-semibold text-gray-600">Attempted</div>
                        </div>
                    </div>

                    {/* Questions Review */}
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Question Review
                    </h2>
                    <div className="space-y-6">
                        {questions.map((q, i) => (
                            <div
                                key={q.questionId}
                                className={`rounded-lg border p-6 ${
                                    q.isCorrect
                                        ? "border-green-300 bg-green-50"
                                        : q.userAnswer != null
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-200 bg-gray-50"
                                }`}
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Question {i + 1}
                                    </h3>
                                    <div className="flex items-center text-sm font-medium">
                                        {q.isCorrect ? (
                                            <div className="flex items-center text-green-600"><CheckCircle size={18} className="mr-1" /> Correct</div>
                                        ) : q.userAnswer != null ? (
                                            <div className="flex items-center text-red-600"><XCircle size={18} className="mr-1" /> Incorrect</div>
                                        ) : (
                                            <div className="flex items-center text-gray-500"><AlertCircle size={18} className="mr-1" /> Not Answered</div>
                                        )}
                                        <span className="ml-4 text-gray-500">{q.points} points</span>
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none text-gray-800">
                                    <MathJax dynamic>{q.text}</MathJax>
                                </div>

                                {q.imageUrl && (
                                    <div className="mt-4">
                                        <img src={q.imageUrl} alt="Question visual aid" className="max-h-48 rounded-md border bg-white object-contain" />
                                    </div>
                                )}

                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-gray-600">Your Answer:</p>
                                        <div className={`rounded-md p-3 text-base ${
                                            q.userAnswer == null
                                                ? "bg-gray-100 text-gray-500 italic"
                                                : q.isCorrect
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            <MathJax inline dynamic>
                                                {q.userAnswer != null ? getOptionText(q, q.userAnswer) : "Not Answered"}
                                            </MathJax>
                                        </div>
                                    </div>
                                    {!q.isCorrect && (
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-gray-600">Correct Answer:</p>
                                            <div className="rounded-md bg-green-100 p-3 text-base text-green-800">
                                                <MathJax inline dynamic>
                                                    {getOptionText(q, q.correctAnswer)}
                                                </MathJax>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MathJaxContext>
    );
};

export default TestResults;