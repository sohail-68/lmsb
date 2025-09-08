import React, { useEffect, useState } from "react";
import { getQuizzesByCourse, submitQuiz } from "../services/quizService";
import { useLocation, useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Box,
  Grid,
} from "@mui/material";

const QuizPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  const ids = location.state?.courseId;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (!location.state || !location.state.courseId || !location.state.quiz) {
          console.error("No course ID or quiz data provided in location state");
          return;
        }

        const data = await getQuizzesByCourse(ids);
        const filteredQuiz = data.quizzes.find((q) => q._id === location.state.quiz._id);

        if (filteredQuiz) {
          setSelectedQuiz(filteredQuiz);
          setAnswers(new Array(filteredQuiz.questions.length).fill(null));
        } else {
          console.warn("Quiz with the specified ID not found");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [id, location.state]);

  const handleSelectAnswer = (questionIndex, selectedOption) => {
    let newAnswers = [...answers];
    newAnswers[questionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const result = await submitQuiz(id, answers);
      setScore(result.score);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading)
    return (
      <Typography align="center" sx={{ mt: 5, color: "#1e3a8a" }}>
        ⏳ Loading quiz...
      </Typography>
    );
  if (!selectedQuiz)
    return (
      <Typography align="center" color="error" sx={{ mt: 5 }}>
        ⚠️ Quiz not found.
      </Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: 2,
      }}
      
    >
      <Container maxWidth="md">
        {/* Quiz Title */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#1e3a8a",
            mb: 4,
            textShadow: "2px 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          📝 {selectedQuiz?.title || "Quiz"}
        </Typography>

        {/* Progress Bar */}
        <Box mb={5}>
          <LinearProgress
            variant="determinate"
            value={(answers.filter(Boolean).length / selectedQuiz.questions.length) * 100}
            sx={{
              height: 12,
              borderRadius: 6,
             
            }}
          />
          <Typography align="center" variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
            {Math.round((answers.filter(Boolean).length / selectedQuiz.questions.length) * 100)}% Completed
          </Typography>
        </Box>

        {/* Quiz Questions */}
        {selectedQuiz.questions.map((q, index) => (
          <Card
            key={index}
            sx={{
              mb: 4,
              borderRadius: "16px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.15)" },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1e3a8a" }}
              >
                🎯 {q.title}
              </Typography>
              <Grid container spacing={2}>
                {q.options.map((option, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Button
                      fullWidth
                      variant={answers[index] === option ? "contained" : "outlined"}
                      color={answers[index] === option ? "primary" : "inherit"}
                      onClick={() => handleSelectAnswer(index, option)}
                      sx={{
                        py: 1.5,
                        borderRadius: "12px",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ))}

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{
            mt: 3,
            py: 2,
            fontWeight: "bold",
            fontSize: "1.1rem",
            background: "linear-gradient(90deg,#3f51b5,#1e3a8a)",
          }}
        >
          🚀 Submit Quiz
        </Button>

        {/* Score Display */}
        {score !== null && (
          <Card
            sx={{
              mt: 5,
              p: 4,
              textAlign: "center",
              borderRadius: "20px",
              background: score >= selectedQuiz.questions.length / 2
                ? "linear-gradient(135deg,#e8f5e9,#a5d6a7)"
                : "linear-gradient(135deg,#ffebee,#ef9a9a)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color:
                  score >= selectedQuiz.questions.length / 2 ? "#2e7d32" : "#c62828",
              }}
            >
              🎉 Your Score: {score} / {selectedQuiz.questions.length}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, fontWeight: "500" }}>
              {score >= selectedQuiz.questions.length / 2
                ? "🔥 Awesome job!"
                : "📖 Keep practicing, you got this!"}
            </Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default QuizPage;
