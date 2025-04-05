document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const introScreen = document.getElementById('intro-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const questionCountElement = document.getElementById('question-count');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const performanceCommentElement = document.getElementById('performance-comment');
    const progressBar = document.getElementById('progress-bar');

    // Quiz variables
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let selectedOption = null;

    // Quiz questions
    const quizQuestions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris",
            explanation: "Paris is the capital and most populous city of France."
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars",
            explanation: "Mars is often called the 'Red Planet' because of its reddish appearance."
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            answer: "Blue Whale",
            explanation: "The blue whale is the largest animal known to have ever existed."
        },
        {
            question: "Which language is primarily used for web development?",
            options: ["Java", "Python", "JavaScript", "C++"],
            answer: "JavaScript",
            explanation: "JavaScript is the programming language of the Web alongside HTML and CSS."
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            answer: "Au",
            explanation: "The symbol Au comes from the Latin word for gold, 'aurum'."
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            answer: "Leonardo da Vinci",
            explanation: "The Mona Lisa was painted by Leonardo da Vinci in the early 16th century."
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            answer: "Pacific Ocean",
            explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions."
        },
        {
            question: "Which country is home to the kangaroo?",
            options: ["New Zealand", "South Africa", "Australia", "Brazil"],
            answer: "Australia",
            explanation: "Kangaroos are marsupials native to Australia."
        },
        {
            question: "What is the main component of the Sun?",
            options: ["Liquid lava", "Hydrogen", "Oxygen", "Carbon"],
            answer: "Hydrogen",
            explanation: "The Sun is composed primarily of hydrogen (about 70%) and helium (about 28%)."
        },
        {
            question: "Which year did World War II end?",
            options: ["1943", "1945", "1947", "1950"],
            answer: "1945",
            explanation: "World War II ended in 1945 with the surrender of Germany and Japan."
        }
    ];

    // Initialize the quiz
    function initQuiz() {
        // Shuffle questions for variety
        questions = [...quizQuestions].sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        score = 0;
        updateScore();
        showQuestion();
    }

    // Display the current question
    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        const questionNo = currentQuestionIndex + 1;
        const totalQuestions = questions.length;

        questionCountElement.textContent = `Question ${questionNo} of ${totalQuestions}`;
        progressBar.style.width = `${(questionNo / totalQuestions) * 100}%`;
        questionElement.textContent = currentQuestion.question;

        // Shuffle options to randomize their order
        const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option', 'btn', 'btn-outline-primary', 'w-100', 'text-start');
            button.addEventListener('click', () => selectOption(button, option));
            optionsElement.appendChild(button);
        });

        nextBtn.disabled = true;
    }

    // Reset the question state
    function resetState() {
        while (optionsElement.firstChild) {
            optionsElement.removeChild(optionsElement.firstChild);
        }
        feedbackElement.style.display = 'none';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        selectedOption = null;
    }

    // Handle option selection
    function selectOption(button, option) {
        // If an option is already selected, do nothing
        if (selectedOption !== null) return;

        selectedOption = option;
        const currentQuestion = questions[currentQuestionIndex];

        // Highlight selected option
        const options = optionsElement.querySelectorAll('.option');
        options.forEach(opt => {
            opt.classList.remove('selected');
            opt.disabled = true; // Disable all options after selection
        });
        button.classList.add('selected');

        // Check if answer is correct
        const isCorrect = option === currentQuestion.answer;
        if (isCorrect) {
            button.classList.add('correct');
            score++;
            updateScore();
            feedbackElement.textContent = "Correct! " + currentQuestion.explanation;
            feedbackElement.classList.add('bg-success', 'text-white');
        } else {
            button.classList.add('incorrect');
            // Highlight the correct answer
            options.forEach(opt => {
                if (opt.textContent === currentQuestion.answer) {
                    opt.classList.add('correct');
                }
            });
            feedbackElement.textContent = "Incorrect. " + currentQuestion.explanation;
            feedbackElement.classList.add('bg-danger', 'text-white');
        }

        feedbackElement.style.display = 'block';
        nextBtn.disabled = false;
    }

    // Update the score display
    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    // Show the final results
    function showResults() {
        quizScreen.style.display = 'none';
        resultsScreen.style.display = 'block';
        
        const percentage = Math.round((score / questions.length) * 100);
        finalScoreElement.textContent = `Your Score: ${score}/${questions.length} (${percentage}%)`;
        
        // Add performance comment based on score
        let comment = '';
        if (percentage >= 90) {
            comment = "Excellent work! You really know your stuff!";
        } else if (percentage >= 70) {
            comment = "Good job! You have a solid understanding.";
        } else if (percentage >= 50) {
            comment = "Not bad! With a bit more study, you'll do even better.";
        } else {
            comment = "Keep practicing! Review the material and try again.";
        }
        
        performanceCommentElement.textContent = comment;
    }

    // Event listeners
    startBtn.addEventListener('click', () => {
        introScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        initQuiz();
    });

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    });

    restartBtn.addEventListener('click', () => {
        resultsScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        initQuiz();
    });
});