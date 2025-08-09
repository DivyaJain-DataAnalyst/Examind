// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Plus,
//     Trash2,
//     Image,
//     ChevronLeft,
//     Save,
//     Clock,
//     Calendar,
//     Settings,
//     BookMarked,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import Navbar from "../../components/Navbar";
// import { QUESTION_TYPES } from "../../types";
// import axios from "../../config/axios";

// const CreateTest = () => {
//     const navigate = useNavigate();
//     const [testDetails, setTestDetails] = useState({
//         title: "",
//         description: "",
//         subject: "",
//         duration: 30,
//         startTime: "",
//         endTime: "",
//     });

//     const [questions, setQuestions] = useState([
//         {
//             id: "new-q-1",
//             text: "",
//             type: QUESTION_TYPES.MULTIPLE_CHOICE,
//             options: [
//                 { id: "a", text: "" },
//                 { id: "b", text: "" },
//                 { id: "c", text: "" },
//                 { id: "d", text: "" },
//             ],
//             correctAnswer: "",
//             points: 5,
//             imageUrl: null,
//         },
//     ]);

//     const handleTestDetailsChange = (e) => {
//         const { name, value } = e.target;
//         setTestDetails((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleQuestionChange = (index, field, value) => {
//         const updatedQuestions = [...questions];
//         updatedQuestions[index][field] = value;
//         setQuestions(updatedQuestions);
//     };

//     const handleOptionChange = (questionIndex, optionId, value) => {
//         const updatedQuestions = [...questions];
//         const optionIndex = updatedQuestions[questionIndex].options.findIndex(
//             (opt) => opt.id === optionId,
//         );

//         if (optionIndex !== -1) {
//             updatedQuestions[questionIndex].options[optionIndex].text = value;
//             setQuestions(updatedQuestions);
//         }
//     };

//     const handleCorrectAnswerChange = (questionIndex, value) => {
//         const updatedQuestions = [...questions];
//         updatedQuestions[questionIndex].correctAnswer = value;
//         setQuestions(updatedQuestions);
//     };

//     const addQuestion = () => {
//         const newQuestion = {
//             id: `new-q-${questions.length + 1}`,
//             text: "",
//             type: QUESTION_TYPES.MULTIPLE_CHOICE,
//             options: [
//                 { id: "a", text: "" },
//                 { id: "b", text: "" },
//                 { id: "c", text: "" },
//                 { id: "d", text: "" },
//             ],
//             correctAnswer: "",
//             points: 5,
//             imageUrl: null,
//         };

//         setQuestions([...questions, newQuestion]);
//     };

//     const removeQuestion = (index) => {
//         if (questions.length > 1) {
//             const updatedQuestions = questions.filter((_, i) => i !== index);
//             setQuestions(updatedQuestions);
//         } else {
//             toast.error("Test must have at least one question");
//         }
//     };

//     const handleImageUpload = (questionIndex, e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const fakeImageUrl = URL.createObjectURL(file);

//             const updatedQuestions = [...questions];
//             updatedQuestions[questionIndex].imageUrl = fakeImageUrl;
//             setQuestions(updatedQuestions);

//             toast.success("Image uploaded successfully");
//         }
//     };

//     const handleTypeChange = (questionIndex, newType) => {
//         const updatedQuestions = [...questions];
//         updatedQuestions[questionIndex].type = newType;

//         updatedQuestions[questionIndex].correctAnswer = "";

//         setQuestions(updatedQuestions);
//     };

//     const validateForm = () => {
//         if (!testDetails.title) return "Test title is required";
//         if (!testDetails.subject) return "Subject is required";
//         if (!testDetails.duration) return "Duration is required";
//         if (!testDetails.startTime) return "Start time is required";
//         if (!testDetails.endTime) return "End time is required";

