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
   <Box
  sx={{
    textAlign: "center",
    py: 6,
    px: 3,
    borderRadius: 4,
    background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
    color: "#333",
  }}
>
  {/* Header */}
  <Typography
    variant="h4"
    gutterBottom
    sx={{ fontWeight: "bold", color: "primary.main" }}
  >
    📝 Take Your Quiz
  </Typography>

  {/* Quiz Questions */}
  <Grid container spacing={4} justifyContent="center">
    {quizzes.map((quiz, quizIndex) =>
      quiz.questions.map((q, questionIndex) => (
        <Grid item xs={12} md={6} key={q._id}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              textAlign: "left",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "secondary.main" }}
              >
                📚 {quiz.title}
              </Typography>

              {/* Question */}
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  🎯 {q.question}
                </Typography>
              </Box>

              {/* Options */}
              <Grid container spacing={2} mt={1}>
                {q.options.map((option, optionIndex) => (
                  <Grid item xs={12} key={optionIndex}>
                    <Button
                      fullWidth
                      variant={
                        answers[quizIndex][questionIndex] === option
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        answers[quizIndex][questionIndex] === option
                          ? "success"
                          : "inherit"
                      }
                      onClick={() =>
                        handleSelectAnswer(quizIndex, questionIndex, option)
                      }
                      disabled={submittedQuizzes[quiz._id]}
                      sx={{
                        textTransform: "none",
                        fontSize: "1rem",
                        borderRadius: "12px",
                        py: 1.5,
                        justifyContent: "flex-start",
                        boxShadow:
                          answers[quizIndex][questionIndex] === option
                            ? "0 4px 12px rgba(0,0,0,0.15)"
                            : "none",
                        "&:hover": {
                          backgroundColor: "#f1f3f5",
                        },
                      }}
                    >
                      {answers[quizIndex][questionIndex] === option ? (
                        <CheckCircle sx={{ mr: 1, color: "green" }} />
                      ) : (
                        <Cancel sx={{ mr: 1, color: "grey.500" }} />
                      )}
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              {/* Submit Button */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(quiz._id, quizIndex)}
                disabled={submittedQuizzes[quiz._id]}
                sx={{
                  mt: 3,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  py: 1.5,
                  borderRadius: "10px",
                }}
              >
                🚀{" "}
                {submittedQuizzes[quiz._id] ? "Submitted ✅" : "Submit Quiz"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))
    )}
  </Grid>

  {/* Results Section */}
  {submitted && (
    <Card
      sx={{
        mt: 6,
        p: 4,
        textAlign: "center",
        borderRadius: 4,
        background: "linear-gradient(135deg, #e0f7fa, #e1f5fe)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
      >
        🎯 Your Score
      </Typography>

      <LinearProgress
        variant="determinate"
        value={(totalScore / totalQuestions) * 100}
        sx={{
          height: 12,
          borderRadius: 6,
          mb: 2,
          backgroundColor: "#f0f0f0",
        }}
      />

      <Typography variant="h6" sx={{ fontWeight: "bold", color: "success.main" }}>
        {totalScore} / {totalQuestions}
      </Typography>

      <Typography variant="body1" mt={2}>
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
