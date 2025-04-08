import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { Add, Delete, Quiz, EmojiEvents } from '@mui/icons-material';
import { createQuiz } from '../services/quizService';
import { useParams } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
  ]);
  const params = useParams();
console.log(params);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQuiz(params.id, { title, questions });
      alert('🎉 Quiz Created Successfully!');
      setTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
console.log(questions);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // py: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 5,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Quiz sx={{ fontSize: '40px', color: '#ffeb3b', mr: 1 }} />
            Create Your Quiz
          </Typography>

          <TextField
            fullWidth
            label="Quiz Title 🎯"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{
              mb: 3,
              backgroundColor: '#ffffff',
              borderRadius: 2,
              input: { color: '/#region ' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ddd' },
                '&:hover fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#6200ea' },
              },
            }}
          />



<form onSubmit={handleSubmit}>
  {questions.map((q, index) => (
    <Card
      key={index}
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 3,
        backgroundColor: '#ffffff', // White background for questions
        boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)', // Light shadow for a softer effect
        transition: '0.3s',
        ':hover': { transform: 'scale(1.02)' },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={11}>
          <TextField
            fullWidth
            label={`Question ${index + 1} 🧐`}
            variant="outlined"
            value={q.question}
            onChange={(e) => {
              let newQuestions = [...questions];
              newQuestions[index].question = e.target.value;
              setQuestions(newQuestions);
            }}
            required
            sx={{
              backgroundColor: '#f9f9f9', // Light background for question input
              borderRadius: 2,
              input: { color: '/#region ' },
              // Dark text for readability
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
                '&:hover fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#6200ea' },
              },
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => handleRemoveQuestion(index)} color="error">
            <Delete />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        {q.options.map((opt, optIndex) => (
          <Grid item xs={6} key={optIndex}>
            <TextField
              fullWidth
              label={`Option ${optIndex + 1} 🎭`}
              variant="outlined"
              value={opt}
              onChange={(e) => {
                let newQuestions = [...questions];
                newQuestions[index].options[optIndex] = e.target.value;
                setQuestions(newQuestions);
              }}
              required
              sx={{
                backgroundColor: '#f9f9f9', // Light background for options input
                borderRadius: 2,
                input: { color: '/#region ' },

                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#6200ea' },
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      <TextField
        fullWidth
        label="Correct Answer ✅"
        variant="outlined"
        value={q.correctAnswer}
        onChange={(e) => {
          let newQuestions = [...questions];
          newQuestions[index].correctAnswer = e.target.value;
          setQuestions(newQuestions);
        }}
        required
        sx={{
          mt: 2,
          backgroundColor: '#f9f9f9', // Light background for correct answer input
          borderRadius: 2,
          input: { color: '/#region ' },

          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#ccc' },
            '&:hover fieldset': { borderColor: '#888' },
            '&.Mui-focused fieldset': { borderColor: '#6200ea' },
          },
        }}
      />
    </Card>
  ))}

  <Button
    variant="contained"
    color="secondary"
    startIcon={<Add />}
    fullWidth
    sx={{
      mt: 2,
      mb: 2,
      fontWeight: 'bold',
      backgroundColor: '#ff9800', // Orange background for the add question button
      color: '#fff', // White text for visibility
      transition: '0.3s',
      ':hover': { backgroundColor: '#f57c00', transform: 'scale(1.05)' },
    }}
    onClick={handleAddQuestion}
  >
    Add Question
  </Button>

  <Button
    type="submit"
    variant="contained"
    color="primary"
    startIcon={<EmojiEvents />}
    fullWidth
    sx={{
      fontSize: '16px',
      fontWeight: 'bold',
      backgroundColor: '#4CAF50', // Green for the "Create Quiz" button
      color: '#fff', // White text for visibility
      transition: '0.3s',
      ':hover': { backgroundColor: '#388E3C', transform: 'scale(1.05)' },
    }}
  >
    Create Quiz
  </Button>
</form>

        </Paper>
      </Container>
    </Box>
  );
};

export default CreateQuiz;
