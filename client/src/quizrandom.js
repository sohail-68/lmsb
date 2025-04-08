import React, { useEffect, useState } from "react";
import { getQuizzesByCourse, submitQuiz } from "../services/quizService";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  LinearProgress,
  Box,
} from "@mui/material";
import { CheckCircle, ErrorOutline } from "@mui/icons-material";

const QuizPage = () => {
  const { id: courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submittedQuizzes, setSubmittedQuizzes] = useState({}); // Track submitted quizzes

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzesByCourse(courseId);
        setQuizzes(data.quizzes);
        if (data.quizzes.length > 0) {
          setAnswers(
            new Array(
              data.quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)
            ).fill(null)
          );
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  const handleSelectAnswer = (quizIndex, questionIndex, selectedOption) => {
    const questionPosition = quizzes
      .slice(0, quizIndex)
      .reduce((acc, q) => acc + q.questions.length, 0) + questionIndex;
      console.log(questionPosition);
      
    let newAnswers = [...answers];
    newAnswers[questionPosition] = selectedOption;
    setAnswers(newAnswers);
  };
console.log(answers);

  const handleSubmit = async (quizId, quizIndex) => {
    if (submittedQuizzes[quizId]) return; // Prevent duplicate submissions

    try {
      const quizStartIndex = quizzes
        .slice(0, quizIndex)
        .reduce((acc, q) => acc + q.questions.length, 0);
        console.log(quizStartIndex);
        console.log(
          quizzes[quizIndex]
        );
        console.log([1,2,3,4].slice(2,3));
        
      const quizAnswers = answers.slice(
        quizStartIndex,
        quizStartIndex + quizzes[quizIndex].questions.length
      );
      const response = await submitQuiz(quizId, quizAnswers);
      if (response.success) {
        setTotalScore((prevScore) => prevScore + response.score);
        setSubmitted(true);
        setSubmittedQuizzes((prev) => ({ ...prev, [quizId]: true })); // Mark quiz as submitted
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) return <Typography align="center">⏳ Loading quizzes...</Typography>;
  if (!quizzes.length)
    return (
      <Typography align="center" color="error">
        ⚠️ No quizzes available for this course.
      </Typography>
    );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        📝 Take Your Quiz
      </Typography>

      {quizzes.map((quiz, quizIndex) => (
        <Card key={quiz._id} sx={{ mb: 4, p: 2, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              {quiz.title}
            </Typography>
            {quiz.questions.map((q, questionIndex) => (
              <Box key={q._id} sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  🎯 {q.question}
                </Typography>
                <Grid container spacing={2}>
                  {q.options.map((option, optionIndex) => (
                    <Grid item xs={12} sm={6} key={optionIndex}>
                      <Button
                        fullWidth
                        variant={
                          answers[
                            quizIndex * quiz.questions.length + questionIndex
                          ] === option
                            ? "contained"
                            : "outlined"
                        }
                        color={
                          answers[
                            quizIndex * quiz.questions.length + questionIndex
                          ] === option
                            ? "success"
                            : "inherit"
                        }
                        onClick={() =>
                          handleSelectAnswer(quizIndex, questionIndex, option)
                        }
                        sx={{ py: 1.5, borderRadius: 2 }}
                        disabled={submittedQuizzes[quiz._id]} // Disable after submission
                      >
                        {option}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleSubmit(quiz._id, quizIndex)}
              sx={{ mt: 3, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
              disabled={submittedQuizzes[quiz._id]} // Disable button after submission
            >
              🚀 {submittedQuizzes[quiz._id] ? "Submitted ✅" : "Submit Quiz"}
            </Button>
          </CardContent>
        </Card>
      ))}

      {submitted && (
        <Card sx={{ mt: 4, p: 3, textAlign: "center", bgcolor: "#f5f5f5" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Your Score 🎯
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              (totalScore /
                quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)) *
              100
            }
            sx={{ height: 10, borderRadius: 5, mb: 2 }}
          />
          <Typography variant="h6" color="success.main">
            {totalScore} / {quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)}
          </Typography>
          <Typography variant="body1" mt={1}>
            {totalScore >=
            quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0) /
              2 ? (
              <>
                <CheckCircle color="success" /> Great job! 🎉
              </>
            ) : (
              <>
                <ErrorOutline color="error" /> Keep practicing! 💪
              </>
            )}
          </Typography>
        </Card>
      )}
    </Container>
  );
};

export default QuizPage;
