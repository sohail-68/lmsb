const Quiz = require('../models/quize');
const User = require('../models/User');

// ✅ Create a quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const courseId = req.params.courseId;

    const quiz = await Quiz.create({
      course: courseId,
      title,
      questions
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get quizzes for a course
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Submit quiz and calculate score
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Answers submitted by user
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      console.log("qution",question);
      console.log("answers",answers);
      
      if (answers[index] === question.correctAnswer) {
        score++;
      } 
      else{
        score--
      }
    });
;

    res.status(200).json({ success: true, score, total: quiz.questions.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Get quizzes by title (case-insensitive search)
exports.getQuizzesByTitle = async (req, res) => {
  try {
    const { title } = req.query; // Get title from query params

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Use a case-insensitive regex to match titles
    const quizzes = await Quiz.find({ title: { $regex: title, $options: 'i' } });

    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