//         for (let i = 0; i < questions.length; i++) {
//             const q = questions[i];
//             if (!q.text) return `Question ${i + 1} text is required`;
//             if (q.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
//                 if (!q.options.every((opt) => opt.text)) {
//                     return `All options for Question ${i + 1} are required`;
//                 }
//                 if (!q.correctAnswer) {
//                     return `Correct answer for Question ${i + 1} is required`;
//                 }
//             } else if (q.type === QUESTION_TYPES.NUMERICAL) {
//                 if (!q.correctAnswer) {
//                     return `Correct answer for Question ${i + 1} is required`;
//                 }
//             }
//         }

//         return null;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const error = validateForm();
//         if (error) {
//             toast.error(error);
//             return;
//         }

//         try {
//             const payload = {
//                 ...testDetails,
//                 questions,
//             };
//             await axios.post("/api/teacher/tests", payload);
//             toast.success("Test created successfully!");
//             navigate("/teacher");
//         } catch (err) {
//             console.error(err);
//             const message =
//                 err.response?.data?.message || "Failed to create test";
//             toast.error(message);
//         }
//     };

//     return (
//         <div className="min-h-screen w-screen from-slate-50 p-12">
//             <Navbar title="Create New Test" />

//             <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
//                 {/* Header Section */}
//                 <div className="mb-8">
//                     <button
//                         onClick={() => navigate("/teacher")}
//                         className="group mb-6 inline-flex transform items-center rounded-full border-2 border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-lg hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-xl"
//                     >
//                         <ChevronLeft
//                             size={18}
//                             className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
//                         />
//                         <span>Back to Dashboard</span>
//                         <div className="ml-2 h-2 w-2 rounded-full bg-blue-400 transition-all duration-300 group-hover:animate-pulse group-hover:opacity-100"></div>
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* Test Details Card */}
//                     <div className="overflow-hidden rounded-md border border-gray-200 bg-white/70 shadow-sm">
//                         <div className="bg-blue-700/90 px-6 py-4">
//                             <div className="flex items-center space-x-2">
//                                 <Settings className="h-5 w-5 text-white" />
//                                 <h2 className="text-lg font-semibold text-white">
//                                     Test Configuration
//                                 </h2>
//                             </div>
//                         </div>

//                         <div className="p-8">
//                             <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//                                 <div className="space-y-6">
//                                     <div className="group">
//                                         <label
//                                             htmlFor="title"
//                                             className="mb-2 block text-sm font-semibold text-gray-700"
//                                         >
//                                             Test Title*
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="title"
//                                             name="title"
//                                             value={testDetails.title}
//                                             onChange={handleTestDetailsChange}
//                                             className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                             placeholder="e.g., Midterm Physics Exam"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="group">
//                                         <label
//                                             htmlFor="subject"
//                                             className="mb-2 block text-sm font-semibold text-gray-700"
//                                         >
//                                             Subject*
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="subject"
//                                             name="subject"
//                                             value={testDetails.subject}
//                                             onChange={handleTestDetailsChange}
//                                             className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                             placeholder="e.g., Physics"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="group">
//                                         <label
//                                             htmlFor="duration"
//                                             className="mb-2 block text-sm font-semibold text-gray-700"
//                                         >
//                                             <Clock className="mr-1 inline h-4 w-4" />
//                                             Duration (minutes)*
//                                         </label>
//                                         <input
//                                             type="number"
//                                             id="duration"
//                                             name="duration"
//                                             value={testDetails.duration}
//                                             onChange={handleTestDetailsChange}
//                                             min={5}
//                                             className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-6">
//                                     <div className="group">
//                                         <label
//                                             htmlFor="description"
//                                             className="mb-2 block text-sm font-semibold text-gray-700"
//                                         >
//                                             Description
//                                         </label>
//                                         <textarea
//                                             id="description"
//                                             name="description"
//                                             value={testDetails.description}
//                                             onChange={handleTestDetailsChange}
//                                             rows={4}
//                                             className="block w-full resize-none rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                             placeholder="Provide a brief description of the test"
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 gap-6">
//                                         <div className="group">
//                                             <label
//                                                 htmlFor="startTime"
//                                                 className="mb-2 block text-sm font-semibold text-gray-700"
//                                             >
//                                                 <Calendar className="mr-1 inline h-4 w-4" />
//                                                 Start Date & Time*
//                                             </label>
//                                             <input
//                                                 type="datetime-local"
//                                                 id="startTime"
//                                                 name="startTime"
//                                                 value={testDetails.startTime}
//                                                 onChange={
//                                                     handleTestDetailsChange
//                                                 }
//                                                 className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="group">
//                                             <label
//                                                 htmlFor="endTime"
//                                                 className="mb-2 block text-sm font-semibold text-gray-700"
//                                             >
//                                                 <Calendar className="mr-1 inline h-4 w-4" />
//                                                 End Date & Time*
//                                             </label>
//                                             <input
//                                                 type="datetime-local"
//                                                 id="endTime"
//                                                 name="endTime"
//                                                 value={testDetails.endTime}
//                                                 onChange={
//                                                     handleTestDetailsChange
//                                                 }
//                                                 className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Questions Section */}
//                     <div className="space-y-6">
//                         <div className="flex items-center space-x-3">
//                             <div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 p-2">
//                                 <BookMarked className="h-6 w-6 text-white" />
//                             </div>
//                             <h2 className="text-2xl font-bold text-gray-900">
//                                 Questions ({questions.length})
//                             </h2>
//                         </div>

