import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import Navbar from "../../components/Navbar";
import { ChevronLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SingleStudentResult = () => {
  const { testId, studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`/api/teacher/results/${testId}/${studentId}`);
        setStudent(res.data.student);
        setTest(res.data.test);
        setQuestions(res.data.detailedQuestions);
        setScore(res.data.score);
        setTotalPoints(res.data.totalPoints);
      } catch (err) {
        console.error("Failed to load student result", err);
        navigate("/teacher");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId, studentId, navigate]);

  const getPercentage = () =>
    totalPoints === 0 ? 0 : Math.round((score / totalPoints) * 100);

  const getGrade = () => {
    const p = getPercentage();
    if (p >= 90) return "A";
    if (p >= 80) return "B";
    if (p >= 70) return "C";
    if (p >= 60) return "D";
    return "F";
  };

  if (loading) {
    return <div className="p-8 text-center">Loading result...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={`Result of ${student.name}`} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          className="mb-4 text-sm text-blue-600 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-4">{test?.title}</h1>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-white border rounded-lg text-center">
            <h2 className="text-lg font-semibold">Score</h2>
            <p className="text-2xl font-bold text-blue-600">
              {score} / {totalPoints}
            </p>
          </div>
          <div className="p-4 bg-white border rounded-lg text-center">
            <h2 className="text-lg font-semibold">Percentage</h2>
            <p className="text-2xl font-bold text-green-600">
              {getPercentage()}%
            </p>
          </div>
          <div className="p-4 bg-white border rounded-lg text-center">
            <h2 className="text-lg font-semibold">Grade</h2>
            <p className="text-2xl font-bold text-gray-800">{getGrade()}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Question Review</h2>
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={q.questionId}
              className={`p-4 border rounded-md ${
                q.isCorrect
                  ? "bg-green-50 border-green-200"
                  : q.userAnswer
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Q{i + 1}: {q.text}</p>
                <div className="flex items-center text-sm">
                  {q.isCorrect ? (
                    <CheckCircle className="text-green-600 mr-1" size={16} />
                  ) : q.userAnswer ? (
                    <XCircle className="text-red-600 mr-1" size={16} />
                  ) : (
                    <AlertCircle className="text-gray-500 mr-1" size={16} />
                  )}
                  <span>{q.points} pts</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Student Answer</p>
                  <div className="p-2 bg-white rounded border">
                    {q.userAnswer ?? "Not Answered"}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Correct Answer</p>
                  <div className="p-2 bg-green-100 rounded border border-green-200">
                    {q.correctAnswer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleStudentResult;
