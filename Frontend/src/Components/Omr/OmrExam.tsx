import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define interfaces for type safety
interface QuestionOption {
  [key: string]: string;
}

interface Question {
  id: number;
  question_text: string;
  question_image?: string;
  options: QuestionOption;
  level: number;
  correct_option?: string;
}

interface Subject {
  id: number;
  name: string;
  image?: string;
  board?: string;
  class_level?: number;
}

interface SubjectQuestions {
  subject: string;
  questions: Question[];
  levelCounts: {
    [key: number]: number;
  };
}

interface Answers {
  [questionId: string]: string;
}

const OMRPage: React.FC = () => {
  const [questionsBySubject, setQuestionsBySubject] = useState<SubjectQuestions[]>([]);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [errorShown, setErrorShown] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showSubjectSelection, setShowSubjectSelection] = useState<boolean>(false);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [selectedExtraSubjects, setSelectedExtraSubjects] = useState<number[]>([]);
  const [showSubjectCompleteAlert, setShowSubjectCompleteAlert] = useState<boolean>(false);
  const [showExamCompleteAlert, setShowExamCompleteAlert] = useState<boolean>(false);
  const [examSubmitResponse, setExamSubmitResponse] = useState<{score?: number; total?: number; submission_id?: number} | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const subjectIdsParam = query.get("subject_ids") || "";
  const subjectIds = subjectIdsParam.split(",").filter(Boolean);
  const studentId = query.get("student_id") || localStorage.getItem("student_id") || "";

  // Load stored exam state from localStorage on initial load
  useEffect(() => {
    if (studentId) {
      // Try to restore saved exam state
      const savedQuestionsKey = `exam_questions_${studentId}`;
      const savedAnswersKey = `exam_answers_${studentId}`;
      const savedSubjectIndexKey = `exam_subject_index_${studentId}`;
      const savedQuestionIndexKey = `exam_question_index_${studentId}`;
      const savedSubjectIdsKey = `exam_subject_ids_${studentId}`;
      
      const savedQuestions = localStorage.getItem(savedQuestionsKey);
      const savedAnswers = localStorage.getItem(savedAnswersKey);
      const savedSubjectIndex = localStorage.getItem(savedSubjectIndexKey);
      const savedQuestionIndex = localStorage.getItem(savedQuestionIndexKey);
      const savedSubjectIds = localStorage.getItem(savedSubjectIdsKey);
      
      if (savedQuestions && savedSubjectIds) {
        // Restore saved state
        setQuestionsBySubject(JSON.parse(savedQuestions));
        setAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});
        setCurrentSubjectIndex(savedSubjectIndex ? parseInt(savedSubjectIndex) : 0);
        setCurrentQuestionIndex(savedQuestionIndex ? parseInt(savedQuestionIndex) : 0);
        
        // Update URL with saved subject IDs if different
        const storedSubjectIds = JSON.parse(savedSubjectIds);
        if (subjectIdsParam !== storedSubjectIds.join(',')) {
          const newUrl = `${window.location.pathname}?student_id=${studentId}&subject_ids=${storedSubjectIds.join(',')}`;
          window.history.replaceState(null, '', newUrl);
        }
        
        setLoading(false);
      } else {
        // No saved state, fetch new questions
        fetchQuestions(subjectIds);
      }
    }
  }, [studentId, subjectIdsParam]);

  // Save current exam state to localStorage whenever it changes
  useEffect(() => {
    if (studentId && questionsBySubject.length > 0) {
      localStorage.setItem(`exam_questions_${studentId}`, JSON.stringify(questionsBySubject));
      localStorage.setItem(`exam_answers_${studentId}`, JSON.stringify(answers));
      localStorage.setItem(`exam_subject_index_${studentId}`, currentSubjectIndex.toString());
      localStorage.setItem(`exam_question_index_${studentId}`, currentQuestionIndex.toString());
      localStorage.setItem(`exam_subject_ids_${studentId}`, JSON.stringify(subjectIds));
    }
  }, [questionsBySubject, answers, currentSubjectIndex, currentQuestionIndex, studentId, subjectIds]);

  // Fetch available subjects for the "Add Subject" functionality
  useEffect(() => {
    const fetchAvailableSubjects = async (): Promise<void> => {
      try {
        // Get the student's class level and board from localStorage if saved during form submission
        const classLevel = localStorage.getItem("student_class");
        const board = localStorage.getItem("student_board");
        
        let url = "http://127.0.0.1:8000/api/subjects/";
        if (classLevel) url += `?class_level=${classLevel}`;
        if (board) url += `${classLevel ? '&' : '?'}board=${board}`;
        
        const response = await axios.get<Subject[]>(url);
        
        // Filter out subjects that are already selected
        const filteredSubjects = response.data.filter(
          subject => !subjectIds.includes(subject.id.toString())
        );
        
        setAvailableSubjects(filteredSubjects);
      } catch (err) {
        console.error("Error fetching available subjects:", err);
      }
    };

    if (showSubjectSelection) {
      fetchAvailableSubjects();
    }
  }, [showSubjectSelection, subjectIds]);

  const fetchQuestions = async (subjectIdsToFetch: string[]): Promise<void> => {
    if (!studentId || subjectIdsToFetch.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/get_random_questions/", {
        subject_ids: subjectIdsToFetch,
        student_id: parseInt(studentId)
      });

      console.log("API response:", response.data);
      
      // Handle both data formats: new format (with questions property) and old format
      const formatted = Object.entries(response.data).map(([subject, data]: [string, any]) => {
        // Check if data is an object with a 'questions' property (new format)
        // or if it's directly the questions array (old format)
        const questions = data.questions || data;
        
        return {
          subject,
          questions: questions,
          levelCounts: data.level_counts || {} // Store level counts if available
        };
      });

      console.log("Formatted data:", formatted);
      setQuestionsBySubject(formatted);
    } catch (err) {
      console.error("Error fetching questions:", err);
      alert("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, selectedOption: string): void => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleNextSubject = (): void => {
    if (currentSubjectIndex < questionsBySubject.length - 1) {
      // Show the subject complete alert
      setShowSubjectCompleteAlert(true);
      
      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowSubjectCompleteAlert(false);
        setCurrentSubjectIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }, 3000);
    } else {
      handleSubmit();
    }
  };

  const handleNextQuestion = (): void => {
    if (currentQuestionIndex < currentSubject?.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSubjectIndex < questionsBySubject.length - 1) {
      handleNextSubject();
    } else {
      handleSubmit();
    }
  };

  const handlePrevQuestion = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    // Check if at least one answer has been submitted
    const hasAnswers = Object.keys(answers).length > 0;
    
    if (!hasAnswers) {
      alert("Please answer at least one question before submitting.");
      return;
    }
    
    try {
      const payload = {
        student_id: parseInt(studentId),
        subject_ids: subjectIds,
        answers: answers,
      };

      const response = await axios.post("http://127.0.0.1:8000/api/submit_answers/", payload);
      
      // Store the response data for displaying in the completion alert
      setExamSubmitResponse({
        score: response.data.score,
        total: response.data.total,
        submission_id: response.data.submission_id
      });

      // Show exam completion alert
      setShowExamCompleteAlert(true);

      // Clear localStorage after successful submission
      localStorage.removeItem(`exam_questions_${studentId}`);
      localStorage.removeItem(`exam_answers_${studentId}`);
      localStorage.removeItem(`exam_subject_index_${studentId}`);
      localStorage.removeItem(`exam_question_index_${studentId}`);
      localStorage.removeItem(`exam_subject_ids_${studentId}`);
      
      // Navigate home after 6 seconds
      setTimeout(() => {
        navigate("/");
      }, 6000);
      
    } catch (err) {
      console.error("Submit error:", err);
      alert("Submission failed.");
    }
  };

  const downloadReport = (): void => {
    if (examSubmitResponse?.submission_id) {
      window.location.href = `http://127.0.0.1:8000/api/generate_pdf/${examSubmitResponse.submission_id}/`;
    }
  };

  const toggleSubjectSelection = (): void => {
    setShowSubjectSelection(!showSubjectSelection);
  };

  const handleExtraSubjectChange = (subjectId: number): void => {
    setSelectedExtraSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const handleAddSubjects = async (): Promise<void> => {
    if (selectedExtraSubjects.length === 0) {
      alert("Please select at least one subject to add.");
      return;
    }

    setLoading(true);
    
    // Get questions for new subjects
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/get_random_questions/", {
        subject_ids: selectedExtraSubjects,
        student_id: parseInt(studentId)
      });
      
      // Format the new questions
      const newSubjectQuestions = Object.entries(response.data).map(([subject, data]: [string, any]) => {
        const questions = data.questions || data;
        return {
          subject,
          questions: questions,
          levelCounts: data.level_counts || {}
        };
      });
      
      // Update the state with new questions
      setQuestionsBySubject(prev => [...prev, ...newSubjectQuestions]);
      
      // Update the list of subject IDs
      const updatedSubjectIds = [...subjectIds, ...selectedExtraSubjects.map(id => id.toString())];
      
      // Update the URL
      const newUrl = `${window.location.pathname}?student_id=${studentId}&subject_ids=${updatedSubjectIds.join(',')}`;
      window.history.replaceState(null, '', newUrl);
      
      // Update localStorage
      localStorage.setItem(`exam_subject_ids_${studentId}`, JSON.stringify(updatedSubjectIds));
      
      // Hide the subject selection
      setShowSubjectSelection(false);
      setSelectedExtraSubjects([]);
    } catch (err) {
      console.error("Error adding subjects:", err);
      alert("Failed to add new subjects.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#01acef] to-white">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questionsBySubject.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#01acef] to-white">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <p className="text-xl text-gray-700">No questions available.</p>
        </div>
      </div>
    );
  }

  const currentSubject = questionsBySubject[currentSubjectIndex];
  const currentQuestion = currentSubject?.questions[currentQuestionIndex];
  const totalQuestions = currentSubject?.questions.length || 0;
  
  // Calculate overall progress
  const subjectProgress = ((currentSubjectIndex) / questionsBySubject.length) * 100;
  const questionProgress = (currentQuestionIndex / totalQuestions) * (100 / questionsBySubject.length);
  const totalProgress = subjectProgress + questionProgress;

  const getAnsweredCount = (): number => {
    return currentSubject?.questions.filter(q => answers[q.id]).length || 0;
  };

  const renderQuestionIndicators = () => {
    return currentSubject?.questions.map((q, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentQuestionIndex(idx)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          idx === currentQuestionIndex
            ? 'bg-blue-600 text-white'
            : answers[q.id]
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {idx + 1}
      </button>
    ));
  };

  // Calculate scoring percentage
  const scorePercentage = examSubmitResponse?.score && examSubmitResponse?.total 
    ? Math.round((examSubmitResponse.score / examSubmitResponse.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01acef] to-white">
      {/* Subject Complete Alert */}
      {showSubjectCompleteAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="relative">
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-auto transform transition-all animate-bounce-in">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Subject Complete!</h3>
                <p className="text-gray-600 mb-4">
                  You have successfully completed <span className="font-semibold text-[#2d2f93]">{currentSubject?.subject}</span>.
                </p>
                <p className="text-sm text-gray-500">Moving to next subject...</p>
                <div className="mt-4 w-full bg-gray-200 h-1 rounded-full">
                  <div className="bg-green-500 h-1 rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Complete Alert */}

{/* Exam Complete Alert */}
{/* Exam Complete Alert */}
{showExamCompleteAlert && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
    <div className="relative max-w-lg w-full mx-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl transform transition-all animate-fadeInUp overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-8 bg-yellow-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute top-0 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-purple-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-0 left-2/3 w-2 h-8 bg-pink-400 rounded-full animate-fadeFloat" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-0 left-3/4 w-3 h-3 bg-blue-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.3s' }}></div>
          
          <div className="absolute bottom-10 right-1/4 w-2 h-8 bg-yellow-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute bottom-8 right-1/3 w-3 h-3 bg-green-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-12 right-1/2 w-4 h-4 bg-purple-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute bottom-6 right-2/3 w-2 h-8 bg-pink-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.9s' }}></div>
          <div className="absolute bottom-14 right-3/4 w-3 h-3 bg-blue-400 rounded-full animate-fadeFloat" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        {/* Central Icon */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto flex items-center justify-center mb-2">
            <div className="absolute w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-ping"></div>
            <div className="absolute w-32 h-32 bg-[#01acef] bg-opacity-30 rounded-full"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#01acef] to-[#2d2f93] rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 text-white">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Header Text */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#2d2f93] mb-3 animate-fadeIn">Thank You!</h2>
          <p className="text-gray-600 text-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Your exam has been successfully submitted.
          </p>
        </div>
        
        {/* Message Box */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-inner animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">
              We appreciate your time and effort in completing this assessment.
            </p>
            <p className="text-sm text-gray-500">
              Your results will be processed shortly.
            </p>
          </div>
        </div>
        
        {/* Auto Redirect Notice */}
        <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-gray-500">You will be redirected to the home page shortly...</p>
          <div className="mt-2 w-full bg-gray-200 h-1 rounded-full">
            <div className="bg-[#01acef] h-1 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-[#2d2f93] mb-4 sm:mb-0">
            {currentSubject ? currentSubject.subject : "Exam"}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{getAnsweredCount()}</span> of {totalQuestions} answered
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Subject {currentSubjectIndex + 1}</span> of {questionsBySubject.length}
            </div>
            <button 
              onClick={toggleSubjectSelection}
              className="text-sm px-3 py-1 bg-[#2d2f93] text-white rounded-full hover:bg-[#1e2171] transition"
            >
              Add Subject
            </button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-green-500 h-1 transition-all duration-300" 
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto p-4">
        {/* Subject Selection Modal */}
        {showSubjectSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-[#2d2f93]">Select Additional Subjects</h2>
              
              {availableSubjects.length === 0 ? (
                <p className="text-gray-600">No more subjects available for your class/board.</p>
              ) : (
                <div className="space-y-2 mb-6">
                  {availableSubjects.map(subject => (
                    <label 
                      key={subject.id} 
                      className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-blue-50 transition"
                    >
                      <input 
                        type="checkbox" 
                        className="mr-3 h-5 w-5 text-blue-600" 
                        checked={selectedExtraSubjects.includes(subject.id)}
                        onChange={() => handleExtraSubjectChange(subject.id)}
                      />
                      <span>{subject.name}</span>
                    </label>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-4">
                <button 
                  onClick={() => setShowSubjectSelection(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSubjects}
                  disabled={selectedExtraSubjects.length === 0}
                  className={`px-4 py-2 rounded-lg text-white ${
                    selectedExtraSubjects.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#2d2f93] hover:bg-[#1e2171]'
                  } transition`}
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question number indicators */}
        <div className="flex flex-wrap gap-2 justify-center my-6">
          {renderQuestionIndicators()}
        </div>

        {/* Question card */}
        {currentQuestion && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 my-6 transition-all">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-[#2d2f93] text-white py-1 px-4 rounded-full text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              <p className="text-xl font-medium text-gray-800 leading-relaxed">
                {currentQuestion.question_text}
              </p>
            </div>

            {currentQuestion.question_image && (
              <div className="mb-8 flex justify-center">
                <img
                  src={`http://127.0.0.1:8000${currentQuestion.question_image}`}
                  alt="Question Visual"
                  className="rounded-lg shadow-md max-h-64 object-contain"
                />
              </div>
            )}

            <div className="space-y-3 mt-6">
              {currentQuestion.options &&
                Object.entries(currentQuestion.options).map(([key, val]) => (
                  <label
                    key={key}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers[currentQuestion.id] === key
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleAnswerChange(currentQuestion.id, key)}
                  >
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                        answers[currentQuestion.id] === key 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion.id] === key && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg">{val}</span>
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 mb-16">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-xl flex items-center ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white text-[#2d2f93] hover:bg-gray-100'
            } shadow-md transition`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          
          <button
            onClick={handleNextQuestion}
            className="bg-[#2d2f93] hover:bg-[#1e2171] text-white font-medium px-6 py-3 rounded-xl shadow-lg flex items-center transition"
          >
            {currentQuestionIndex < totalQuestions - 1 ? (
              <>
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </>
            ) : currentSubjectIndex < questionsBySubject.length - 1 ? (
              "Next Subject"
            ) : (
              "Submit Answers"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OMRPage;