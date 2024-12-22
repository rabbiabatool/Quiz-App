import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import './Quizes.css'

export const Quizes = () => {
  const [quizes, setQuizes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  
  //   const [userScore, setUserScore] = useState(0);
  const navigate = useNavigate(); // Navigation hook
  const [isDisabled, setDisabled] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeline, setTimeline] = useState(0);
  const [remainingQuizes, setRemainingQuizes] = useState([]);
  // const [timeLeft, setTimeLeft] = useState(null);
  const [callingStatus, setCallingStatus] = useState(false);

  useEffect(() => {
    // Disable back and forward buttons
    const preventBackForward = () => {
      window.history.pushState(null, document.title);
      window.history.replaceState(null, document.title);
    }

    //   // Trap the back navigation in the history stack
    window.onpopstate = () => {
      window.history.pushState(null, document.title);
      window.history.replaceState(null, document.title);
    };


    // // Call the function to disable navigation
    preventBackForward();

    // Cleanup function
    return () => {
      window.onpopstate = null;  // Remove the event listener when component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {


      const response = await fetch('http://localhost:5000/showStatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setCallingStatus(data.showContent);
      console.log("status", data.showContent);
      if (!data.showContent) {
        navigate("/Result");

      }


    }
    fetchStatus();
  }, []);


  const fetchQuizzes = async () => {
    const response = await fetch("http://localhost:5000/getQuiz", {
      method: "GET",
      headers: {
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    setQuizes(data.QuizArray);
    setTimeline(data.deadline);

    const completedResponse = await fetch('http://localhost:5000/getCompletedQuiz', {
      method: 'GET',
      headers: {
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
    });
    const completedData = await completedResponse.json();
    const completedQuiz = completedData.CompletedQuizes;

    // Filter quizzes after both have been fetched and set
    setRemainingQuizes(data.QuizArray.filter((q) => !completedQuiz.includes(q.Title)));
    console.log("Remaining quizes", data.QuizArray.filter((q) => !completedQuiz.includes(q.Title)));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);


  const currentQuiz = remainingQuizes[currentQuizIndex];

  const addtoResults = async () => {
    if (answers.length !== currentQuiz.questions.length) {
      // alert("Please answer all questions before submitting!");
      console.log("Please answer all questions before submitting!");
      return;
    }
    console.log("answers",answers);
    // Send updated state to the server
    fetch('http://localhost:5000/AddtoResult', {
      method: 'POST',
      headers: {
        'auth-token': `${localStorage.getItem('auth-token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ QuestionAnswers: answers, Title: currentQuiz.Title }),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));

    const response = await fetch('http://localhost:5000/AddCompletedQuiz', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quizTitle: currentQuiz.quizTitle })
    });
    const data = await response.json();
    if (data.success) {
      console.log(data.success);
    }
    else {
      console.log(data.error);
    }

  }
  const handleQuizSubmission = async () => {
    // Implement answer validation and score calculation logic here
    // Update userScore based on the validation

    // Check if it's the last quiz
    if (currentQuizIndex + 1 === remainingQuizes.length) {
      // Redirect to the next page with user score
      alert("Submitted successfully");
      navigate("/Result");
      setDisabled(true);

    } else {

      await addtoResults();
      setCurrentQuizIndex(currentQuizIndex + 1);
      alert("Submitted successfully");

    }
  };

  // Parse duration from string like "10 minutes", "1 hour", "30 seconds"
  function parseDuration(durationString) {
    const match = durationString.match(/(\d+)\s*(hours?|minutes?|seconds?)/i);
    if (match) {
      const quantity = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      switch (unit) {
        case 'hour': // Single hour case
        case 'hours': // Plural hour case
          return quantity * 60 * 60;
        case 'minute': // Single minute case
        case 'minutes': // Plural minute case
          return quantity * 60;
        case 'second': // Single second case
        case 'seconds': // Plural second case
          return quantity;
        default:
          return 0; // Handle invalid duration format
      }
    } else {
      return 0; // Handle invalid duration format
    }
  }

  const [isTimeoutSet, setIsTimeoutSet] = useState(false); // New state to track timeout status

  const timeoutRef = useRef(null);

  
  useEffect(() => {
    
      if (!currentQuiz || currentQuiz.duration <= 0) {
        return;
      }
    
      const durationInSeconds = parseDuration(currentQuiz.duration);
      if (durationInSeconds > 0 && !isTimeoutSet) {
        setIsTimeoutSet(true);
    
        timeoutRef.current = setTimeout(async() => {
          await handleQuizSubmission();
          setIsTimeoutSet(false);
        }, durationInSeconds * 1000);
    
        return () => {
          clearTimeout(timeoutRef.current);
          setIsTimeoutSet(false);
        };
      }
    
  }, [currentQuiz]);
  


  if (!currentQuiz) return null; // Handle loading state

  const changeHandler = (e, question) => {
    const answerObj = {
      questionText: question.questionText,
      userAnswer: e.target.value,
    };

    // Update state and ensure fetch uses the updated state
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers, answerObj];
      return updatedAnswers; // Update the state with new answers
    });
  };


  return (
    <>

      <div className="quiz">
        {/* Display the current quiz based on the index */}
        <div className="headings-div">
          <h2 className="title">{currentQuiz.Title}</h2>
          <h2>Time Allowed: {currentQuiz.duration}</h2>
        </div>
        <div className="question-answer">
          {currentQuiz.questions.map((question, index) => (
            <div key={index}>
              <h3>{index}-{question.questionText}</h3>
              <div className="options">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <input type="radio" name={`answer_${index}`} value={option.optionText}
                      onChange={(e) => changeHandler(e, question)} />
                    {option.optionText}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="submit-btn" onClick={handleQuizSubmission} disabled={isDisabled}>Submit</button>
        </div>
      </div>

    </>

  );
};