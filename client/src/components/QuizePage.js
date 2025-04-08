import React, { useEffect, useState } from "react";
import { getQuizzesByCourse, submitQuiz } from "../services/quizService";
import { useLocation, useParams } from "react-router-dom";
import { 
  Container, Card, CardContent, Typography, Button, LinearProgress, Box, Grid 
} from "@mui/material";

const QuizPage = () => {
  const { id } = useParams();
  const location = useLocation();
  console.log(location);
  
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
const ids=location.state.courseId;
console.log(ids);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (!location.state || !location.state.courseId || !location.state.quiz) {
          console.error("No course ID or quiz data provided in location state");
          return;
        }

        const data = await getQuizzesByCourse(ids);
        const filteredQuiz = data.quizzes.find(q => q._id === location.state.quiz._id);

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

  if (loading) return <Typography align="center">⏳ Loading quiz...</Typography>;
  if (!selectedQuiz) return <Typography align="center" color="error">⚠️ Quiz not found.</Typography>;

  return (
    <Container maxWidth="md">
      {/* Quiz Title */}
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        📝 {selectedQuiz?.title || "Quiz"}
      </Typography>

      {/* Progress Bar */}
      <Box mb={3}>
        <LinearProgress 
          variant="determinate" 
          value={(answers.filter(Boolean).length / selectedQuiz.questions.length) * 100} 
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography align="center" variant="body1" mt={1}>
          {Math.round((answers.filter(Boolean).length / selectedQuiz.questions.length) * 100)}% Completed
        </Typography>
      </Box>

      {/* Quiz Questions */}
      {selectedQuiz.questions.map((q, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
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
                    sx={{ py: 1.5 }}
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
        color="secondary" 
        size="large" 
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        🚀 Submit Quiz
      </Button>

      {/* Score Display */}
      {score !== null && (
        <Card sx={{ mt: 4, p: 3, textAlign: "center", bgcolor: "#f5f5f5" }}>
          <Typography variant="h5" color={score >= selectedQuiz.questions.length / 2 ? "success.main" : "error.main"}>
            🎉 Your Score: {score} / {selectedQuiz.questions.length}
          </Typography>
          <Typography variant="body1" mt={1}>
            {score >= selectedQuiz.questions.length / 2 ? "🔥 Awesome job!" : "📖 Keep practicing, you got this!"}
          </Typography>
        </Card>
      )}
    </Container>
  );
};

export default QuizPage;