//                         {questions.map((question, index) => (
//                             <div key={question.id}>
//                                 <div className="overflow-hidden rounded-md border border-gray-300 bg-white/70 shadow-sm">
//                                     <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
//                                                     <span className="text-sm font-bold text-white">
//                                                         {index + 1}
//                                                     </span>
//                                                 </div>
//                                                 <h3 className="text-lg font-semibold text-white">
//                                                     Question {index + 1}
//                                                 </h3>
//                                             </div>
//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     removeQuestion(index)
//                                                 }
//                                                 className="inline-flex items-center rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-300 transition-colors duration-200 hover:bg-red-500/30"
//                                             >
//                                                 <Trash2
//                                                     size={16}
//                                                     className="mr-1"
//                                                 />
//                                                 Remove
//                                             </button>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-6 p-8">
//                                         <div className="group">
//                                             <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                                 Question Text*
//                                             </label>
//                                             <textarea
//                                                 value={question.text}
//                                                 onChange={(e) =>
//                                                     handleQuestionChange(
//                                                         index,
//                                                         "text",
//                                                         e.target.value,
//                                                     )
//                                                 }
//                                                 rows={3}
//                                                 className="block w-full resize-none rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                                 placeholder="Enter your question here"
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                                             <div>
//                                                 <label className="mb-3 block text-sm font-semibold text-gray-700">
//                                                     Question Type*
//                                                 </label>
//                                                 <div className="flex space-x-4">
//                                                     <label className="flex cursor-pointer items-center rounded-xl border-2 border-gray-200 bg-white/60 p-3 transition-colors duration-200 hover:bg-white/80">
//                                                         <input
//                                                             type="radio"
//                                                             checked={
//                                                                 question.type ===
//                                                                 QUESTION_TYPES.MULTIPLE_CHOICE
//                                                             }
//                                                             onChange={() =>
//                                                                 handleTypeChange(
//                                                                     index,
//                                                                     QUESTION_TYPES.MULTIPLE_CHOICE,
//                                                                 )
//                                                             }
//                                                             className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                                         />
//                                                         <span className="ml-3 text-sm font-medium text-gray-700">
//                                                             Multiple Choice
//                                                         </span>
//                                                     </label>
//                                                     <label className="flex cursor-pointer items-center rounded-xl border-2 border-gray-200 bg-white/60 p-3 transition-colors duration-200 hover:bg-white/80">
//                                                         <input
//                                                             type="radio"
//                                                             checked={
//                                                                 question.type ===
//                                                                 QUESTION_TYPES.NUMERICAL
//                                                             }
//                                                             onChange={() =>
//                                                                 handleTypeChange(
//                                                                     index,
//                                                                     QUESTION_TYPES.NUMERICAL,
//                                                                 )
//                                                             }
//                                                             className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                                         />
//                                                         <span className="ml-3 text-sm font-medium text-gray-700">
//                                                             Numerical
//                                                         </span>
//                                                     </label>
//                                                 </div>
//                                             </div>

