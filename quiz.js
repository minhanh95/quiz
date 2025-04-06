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
            question: "Viết số thập phân gồm 13 đơn vị, 5 phần trăm:",
            options: ["13,5", "13,05", "13,005", "1305"],
            answer: "13,05",
            explanation: "13 đơn vị và 5 phần trăm tương đương với 13,05."
        },
        {
            question: "Chữ số 8 trong số thập phân 49,865 có giá trị là:",
            options: ["8/10", "8/100", "8/1000", "8"],
            answer: "8/10",
            explanation: "Chữ số 8 đứng ở vị trí phần mười nên có giá trị là 8/10."
        },
        {
            question: "2 tấn 12kg = ... tấn. Số thích hợp điền vào chỗ chấm là:",
            options: ["2,12", "2,120", "2,012", "2012"],
            answer: "2,012",
            explanation: "2 tấn 12kg = 2 tấn + 12/1000 tấn = 2,012 tấn."
        },
        {
            question: "Kích thước của sân bóng đá là hình chữ nhật có chiều dài 105 m và chiều rộng 68m. Em hãy tính diện tích sân bóng đó với số đo là héc-ta.",
            options: ["7140 ha", "7,14 ha", "71,40 ha", "0,714 ha"],
            answer: "0,714 ha",
            explanation: "Diện tích = 105 m × 68 m = 7140 m². 1 ha = 10000 m² nên 7140 m² = 0,714 ha."
        },
        {
            question: "Giá trị của biểu thức 4,59 + 34 : 2 là:",
            options: ["21,59", "25,19", "2,159", "15,29"],
            answer: "21,59",
            explanation: "4,59 + 34 : 2 = 4,59 + 17 = 21,59."
        },
        {
            question: "Một hình thang có diện tích bằng 47,25 m² và chiều cao bằng 6,3 m. Trung bình cộng độ dài hai đáy là:",
            options: ["3,75 m", "7,5 m", "10,15 m", "15 m"],
            answer: "7,5 m",
            explanation: "Diện tích hình thang = (a + b) × h : 2, trong đó (a + b) là tổng độ dài hai đáy và h là chiều cao. Từ đó: (a + b) = 2 × S : h = 2 × 47,25 : 6,3 = 15 m. Trung bình cộng hai đáy = 15 : 2 = 7,5 m."
        },
        {
            question: "Một bánh xe đạp có bán kính 25 cm lăn được một quãng đường dài 213,52 m. Hỏi bánh xe đó lăn được bao nhiêu vòng?",
            options: ["136 vòng", "100 vòng", "135 vòng", "130 vòng"],
            answer: "136 vòng",
            explanation: "Chu vi bánh xe = 2π × r = 2 × 3,14 × 25 = 157 cm = 1,57 m. Số vòng = 213,52 : 1,57 = 136 vòng."
        },
        {
            question: "Một miếng đất hình chữ nhật có diện tích 800 m² chiều dài 40 m, người ta đào một cái ao hình bán nguyệt. Tính diện tích mặt ao.",
            options: ["6,28 m²", "628 m²", "157 m²", "15,7 m²"],
            answer: "157 m²",
            explanation: "Chiều rộng miếng đất = 800 : 40 = 20 m. Diện tích bán nguyệt với đường kính 20 m là: (π × 20²) : 2 = 157 m²."
        },
        {
            question: "Một hình vuông có diện tích là 1 m² 69 dm². Chu vi hình vuông là:",
            options: ["26 dm", "52 dm", "48 dm", "44 dm"],
            answer: "52 dm",
            explanation: "Diện tích = 1 m² + 69 dm² = 100 dm² + 69 dm² = 169 dm². Cạnh hình vuông = √169 = 13 dm. Chu vi = 4 × 13 = 52 dm."
        },
        {
            question: "Cô Hoàn mua 5 kg gạo tẻ và 5 kg gạo nếp. 1 kg gạo tẻ giá là 9.300 đồng, 1 kg gạo nếp giá là 11.200 đồng. Cô Hoàn phải trả số tiền là:",
            options: ["103.000 đồng", "102.000 đồng", "65.300 đồng", "57.700 đồng"],
            answer: "103.000 đồng",
            explanation: "Tiền gạo tẻ = 5 × 9.300 = 46.500 đồng. Tiền gạo nếp = 5 × 11.200 = 56.000 đồng. Tổng tiền = 46.500 + 56.000 = 102.500 đồng ≈ 103.000 đồng."
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

        questionCountElement.textContent = `Câu hỏi ${questionNo} trên ${totalQuestions}`;
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
            feedbackElement.textContent = "Đúng! " + currentQuestion.explanation;
            feedbackElement.classList.add('bg-success', 'text-white');
        } else {
            button.classList.add('incorrect');
            // Highlight the correct answer
            options.forEach(opt => {
                if (opt.textContent === currentQuestion.answer) {
                    opt.classList.add('correct');
                }
            });
            feedbackElement.textContent = "Sai rồi. " + currentQuestion.explanation;
            feedbackElement.classList.add('bg-danger', 'text-white');
        }

        feedbackElement.style.display = 'block';
        nextBtn.disabled = false;
    }

    // Update the score display
    function updateScore() {
        scoreElement.textContent = `Điểm: ${score}`;
    }

    // Show the final results
    function showResults() {
        quizScreen.style.display = 'none';
        resultsScreen.style.display = 'block';
        
        const percentage = Math.round((score / questions.length) * 100);
        finalScoreElement.textContent = `Điểm của bạn: ${score}/${questions.length} (${percentage}%)`;
        
        // Add performance comment based on score
        let comment = '';
        if (percentage >= 90) {
            comment = "Xuất sắc! Bạn thực sự rất giỏi!";
        } else if (percentage >= 70) {
            comment = "Tốt! Bạn đã có hiểu biết vững chắc.";
        } else if (percentage >= 50) {
            comment = "Không tệ! Với một chút học hỏi thêm, bạn sẽ làm tốt hơn.";
        } else {
            comment = "Cần cố gắng thêm! Hãy ôn tập lại và thử lại.";
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