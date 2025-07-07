import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../config/axios";
import Navbar from "../../components/Navbar";

const TeacherTestResults = () => {
  const { testId } = useParams();
  const [results, setResults] = useState([]);
  const [testTitle, setTestTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/teacher/results/${testId}`);
        setResults(res.data.results);
        setTestTitle(res.data.testTitle);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={`Results for ${testTitle}`} />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Student Results</h1>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">No student has submitted this test yet.</p>
        ) : (
          <div className="space-y-4">
            {results.map((student) => (
              <Link
                to={`/teacher/results/${testId}/${student.studentId}`}
                key={student.studentId}
                className="flex items-center justify-between rounded-md border p-4 hover:bg-gray-100 transition"
              >
                <div>
                  <p className="text-lg font-medium">{student.studentName}</p>
                  <p className="text-sm text-gray-600">{student.percentage}% - {student.score}/{student.totalPoints}</p>
                </div>
                <span className="text-blue-600 hover:underline">View</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTestResults;
