import React, { useEffect, useState } from "react";
import { getQuizzesByCourse, submitQuiz } from "../services/quizService";
import { useParams } from "react-router-dom";
import { Container, Card, CardContent, Typography, Button, Grid, Box, LinearProgress } from "@mui/material";
import { EmojiEvents, SentimentDissatisfied, CheckCircle, Cancel } from "@mui/icons-material";

const QuizPage = () => {
  const { id: courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzesByCourse(courseId);
        setQuizzes(data.quizzes);
        setAnswers(data.quizzes.map((quiz) => new Array(quiz.questions.length).fill(null)));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId]);
console.log(quizzes);

  const handleSelectAnswer = (quizIndex, questionIndex, selectedOption) => {
    let newAnswers = [...answers];
    newAnswers[quizIndex][questionIndex] = selectedOption;
    setAnswers(newAnswers);
    console.log("quizindex",quizIndex);
    console.log("questionIndex",questionIndex);
    console.log("selectedOption",selectedOption);
    
  };
console.log(answers);

  const handleSubmit = async (quizId, quizIndex) => {
    if (submittedQuizzes[quizId]) return;
    try {
      const response = await submitQuiz(quizId, answers[quizIndex]);
      if (response.success) {
        setTotalScore((prevScore) => prevScore + response.score);
        setSubmitted(true);
        setSubmittedQuizzes({ ...submittedQuizzes, [quizId]: true });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) return <Typography align="center">⏳ Loading quizzes...</Typography>;
  if (!quizzes.length) return <Typography align="center">⚠️ No quizzes available.</Typography>;

  const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);

  return (
    <Box  sx={{ textAlign: "center", padding: 4, borderRadius: 3, background: "linear-gradient(135deg, #f3e7e9, #e3eeff)", color: "#333" }}>
      <Typography variant="h4" gutterBottom color="primary">📝 Take Your Quiz</Typography>
      <Grid container spacing={4} justifyContent="center">
        {quizzes.map((quiz, quizIndex) => (
          quiz.questions.map((q, questionIndex) => (
            <Grid item xs={12} md={6} key={q._id}>
              <Card sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg, #ffdde1, #ee9ca7)", boxShadow: 5, color: "#333" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary">📚 {quiz.title}</Typography>
                  <Box sx={{ mb: 2, p: 2, borderRadius: 2, background: "linear-gradient(135deg, #f6d365, #fda085)", boxShadow: 2 }}>
                    <Typography variant="body1">🎯 {q.question}</Typography>
                    <Grid container spacing={2} mt={1}>
                      {q.options.map((option, optionIndex) => (
                        <Grid item xs={12} key={optionIndex}>
                          <Button
                            fullWidth
                            variant={answers[quizIndex][questionIndex] === option ? "contained" : "outlined"}
                            color={answers[quizIndex][questionIndex] === option ? "success" : "inherit"}
                            onClick={() => handleSelectAnswer(quizIndex, questionIndex, option)}
                            disabled={submittedQuizzes[quiz._id]}
                            sx={{ textTransform: "none", fontSize: "1rem", borderColor: "#555", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "20px", padding: "12px", transition: "all 0.3s ease", '&:hover': { backgroundColor: '#ffdeeb', transform: 'scale(1.05)' } }}
                          >
                            {answers[quizIndex][questionIndex] === option ? <CheckCircle sx={{ mr: 1, color: "green" }} /> : <Cancel sx={{ mr: 1, color: "red" }} />} {option}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit(quiz._id, quizIndex)}
                    disabled={submittedQuizzes[quiz._id]}
                    sx={{ mt: 2, fontSize: "1rem", fontWeight: "bold" }}
                  >
                    🚀 {submittedQuizzes[quiz._id] ? "Submitted ✅" : "Submit Quiz"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ))}
      </Grid>
      {submitted && (
        <Card sx={{ mt: 4, p: 3, textAlign: "center", borderRadius: 3, background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", boxShadow: 3, color: "#000" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            🎯 Your Score
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(totalScore / totalQuestions) * 100}
            sx={{ height: 10, borderRadius: 5, mb: 2, backgroundColor: "#f0f0f0" }}
          />
          <Typography variant="h6" color="success.main">
            {totalScore} / {totalQuestions}
          </Typography>
          <Typography variant="body1" mt={1}>
            {totalScore >= totalQuestions / 2 ? (
              <>
                <EmojiEvents color="success" /> Fantastic job! 🌟
              </>
            ) : (
              <>
                <SentimentDissatisfied color="error" /> Keep trying! 💪
              </>
            )}
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default QuizPage;
