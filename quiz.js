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
    const timerElement = document.getElementById('timer');

    // Quiz variables
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let selectedOption = null;
    let timeLeft = 600; // 10 phút = 600 giây
    let timerInterval;

    // Quiz questions
    const quizQuestions = [
        {
            type: "multiple-choice",
            question: "Một chú báo chạy được 1980 m trong 1 phút. Vận tốc của chú báo đó là:",
            options: ["1980 m/s", "30 m/s", "33 m/phút", "1980 m/phút"],
            answer: "33 m/phút",
            explanation: "Bài giải\nVận tốc = Quãng đường / Thời gian = 1980 m / 1 phút = 1980 m/phút"
        },
        {
            type: "multiple-choice",
            question: "Một chú cá ngừ vây vàng bơi được 40,2 km trong nửa giờ. Vận tốc của chú cá là:",
            options: ["20,1 km/giờ", "80,4 km/giờ", "20,1 km/phút", "80,4 km/phút"],
            answer: "80,4 km/giờ",
            explanation: "Bài giải\nNửa giờ = 0,5 giờ\nVận tốc của chú cá là : 40,2 : 0,5 = 80,4 ( km/h)\nĐáp số : 80,4km/h"
        },
        {
            type: "multiple-choice",
            question: "Một chiếc máy bay bay với vận tốc 734,5 km/h. Quãng đường bay được của chiếc máy bay đó trong 4 giờ là:",
            options: ["2938 m", "29380 km", "2938 km", "293,8 km"],
            answer: "2938 km",
            explanation: "Bài giải\nQuãng đường bay được của chiếc máy bay đó trong 4 giờ là :\n734,5 x 4 = 2938 ( km)\nĐáp số : 2938 km"
        },
        {
            type: "multiple-choice",
            question: "Cô Vy đạp xe trở lại nông trường cách nhà 38 km. Cô ấy đạp xe với vận tốc là 19km/h. Vậy thời gian đạp xe của cô Vy là mấy giờ?",
            options: ["3 giờ", "2 giờ", "1 giờ", "4 giờ"],
            answer: "2 giờ",
            explanation: "Bài giải\nThời gian đạp xe của cô Vy là :\n38 : 19 = 2 ( giờ)\nĐáp số : 2 giờ"
        },
        {
            type: "multiple-choice",
            question: "Một chiếc trực thăng bay từ thành phố C đến thành phố D với vận tốc 300km/h. Sau đó chiếc trực thăng bay từ thành phố D trở về thành phố C với vận tốc 250 km/h. Biết thành phố D cách thành phố C là 600 km. Thời gian bay về dài hơn thời gian bay đi là:",
            options: ["1 giờ", "0,5 giờ", "0,4 giờ", "0,2 giờ"],
            answer: "0,4 giờ",
            explanation: "Bài giải\nThời gian trực thăng bay từ thay phố C đến thành phố D là :\n600 : 300 = 2 ( giờ )\nThời gian trực thăng bay từ thành phố D về thành phố C là :\n600 :250 = 2,4 ( giờ )\nThời gian bay về dài hơn thời gian bay đi là :\n2,4 – 2 = 0,4 ( giờ)\nĐáp số : 0,4 giờ"
        },
        {
            type: "multiple-choice",
            question: "Đoàn lạc đà của Sinbad chở hàng từ thị trấn A đến thị trấn B hết 10 giờ 15 phút. Biết đoàn lạc đà đi với vận tốc 4km/h. Quãng đường từ thị trấn A đến thị trấn B là bao nhiêu?",
            options: ["41 km", "410 km", "45 km", "450 km"],
            answer: "41 km",
            explanation: "Bài giải\nĐổi : 10 giờ 15 phút = 10,25 giờ\nQuãng đường từ thị trấn A đến thị trấn B dài số km là :\n4 x 10,25 = 41( km)\nĐáp số : 41 km"
        },
        {
            type: "multiple-choice",
            question: "Kỵ sĩ cưỡi ngựa chạy quanh một quả đồi 3 vòng hết 9,6 phút. Vậy với cùng vận tốc như thế, nếu kỵ sĩ chạy 12 vòng quanh quả đồi thì hết bao nhiêu thời gian?",
            options: ["34,8 phút", "38,4 phút", "384 phút", "348 phút"],
            answer: "38,4 phút",
            explanation: "Bài giải\nKị sĩ cưỡi ngựa chạy 1 vòng quanh quả đồi hết số thời gian là :\n9,6 : 3 = 3,2 ( phút)\nKị sĩ chạy 12 vòng quanh quả đồi hết số thời gian là :\n3,2 x 12 = 38,4 ( phút)\nĐáp số : 38,4 phút"
        },
        {
            type: "multiple-choice",
            question: "Chú Toàn lái xe giao hàng từ nhà kho A đến các điểm giao hàng B, C và D rồi quay lại nhà kho A. Biết vận tốc của xe trên đường đi là 35 km/h và tại mỗi điểm giao hàng, chú dừng lại 15 phút. Tổng thời gian đi và giao hàng của chú Toàn là bao nhiêu lâu?",
            options: ["1 giờ 9 phút", "1 giờ 15 phút", "1 giờ 20 phút", "1 giờ 30 phút"],
            answer: "1 giờ 9 phút",
            explanation: "Bài giải\nThời gian chú dừng lại giao hàng ở ba điểm B,C,D là :\n15 x 3 = 45 ( phút)\nQuãng đường chú đi từ nhà kho A đến các điểm B,C và D rồi lại quay về nhà kho A là :\n4 + 3 + 4 + 3 = 14 ( km)\nThời gian chú đi 14 km là :\n14 : 35 = 0,4 ( giờ)\n0,4 giờ = 24 phút\nTổng thời gian đi và giao hàng của chú Toàn là :\n45 + 24 = 69 ( phút)\n69 phút = 1 giờ 9 phút\nĐáp số : 1 giờ 9 phút"
        },
        {
            type: "multiple-choice",
            question: "Quãng đường AB dài 177km. Lúc 7 giờ, Tú đi xe máy từ A đến B. Tú đi 2 giờ đầu với vận tốc 36km/h. Đoạn đường còn lại Tú tăng vận tốc thêm 9km mỗi giờ. Hỏi Tú đến B lúc mấy giờ?",
            options: ["4 giờ 20 phút", "9 giờ 20 phút", "11 giờ 20 phút", "12 giờ 40 phút"],
            answer: "11 giờ 20 phút",
            explanation: "Bài giải\n2 giờ đầu Tú đi được số km là :\n36 x 2 = 72 ( km)\nĐoạn đường còn lại Tú đi với vận tốc là :\n36 + 9 = 45 ( km/h)\nĐoạn đường Tú đi với vận tốc 45 km/h dài số km là :\n177 – 72 = 105 (km)\nTú đi 105 km đường còn lại với vận tốc 45 km/h thì hết số thời gian là :\n105 : 45 = 2 1/3 (giờ )\n2 1/3 giờ = 2 giờ 20 phút\nThời điểm Tú đến B là :\n7 giờ + 2 giờ + 2 giờ 20 phút = 11 giờ 20 phút\nĐáp số : 11 giờ 20 phút"
        },
        {
            type: "multiple-choice",
            question: "Quãng đường AB dài 103km. Lúc 8 giờ 15 phút, một ô tô đi từ A đến B với vận tốc 50km/h. Đi được 40km, xe hỏng sửa mất 45 phút. Quãng đường còn lại, xe chỉ chạy với vận tốc 45km/h. Hỏi xe đến B lúc mấy giờ?",
            options: ["9 giờ 39 phút", "10 giờ 22 phút", "10 giờ 37 phút", "11 giờ 12 phút"],
            answer: "11 giờ 12 phút",
            explanation: "Bài giải\n40 km đầu tiên ô tô đi hết số giờ là :\n40 : 50 = 0,8 ( giờ)\n0,8 giờ = 48 phút\nQuãng đường còn lại dài là\n103 – 40 = 63 ( km)\nThời gian ô tô chạy quãng đường còn lại là :\n63 : 45 = 1,4 ( giờ)\n1,4 giờ = 1 giờ 24 phút\nXe đến B lúc :\n8 giờ 15 phút + 48 phút + 45 phút + 1 giờ 24 phút = 9 giờ 132 phút = 11 giờ 12 phút\nĐáp số : 11 giờ 12 phút"
        },
        {
            type: "fill-in-blank",
            question: "Lúc 7 giờ 45 phút, một ô tô đi từ tỉnh A và đến tỉnh B lúc 10 giờ. Quãng đường AB là 120 km. Tính vận tốc của ô tô, biết rằng trên đường đi, ô tô nghỉ dọc đường hết 15 phút.",
            answer: "60",
            unit: "km/h",
            explanation: "Bài giải\nThời gian ô tô đi từ tỉnh A đến tỉnh B ( kể cả thời gian ô tô nghỉ ) là :\n10 giờ - 7 giờ 45 phút = 2 giờ 15 phút\nThời gian ô tô đi từ tỉnh A đến tỉnh B( không kể thời gian nghỉ ) là\n2 giờ 15 phút – 15 phút = 2 giờ\nVận tốc của ô tô là :\n120 : 2 = 60 ( km/h)\nĐáp số : 60 km/h"
        },
        {
            type: "fill-in-blank",
            question: "Lúc 5 giờ sáng, bác Phi bắt đầu lái một chiếc bè đầy tre ngược sông Đà để về nhà. Bác ấy về đến nhà đúng lúc 12 giờ trưa. Hỏi quãng đường về nhà là bao nhiêu ki-lô-mét, biết rằng bác Phi lái bè với vận tốc trung bình là 9 km/h?",
            answer: "63",
            unit: "km",
            explanation: "Bài giải\nThời gian bác Phi lái chiếc bè về nhà là :\n12 giờ - 5 giờ = 7 giờ\nQuãng đường về nhà bác Phi dài số km là :\n9 x 7 = 63 ( km)\nĐáp số : 63 km"
        },
        {
            type: "fill-in-blank",
            question: "Biết trong 3 giờ xe màu xanh đi được 162km, trong 14 giây xe màu đỏ đi được 224m. Trong 3 phút xe màu vàng đi được 2 520m. Xe có vận tốc lớn nhất là xe nào?",
            answer: "xe màu đỏ",
            explanation: "Bài giải\n1 giờ = 3600 giây ; 1 phút = 60 giây\nVận tốc xe màu xanh ( tính theo đơn vị km/h) là : 162 : 3 = 54 (km / h)\n54 km = 54 000 m\nVận tốc xe màu xanh ( tính theo đơn vị m/giây) là :\n54 000 : 3600 = 15 (m/s)\nVận tốc xe màu đỏ ( Tính theo đơn vị m/giây) là :\n224 : 14 = 16 ( m/s)\n1 phút xe màu vàng đi được là :\n2520 : 3 = 840(m)\nVận tốc xe màu vàng là :\n840 : 60 = 14 ( m/s)\nSo sánh : 14< 15 < 16 => 14 m/s < 15 m/s < 16 m/s\nVậy vận tốc xe màu vàng < vận tốc xe màu xanh< vận tốc xe màu đỏ\n=> Vận tốc lớn nhất là vận tốc xe màu đỏ."
        },
        {
            type: "fill-in-blank",
            question: "Xe máy khởi hành từ A lúc 5 giờ 45 phút và đi đến B lúc 7 giờ với vận tốc 40km/giờ. Tính quãng đường AB.",
            answer: "50",
            unit: "km",
            explanation: "Bài giải\nXe máy đi từ A đến B hết số thời gian là :\n7 giờ - 5 giờ 45 phút = 1 giờ 15 phút\n1 giờ 15 phút = 1,25 giờ\nĐộ dài quãng đường AB là :\n40 x 1,25 = 50 ( km)\nĐáp số : 50 km"
        },
        {
            type: "fill-in-blank",
            question: "Lúc 7 giờ 20 phút, một người đi xe đạp với vận tốc 12km/giờ đi từ A đến B. Biết quãng đường AB dài 18km. Hỏi người ấy đến B lúc mấy giờ?",
            answer: "8 giờ 50 phút",
            answerType: "time",
            explanation: "Bài giải\nThời gian người đi xe đạp đi hết quãng đường AB là :\n18 : 12 = 1, 5 giờ\n1,5 giờ = 1 giờ 30 phút\nNgười đó đến B lúc :\n7 giờ 20 phút + 1 giờ 30 phút = 8 giờ 50 phút\nĐáp số: 8 giờ 50 phút"
        },
        {
            type: "fill-in-blank",
            question: "Một ôtô khởi hành từ A lúc 7 giờ, đến B lúc 11 giờ 45 phút. Giữa đường xe nghỉ 30 phút. Tính vận tốc của ô tô biết quãng đường AB dài 170km.",
            answer: "40",
            unit: "km/h",
            explanation: "Bài giải\nThời gian ô tô đi từ A đến B( kể cả thời gian nghỉ ) là :\n11 giờ 45 phút – 7 giờ = 4 giờ 45 phút\nThời gian ô tô di từ A đến B ( không kể thời gian nghỉ ) là :\n4 giờ 45 phút – 30 phút = 4 giờ 15 phút\n4 giờ 15 phút = 4,25 giờ\nVận tốc của ô tô là :\n170 : 4,25 = 40 ( km/h)\nĐáp số : 40 km/h"
        },
        {
            type: "fill-in-blank",
            question: "Anh Nam đi công tác ở trung tâm Hải Phòng bằng xe máy, anh khởi hành lúc 11 giờ 15 phút với vận tốc 36km/h. Anh đến nơi lúc 15 giờ 45 phút. Trên đường đi anh dừng lại nghỉ hết 1 giờ 10 phút. Hỏi từ nhà anh đến trung tâm Hải Phòng cách bao nhiêu ki-lô-mét?",
            answer: "120",
            unit: "km",
            explanation: "Bài giải\nThời gian anh Nam đi từ nhà đến trung tâm Hải Phòng ( kể cả thời gian nghỉ ) là :\n15 giờ 45 phút – 11 giờ 15 phút = 4 giờ 30 phút\nThời gian anh Nam đi từ nhà đến trung tâm Hải Phòng ( không kể thời gian nghỉ ) là :\n4 giờ 30 phút – 1 giờ 10 phút = 3 giờ 20 phút\n3 giờ 20 phút = 3 1/3 giờ =10/3 giờ\nNhà anh Nam cách trung tâm Hải Phòng số km là :\n36 x 10/3 = 120 ( km)\nĐáp số : 120 km"
        },
        {
            type: "fill-in-blank",
            question: "Một người đi bộ từ A với vận tốc 4,5km/giờ và đến B lúc 11 giờ 30 phút. Biết quãng đường AB dài 14,4km. Hỏi người đó đi từ A lúc mấy giờ, biết dọc đường người đó dừng lại mất 30 phút?",
            answer: "7 giờ 48 phút",
            answerType: "time",
            explanation: "Bài giải\nThời gian người đó đi từ A đến B ( không kể thời gian nghỉ ) là :\n14,4 : 4,5 = 3,2 giờ\n3,2 giờ = 3 giờ 12 phút\nThời gian người đó đi từ A đến B ( kể cả thời gian nghỉ ) là :\n3 giờ 12 phút + 30 phút = 3 giờ 42 phút\nThời điểm người đó đi từ A là :\n11 giờ 30 phút – 3 giờ 42 phút = 7 giờ 48 phút\nĐáp số : 7 giờ 48 phút"
        },
        {
            type: "fill-in-blank",
            question: "Trên quãng đường AB, một xe máy đi với vận tốc 44km/h thì mất 2 giờ 30 phút. Một ô tô đi với vận tốc gấp rưỡi xe máy thì mất bao lâu?",
            answer: "1 giờ 40 phút",
            answerType: "time",
            explanation: "Bài giải\n2 giờ 30 phút = 2,5 giờ\nGấp rưỡi là gấp 1,5\nĐộ dài quãng đường AB là : 44 x 2,5 = 110( km)\nVận tốc ô tô là : 44 x 1,5 = 66 ( km/h)\nThời gian ô tô đi hết quãng đường AB là : 110 : 66 = 1 44/66 ( giờ ) = 1 2/3 giờ\n1 2/3 giờ = 1 giờ 40 phút\nĐáp số : 1 giờ 40 phút"
        },
        {
            type: "fill-in-blank",
            question: "Hai bạn An và Bình cùng đạp xe từ trường đến sân vận động để tham gia thi đấu thể thao. Thời gian An đạp xe từ trường đến sân vận động bằng 5/4 thời gian Bình đạp xe từ trường đến sân vận động. Trong 6 phút bạn An đạp xe được quãng đường dài 1,2 km. Tính độ dài quãng đường từ trường đến sân vận động biết rằng nếu trên cùng quãng đường đó và cùng một lúc An xuất phát từ trường còn Bình xuất phát từ sân vận động thì sau 12 phút 2 bạn sẽ gặp nhau.",
            answer: "5,4",
            unit: "km",
            explanation: "Bài giải\nThời gian An đạp xe từ trường đến sân vận động bằng 5/4 thời gian Bình đạp xe từ trường đến sân vận động .\n=> Vận tốc An đạp xe từ trường đến sân vận động = 4/5 vận tốc Bình đạp xe từ trường đến sân vận động .( Trong cùng một quãng đường , vận tốc và thời gian là 2 đại lượng tỉ lệ nghịch )\nVận tốc An đạp xe từ trường đến sân vận động là : 1,2 : 6 = 0,2 ( km/phút)\nVận tốc Bình đạp xe từ trường đến sân vận động là : 0,2 : 4 x 5 = 0,25 ( km/phút)\n12 phút An đạp xe được số km là : 0,2 x 12 = 2,4 ( km)\n12 phút Bình đạp xe được số km là : 0,25 x 12 = 3 (km)\nĐộ dài quãng đường từ trường đến sân vận động là : 2,4 + 3 = 5,4 ( km)\nĐáp số : 5,4 km"
        }
    ];

    // Initialize the quiz
    function initQuiz() {
        // Không trộn câu hỏi, giữ nguyên thứ tự
        questions = [...quizQuestions];
        currentQuestionIndex = 0;
        score = 0;
        updateScore();
        showQuestion();
        // Khởi động đồng hồ đếm ngược
        timeLeft = 600; // 10 phút
        updateTimerDisplay();
        startTimer();
    }

    // Cập nhật hiển thị đồng hồ
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Thời gian: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Thay đổi màu sắc khi gần hết thời gian
        if (timeLeft <= 60) { // 1 phút cuối
            timerElement.classList.remove('bg-primary');
            timerElement.classList.add('bg-danger');
        } else if (timeLeft <= 120) { // 2 phút cuối
            timerElement.classList.remove('bg-primary');
            timerElement.classList.add('bg-warning');
        }
    }

    // Bắt đầu đếm ngược
    function startTimer() {
        clearInterval(timerInterval); // Xóa interval cũ nếu có
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                // Hết thời gian
                clearInterval(timerInterval);
                endQuizDueToTimeout();
            }
        }, 1000);
    }

    // Dừng đồng hồ đếm ngược
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Kết thúc bài kiểm tra khi hết thời gian
    function endQuizDueToTimeout() {
        alert("Đã hết thời gian làm bài!");
        showResults();
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

        if (currentQuestion.type === "multiple-choice") {
            // Không trộn các lựa chọn, giữ nguyên thứ tự
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option', 'btn', 'btn-outline-primary', 'w-100', 'text-start');
                button.addEventListener('click', () => selectOption(button, option));
                optionsElement.appendChild(button);
            });
        } else if (currentQuestion.type === "fill-in-blank") {
            // Create input field for fill-in-blank questions
            const inputContainer = document.createElement('div');
            inputContainer.classList.add('mb-3', 'mt-3', 'd-flex', 'align-items-center', 'justify-content-center');
            
            if (currentQuestion.answerType === "time") {
                // Create time input fields
                const hourInput = document.createElement('input');
                hourInput.type = 'number';
                hourInput.id = 'hour-input';
                hourInput.classList.add('form-control', 'mb-2', 'me-2');
                hourInput.style.width = '80px';
                hourInput.placeholder = 'Giờ';
                hourInput.min = '0';
                
                const minuteInput = document.createElement('input');
                minuteInput.type = 'number';
                minuteInput.id = 'minute-input';
                minuteInput.classList.add('form-control', 'mb-2', 'me-2');
                minuteInput.style.width = '80px';
                minuteInput.placeholder = 'Phút';
                minuteInput.min = '0';
                minuteInput.max = '59';
                
                const submitBtn = document.createElement('button');
                submitBtn.textContent = 'Kiểm tra';
                submitBtn.classList.add('btn', 'btn-primary', 'ms-2');
                submitBtn.addEventListener('click', () => {
                    const hour = hourInput.value.padStart(2, '0');
                    const minute = minuteInput.value.padStart(2, '0');
                    checkFillInAnswer(`${hour} giờ ${minute} phút`);
                });
                
                inputContainer.appendChild(hourInput);
                inputContainer.appendChild(minuteInput);
                inputContainer.appendChild(submitBtn);
            } else {
                // Create regular number input
                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'answer-input';
                input.classList.add('form-control', 'mb-2', 'me-2');
                input.style.width = '150px';
                input.placeholder = 'Nhập đáp án...';
                
                const unitSpan = document.createElement('span');
                unitSpan.textContent = currentQuestion.unit;
                unitSpan.classList.add('ms-2');
                
                const submitBtn = document.createElement('button');
                submitBtn.textContent = 'Kiểm tra';
                submitBtn.classList.add('btn', 'btn-primary', 'ms-2');
                submitBtn.addEventListener('click', () => checkFillInAnswer(input.value));
                
                inputContainer.appendChild(input);
                inputContainer.appendChild(unitSpan);
                inputContainer.appendChild(submitBtn);
            }
            
            optionsElement.appendChild(inputContainer);
        }

        nextBtn.disabled = true;
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
            feedbackElement.innerHTML = `<div style="text-align: center; font-weight: bold; margin-bottom: 10px;">Bài giải</div>${currentQuestion.explanation.replace('Bài giải\n', '')}`;
            feedbackElement.classList.add('bg-success', 'text-white');
        } else {
            button.classList.add('incorrect');
            // Highlight the correct answer
            options.forEach(opt => {
                if (opt.textContent === currentQuestion.answer) {
                    opt.classList.add('correct');
                }
            });
            feedbackElement.innerHTML = `<div style="text-align: center; font-weight: bold; margin-bottom: 10px;">Bài giải</div>${currentQuestion.explanation.replace('Bài giải\n', '')}`;
            feedbackElement.classList.add('bg-danger', 'text-white');
        }

        feedbackElement.style.display = 'block';
        nextBtn.disabled = false;
    }

    // Check fill-in-blank answer
    function checkFillInAnswer(userAnswer) {
        // If an answer is already submitted, do nothing
        if (selectedOption !== null) return;

        selectedOption = userAnswer;
        const currentQuestion = questions[currentQuestionIndex];
        const input = document.getElementById('answer-input');
        const hourInput = document.getElementById('hour-input');
        const minuteInput = document.getElementById('minute-input');
        const submitBtn = input ? input.nextElementSibling.nextElementSibling : hourInput.nextElementSibling.nextElementSibling;
        
        // Disable inputs and submit button
        if (input) {
            input.disabled = true;
        } else {
            hourInput.disabled = true;
            minuteInput.disabled = true;
        }
        submitBtn.disabled = true;

        // Apply formatting to the input based on correctness
        const isCorrect = userAnswer.trim() === currentQuestion.answer;
        if (isCorrect) {
            if (input) {
                input.classList.add('is-valid');
            } else {
                hourInput.classList.add('is-valid');
                minuteInput.classList.add('is-valid');
            }
            score++;
            updateScore();
            feedbackElement.innerHTML = `<div style="text-align: center; font-weight: bold; margin-bottom: 10px;">Bài giải</div>${currentQuestion.explanation.replace('Bài giải\n', '')}`;
            feedbackElement.classList.add('bg-success', 'text-white');
        } else {
            if (input) {
                input.classList.add('is-invalid');
            } else {
                hourInput.classList.add('is-invalid');
                minuteInput.classList.add('is-invalid');
            }
            feedbackElement.innerHTML = `<div style="text-align: center; font-weight: bold; margin-bottom: 10px;">Bài giải</div>${currentQuestion.explanation.replace('Bài giải\n', '')}`;
            feedbackElement.classList.add('bg-danger', 'text-white');
        }

        feedbackElement.style.display = 'block';
        nextBtn.disabled = false;
    }

    // Reset the question state
    function resetState() {
        while (optionsElement.firstChild) {
            optionsElement.removeChild(optionsElement.firstChild);
        }
        feedbackElement.style.display = 'none';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        feedbackElement.style.whiteSpace = 'pre-line';
        selectedOption = null;
    }

    // Update the score display
    function updateScore() {
        scoreElement.textContent = `Điểm: ${score}`;
    }

    // Show the final results
    function showResults() {
        // Dừng đồng hồ đếm ngược khi hiển thị kết quả
        stopTimer();
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