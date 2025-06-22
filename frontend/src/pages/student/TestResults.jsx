import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import {
    mockTests,
    getQuestionsForTest,
    mockTestAttempts,
} from "../../data/mockData";
import { QUESTION_TYPES } from "../../types";

const TestResults = () => {
    const { testId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResultsData = async () => {
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 800));

                // Find test in mock data
                const testData = mockTests.find((t) => t.id === testId);

                if (!testData) {
                    console.error("Test not found");
                    navigate("/student");
                    return;
                }

                // Get questions for this test
                const testQuestions = getQuestionsForTest(testId);

                // Get user's answers and score from location state or from mock data
                let userAnswers = {};
                let userScore = 0;
                let userTotalPoints = 0;

                if (location.state?.answers) {
                    // If we have data from the TakeTest component
                    userAnswers = location.state.answers;
                    userScore = location.state.score;
                    userTotalPoints = location.state.totalPoints;
                } else {
                    // Otherwise, fetch from mock data
                    const attempt = mockTestAttempts.find(
                        (a) => a.testId === testId,
                    );

                    if (attempt) {
                        attempt.answers.forEach((a) => {
                            userAnswers[a.questionId] = a.answer;
                        });
                        userScore = attempt.score;
                        userTotalPoints = attempt.totalPoints;
                    } else {
                        console.error("No test attempt found");
                        navigate("/student");
                        return;
                    }
                }

                setTest(testData);
                setQuestions(testQuestions);
                setAnswers(userAnswers);
                setScore(userScore);
                setTotalPoints(userTotalPoints);
            } catch (error) {
                console.error("Error fetching results:", error);
                navigate("/student");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResultsData();
    }, [testId, location.state, navigate]);

    const isAnswerCorrect = (question) => {
        const userAnswer = answers[question.id];
        if (!userAnswer) return false;

        if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
            return userAnswer === question.correctAnswer;
        } else if (question.type === QUESTION_TYPES.NUMERICAL) {
            const numericAnswer = parseFloat(userAnswer);
            const correctAnswer = parseFloat(question.correctAnswer);
            const tolerance = question.tolerance || 0;

            return (
                !isNaN(numericAnswer) &&
                !isNaN(correctAnswer) &&
                Math.abs(numericAnswer - correctAnswer) <= tolerance
            );
        }

        return false;
    };

    const getAnswerLabel = (question) => {
        if (!answers[question.id]) {
            return "Not answered";
        }

        if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
            const option = question.options.find(
                (opt) => opt.id === answers[question.id],
            );
            return option
                ? `${answers[question.id].toUpperCase()}. ${option.text}`
                : answers[question.id];
        } else {
            return answers[question.id];
        }
    };

    const getCorrectAnswerLabel = (question) => {
        if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
            const option = question.options.find(
                (opt) => opt.id === question.correctAnswer,
            );
            return option
                ? `${question.correctAnswer.toUpperCase()}. ${option.text}`
                : question.correctAnswer;
        } else {
            return `${question.correctAnswer} ${
                question.tolerance ? `(±${question.tolerance})` : ""
            }`;
        }
    };

    const getScorePercentage = () => {
        if (totalPoints === 0) return 0;
        return Math.round((score / totalPoints) * 100);
    };

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
        if (grade === "A") return "text-green-600";
        if (grade === "B") return "text-blue-600";
        if (grade === "C") return "text-yellow-600";
        if (grade === "D") return "text-orange-600";
        return "text-red-600";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar title="Test Results" />
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="py-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading results...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        //changed
        <div className="h-screen w-screen bg-gray-50">
            <Navbar title="Test Results" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/student")}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Back to Dashboard
                    </button>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">
                        Results: {test?.title}
                    </h1>
                </div>

                <div className="fade-in mb-8 rounded-lg bg-white p-6 shadow">
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-lg bg-blue-50 p-6 text-center">
                            <h2 className="mb-2 text-lg font-medium text-gray-900">
                                Score
                            </h2>
                            <div className="text-3xl font-bold text-blue-600">
                                {score} / {totalPoints}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                {getScorePercentage()}%
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-6 text-center">
                            <h2 className="mb-2 text-lg font-medium text-gray-900">
                                Grade
                            </h2>
                            <div
                                className={`text-3xl font-bold ${getGradeColor()}`}
                            >
                                {getGrade()}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                {getScorePercentage() >= 60
                                    ? "Passed"
                                    : "Failed"}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-6 text-center">
                            <h2 className="mb-2 text-lg font-medium text-gray-900">
                                Questions
                            </h2>
                            <div className="text-3xl font-bold text-gray-700">
                                {
                                    Object.values(answers).filter(
                                        (a) => a !== "",
                                    ).length
                                }{" "}
                                / {questions.length}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                Attempted
                            </div>
                        </div>
                    </div>

                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Question Review
                    </h2>

                    <div className="space-y-6">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`rounded-lg border p-6 ${
                                    isAnswerCorrect(question)
                                        ? "border-green-200 bg-green-50"
                                        : answers[question.id]
                                          ? "border-red-200 bg-red-50"
                                          : "border-gray-200 bg-gray-50"
                                }`}
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Question {index + 1}
                                    </h3>
                                    <div className="flex items-center">
                                        {isAnswerCorrect(question) ? (
                                            <div className="flex items-center text-green-600">
                                                <CheckCircle
                                                    size={18}
                                                    className="mr-1"
                                                />
                                                <span className="font-medium">
                                                    Correct
                                                </span>
                                            </div>
                                        ) : answers[question.id] ? (
                                            <div className="flex items-center text-red-600">
                                                <XCircle
                                                    size={18}
                                                    className="mr-1"
                                                />
                                                <span className="font-medium">
                                                    Incorrect
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-gray-500">
                                                <AlertCircle
                                                    size={18}
                                                    className="mr-1"
                                                />
                                                <span className="font-medium">
                                                    Not Answered
                                                </span>
                                            </div>
                                        )}
                                        <span className="ml-2 text-sm text-gray-500">
                                            {question.points} points
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-800">
                                        {question.text}
                                    </p>

                                    {question.imageUrl && (
                                        <div className="mt-3">
                                            <img
                                                src={question.imageUrl}
                                                alt="Question"
                                                className="max-h-48 rounded-md border bg-white object-contain"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-gray-700">
                                            Your Answer:
                                        </p>
                                        <div
                                            className={`rounded-md p-3 ${
                                                !answers[question.id]
                                                    ? "bg-gray-100 text-gray-500 italic"
                                                    : isAnswerCorrect(question)
                                                      ? "bg-green-100 text-green-800"
                                                      : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {answers[question.id]
                                                ? getAnswerLabel(question)
                                                : "Not answered"}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-1 text-sm font-medium text-gray-700">
                                            Correct Answer:
                                        </p>
                                        <div className="rounded-md bg-green-100 p-3 text-green-800">
                                            {getCorrectAnswerLabel(question)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResults;