//                                             <div>
//                                                 <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                                     Points
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     value={question.points}
//                                                     onChange={(e) =>
//                                                         handleQuestionChange(
//                                                             index,
//                                                             "points",
//                                                             parseInt(
//                                                                 e.target.value,
//                                                                 10,
//                                                             ),
//                                                         )
//                                                     }
//                                                     min={1}
//                                                     className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <label className="mb-3 block text-sm font-semibold text-gray-700">
//                                                 Image (Optional)
//                                             </label>
//                                             <div className="flex items-center space-x-4">
//                                                 <label className="inline-flex transform cursor-pointer items-center rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-indigo-700">
//                                                     <Image
//                                                         size={18}
//                                                         className="mr-2"
//                                                     />
//                                                     Upload Image
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         className="hidden"
//                                                         onChange={(e) =>
//                                                             handleImageUpload(
//                                                                 index,
//                                                                 e,
//                                                             )
//                                                         }
//                                                     />
//                                                 </label>
//                                                 {question.imageUrl && (
//                                                     <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
//                                                         ✓ Image uploaded
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             {question.imageUrl && (
//                                                 <div className="mt-4 rounded-xl border-2 border-gray-200 bg-white/60 p-4">
//                                                     <img
//                                                         src={question.imageUrl}
//                                                         alt="Question"
//                                                         className="mx-auto h-40 rounded-lg object-contain shadow-md"
//                                                     />
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {question.type ===
//                                             QUESTION_TYPES.MULTIPLE_CHOICE && (
//                                             <div>
//                                                 <label className="mb-3 block text-sm font-semibold text-gray-700">
//                                                     Options*
//                                                 </label>
//                                                 <div className="space-y-3">
//                                                     {question.options.map(
//                                                         (option) => (
//                                                             <div
//                                                                 key={option.id}
//                                                                 className="flex items-center space-x-3 bg-white/60 p-3"
//                                                             >
//                                                                 <label className="inline-flex cursor-pointer items-center">
//                                                                     <input
//                                                                         type="radio"
//                                                                         name={`question_${question.id}_correct`}
//                                                                         checked={
//                                                                             question.correctAnswer ===
//                                                                             option.id
//                                                                         }
//                                                                         onChange={() =>
//                                                                             handleCorrectAnswerChange(
//                                                                                 index,
//                                                                                 option.id,
//                                                                             )
//                                                                         }
//                                                                         className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
//                                                                     />
//                                                                     <span className="ml-2 w-6 text-sm font-bold text-gray-700">
//                                                                         {option.id.toUpperCase()}
//                                                                         .
//                                                                     </span>
//                                                                 </label>
//                                                                 <input
//                                                                     type="text"
//                                                                     value={
//                                                                         option.text
//                                                                     }
//                                                                     onChange={(
//                                                                         e,
//                                                                     ) =>
//                                                                         handleOptionChange(
//                                                                             index,
//                                                                             option.id,
//                                                                             e
//                                                                                 .target
//                                                                                 .value,
//                                                                         )
//                                                                     }
//                                                                     className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                                                     placeholder={`Option ${option.id.toUpperCase()}`}
//                                                                     required
//                                                                 />
//                                                             </div>
//                                                         ),
//                                                     )}
//                                                 </div>
//                                                 <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-gray-500">
//                                                     💡 Select the radio button
//                                                     next to the correct answer
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {question.type ===
//                                             QUESTION_TYPES.NUMERICAL && (
//                                             <div className="space-y-4">
//                                                 <div>
//                                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                                         Correct Answer*
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         value={
//                                                             question.correctAnswer
//                                                         }
//                                                         onChange={(e) =>
//                                                             handleCorrectAnswerChange(
//                                                                 index,
//                                                                 e.target.value,
//                                                             )
//                                                         }
//                                                         className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                                         placeholder="e.g., 3.14"
//                                                         required
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                                         Tolerance (±)
//                                                     </label>
//                                                     <input
//                                                         type="number"
//                                                         value={
//                                                             question.tolerance ||
//                                                             0
//                                                         }
//                                                         onChange={(e) =>
//                                                             handleQuestionChange(
//                                                                 index,
//                                                                 "tolerance",
//                                                                 parseFloat(
//                                                                     e.target
//                                                                         .value,
//                                                                 ),
//                                                             )
//                                                         }
//                                                         step="0.01"
//                                                         min="0"
//                                                         className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0"
//                                                         placeholder="e.g., 0.01"
//                                                     />
//                                                     <div className="mt-2 rounded-lg bg-yellow-50 p-3 text-sm text-gray-500">
//                                                         ⚡ Tolerance allows
//                                                         slightly different
//                                                         answers to be marked as
//                                                         correct (e.g., 3.14 ±
//                                                         0.01)
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Add Question Button - Now appears after each question */}
//                                 <div className="mt-4 flex justify-center">
//                                     <button
//                                         type="button"
//                                         onClick={addQuestion}
//                                         className="inline-flex transform items-center rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-600 hover:to-teal-700"
//                                     >
//                                         <Plus size={18} className="mr-2" />
//                                         Add Question Below
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-end space-x-4 pt-8">
//                         <button
//                             type="button"
//                             onClick={() => navigate("/teacher")}
//                             className="inline-flex items-center rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-indigo-700"
//                         >
//                             <Save size={18} className="mr-2" />
//                             Create Test
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateTest;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Trash2,
    Image,
    ChevronLeft,
    Save,
    Clock,
    Calendar,
    Settings,
    BookMarked,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { QUESTION_TYPES } from "../../types";
import axios from "../../config/axios";
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

const CreateTest = () => {
    const navigate = useNavigate();
    const [testDetails, setTestDetails] = useState({
        title: "",
        description: "",
        subject: "",
        duration: 30,
        startTime: "",
        endTime: "",
    });

    const [questions, setQuestions] = useState([
        {
            id: "new-q-1",
            text: "",
            type: QUESTION_TYPES.MULTIPLE_CHOICE,
            options: [
                { id: "a", text: "" },
                { id: "b", text: "" },
                { id: "c", text: "" },
                { id: "d", text: "" },
            ],
            correctAnswer: "",
            points: 5,
            imageUrl: null,
        },
    ]);

    const handleTestDetailsChange = (e) => {
        const { name, value } = e.target;
        setTestDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionId, value) => {
        const updatedQuestions = [...questions];
        const optionIndex = updatedQuestions[questionIndex].options.findIndex(
            (opt) => opt.id === optionId
        );

        if (optionIndex !== -1) {
            updatedQuestions[questionIndex].options[optionIndex].text = value;
            setQuestions(updatedQuestions);
        }
    };

    const handleCorrectAnswerChange = (questionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].correctAnswer = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        const newQuestion = {
            id: `new-q-${questions.length + 1}`,
            text: "",
            type: QUESTION_TYPES.MULTIPLE_CHOICE,
            options: [
                { id: "a", text: "" },
                { id: "b", text: "" },
                { id: "c", text: "" },
                { id: "d", text: "" },
            ],
            correctAnswer: "",
            points: 5,
            imageUrl: null,
        };

        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
        } else {
            toast.error("Test must have at least one question");
        }
    };

    // const handleImageUpload = (questionIndex, e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const fakeImageUrl = URL.createObjectURL(file);

    //         const updatedQuestions = [...questions];
    //         updatedQuestions[questionIndex].imageUrl = fakeImageUrl;
    //         setQuestions(updatedQuestions);

    //         toast.success("Image uploaded successfully");
    //     }
    // };
const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await axios.post(
            "/api/upload", // your backend upload route
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (res.data.imageUrl) {
            const updatedQuestions = [...questions];
            updatedQuestions[index].imageUrl = res.data.imageUrl; // Cloudinary URL
            setQuestions(updatedQuestions);
        }
    } catch (error) {
        console.error("Image upload failed", error);
    }
};


    const handleTypeChange = (questionIndex, newType) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].type = newType;
        updatedQuestions[questionIndex].correctAnswer = "";
        setQuestions(updatedQuestions);
    };

    const validateForm = () => {
        if (!testDetails.title.trim()) return "Test title is required";
        if (!testDetails.subject.trim()) return "Subject is required";
        if (!testDetails.duration) return "Duration is required";
        if (!testDetails.startTime) return "Start time is required";
        if (!testDetails.endTime) return "End time is required";

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text.trim()) return `Question ${i + 1} text is required`;
            if (q.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
                if (!q.options.every((opt) => opt.text.trim())) {
                    return `All options for Question ${i + 1} are required`;
                }
                if (!q.correctAnswer) {
                    return `Correct answer for Question ${i + 1} is required`;
                }
            } else if (q.type === QUESTION_TYPES.NUMERICAL) {
                if (!q.correctAnswer.trim()) {
                    return `Correct answer for Question ${i + 1} is required`;
                }
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        try {
            const payload = {
                ...testDetails,
                questions,
            };
            await axios.post("/api/teacher/tests", payload);
            toast.success("Test created successfully!");
            navigate("/teacher");
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Failed to create test";
            toast.error(message);
        }
    };

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div className="min-h-screen w-screen bg-slate-50 p-4 md:p-12">
                <Navbar title="Create New Test" />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <button
                            onClick={() => navigate("/teacher")}
                            className="group mb-6 inline-flex transform items-center rounded-full border-2 border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-lg transition-all hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-xl"
                        >
                            <ChevronLeft
                                size={18}
                                className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                            />
                            <span>Back to Dashboard</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="overflow-hidden rounded-md border border-gray-200 bg-white/70 shadow-sm">
                            <div className="bg-blue-700/90 px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">Test Configuration</h2>
                                </div>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                                    {/* Test Details Fields */}
                                    <div className="space-y-6">
                                        <input id="title" name="title" value={testDetails.title} onChange={handleTestDetailsChange} className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0" placeholder="e.g., Midterm Physics Exam" required />
                                        <input id="subject" name="subject" value={testDetails.subject} onChange={handleTestDetailsChange} className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0" placeholder="e.g., Physics" required />
                                        <input type="number" id="duration" name="duration" value={testDetails.duration} onChange={handleTestDetailsChange} min={5} className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0" required />
                                    </div>
                                    <div className="space-y-6">
                                        <textarea id="description" name="description" value={testDetails.description} onChange={handleTestDetailsChange} rows={3} className="block w-full resize-none rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:ring-0" placeholder="Provide a brief description of the test" />
                                        <input type="datetime-local" id="startTime" name="startTime" value={testDetails.startTime} onChange={handleTestDetailsChange} className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-0" required />
                                        <input type="datetime-local" id="endTime" name="endTime" value={testDetails.endTime} onChange={handleTestDetailsChange} className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-0" required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 p-2"><BookMarked className="h-6 w-6 text-white" /></div>
                                <h2 className="text-2xl font-bold text-gray-900">Questions ({questions.length})</h2>
                            </div>

                            {questions.map((question, index) => (
                                <div key={question.id} className="pt-4">
                                    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white/70 shadow-md">
                                        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">{index + 1}</div>
                                                <h3 className="text-lg font-semibold text-white">Question {index + 1}</h3>
                                            </div>
                                            <button type="button" onClick={() => removeQuestion(index)} className="inline-flex items-center rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30">
                                                <Trash2 size={16} className="mr-1" /> Remove
                                            </button>
                                        </div>

                                        <div className="space-y-6 p-6 md:p-8">
                                            <textarea value={question.text} onChange={(e) => handleQuestionChange(index, "text", e.target.value)} rows={3} className="block w-full resize-none rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-0" placeholder="Enter question text. Use $...$ for inline and $$...$$ for display math." required />
                                            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 min-h-[4rem] flex items-center">
                                                <MathJax dynamic>{question.text || <span className="text-gray-400">Preview...</span>}</MathJax>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div>
                                                    <div className="flex space-x-4">
                                                        <label className="flex cursor-pointer items-center rounded-xl border-2 border-gray-200 p-3 hover:bg-white/80"><input type="radio" checked={question.type === QUESTION_TYPES.MULTIPLE_CHOICE} onChange={() => handleTypeChange(index, QUESTION_TYPES.MULTIPLE_CHOICE)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" /><span className="ml-3 text-sm font-medium text-gray-700">Multiple Choice</span></label>
                                                        <label className="flex cursor-pointer items-center rounded-xl border-2 border-gray-200 p-3 hover:bg-white/80"><input type="radio" checked={question.type === QUESTION_TYPES.NUMERICAL} onChange={() => handleTypeChange(index, QUESTION_TYPES.NUMERICAL)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" /><span className="ml-3 text-sm font-medium text-gray-700">Numerical</span></label>
                                                    </div>
                                                </div>
                                                <div><input type="number" value={question.points} onChange={(e) => handleQuestionChange(index, "points", parseInt(e.target.value, 10))} min={1} className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-0" /></div>
                                            </div>
                                       <div>
                                           <label className="mb-3 block text-sm font-semibold text-gray-700">
                                               Image (Optional)
                                           </label>
                                             <div className="flex items-center space-x-4">
                                                 <label className="inline-flex transform cursor-pointer items-center rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-indigo-700">
                                                    <Image
                                                        size={18}
                                                        className="mr-2"
                                                    />
                                                    Upload Image
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleImageUpload(
                                                                index,
                                                                e,
                                                            )
                                                        }
                                                    />
                                                </label>
                                                {question.imageUrl && (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                                        ✓ Image uploaded
                                                    </span>
                                                )}
                                            </div>
                                            {question.imageUrl && (
                                                <div className="mt-4 rounded-xl border-2 border-gray-200 bg-white/60 p-4">
                                                    <img
                                                        src={question.imageUrl}
                                                        alt="Question"
                                                        className="mx-auto h-40 rounded-lg object-contain shadow-md"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                            {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                                                <div className="border-t border-gray-200 pt-6">
                                                    <div className="space-y-4">
                                                        {question.options.map((option) => (
                                                            <div key={option.id} className="space-y-2">
                                                                <div className="flex items-center space-x-3">
                                                                    <input type="radio" name={`question_${question.id}_correct`} checked={question.correctAnswer === option.id} onChange={() => handleCorrectAnswerChange(index, option.id)} className="h-5 w-5 flex-shrink-0 cursor-pointer border-gray-300 text-green-600 focus:ring-green-500" />
                                                                    <label className="font-bold text-gray-700">{option.id.toUpperCase()}.</label>
                                                                    <input type="text" value={option.text} onChange={(e) => handleOptionChange(index, option.id, e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-0" placeholder={`Option ${option.id.toUpperCase()}`} required />
                                                                </div>
                                                                <div className="ml-8 rounded-md border border-gray-200 bg-gray-50 p-2 pl-3 min-h-[2.5rem] flex items-center">
                                                                    <MathJax inline dynamic>{option.text || <span className="text-gray-400">...</span>}</MathJax>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {question.type === QUESTION_TYPES.NUMERICAL && (
                                                <div className="border-t border-gray-200 pt-6 space-y-4">
                                                    <input type="text" value={question.correctAnswer} onChange={(e) => handleCorrectAnswerChange(index, e.target.value)} className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-0" placeholder="e.g., 3.14" required />
                                                    <input type="number" value={question.tolerance || 0} onChange={(e) => handleQuestionChange(index, "tolerance", parseFloat(e.target.value))} step="0.01" min="0" className="block w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-0" placeholder="Tolerance (e.g., 0.01)" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {index === questions.length - 1 && (
                                         <div className="mt-6 flex justify-center">
                                             <button type="button" onClick={addQuestion} className="inline-flex transform items-center rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-600">
                                                 <Plus size={18} className="mr-2" /> Add Question
                                             </button>
                                         </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4 pt-8">
                            <button type="button" onClick={() => navigate("/teacher")} className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50">Cancel</button>
                             <button
                            type="submit"
                            className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-indigo-700"
                        >
                            <Save size={18} className="mr-2" />
                            Create Test
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </MathJaxContext>
    );
};

export default CreateTest;
