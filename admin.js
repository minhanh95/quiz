document.addEventListener('DOMContentLoaded', function() {
    // Bắt đầu đo thời gian tải trang
    const startTime = performance.now();

    // Đặt biến để theo dõi các tài nguyên đang tải
    let resourcesLoading = 0;
    let initialized = false;
    
    // DOM Elements
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    const gradeScreen = document.getElementById('grade-screen');
    const subjectScreen = document.getElementById('subject-screen');
    const topicScreen = document.getElementById('topic-screen');
    const examScreen = document.getElementById('exam-screen');
    const questionsScreen = document.getElementById('questions-screen');
    
    const subjectContainer = document.getElementById('subject-container');
    const topicContainer = document.getElementById('topic-container');
    const examContainer = document.getElementById('exam-container');
    
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const addTopicBtn = document.getElementById('add-topic-btn');
    const addExamBtn = document.getElementById('add-exam-btn');
    
    const questionForm = document.getElementById('question-form');
    const formTitle = document.getElementById('form-title');
    const questionEditor = document.getElementById('question-editor');
    const questionIdInput = document.getElementById('question-id');
    const questionTypeSelect = document.getElementById('question-type');
    const questionTextInput = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const optionsList = document.getElementById('options-list');
    const addOptionBtn = document.getElementById('add-option-btn');
    const correctAnswerInput = document.getElementById('correct-answer');
    const explanationInput = document.getElementById('explanation');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const questionsContainer = document.getElementById('questions-container');
    const loading = document.getElementById('loading');
    
    const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
    const categoryModalLabel = document.getElementById('categoryModalLabel');
    const categoryForm = document.getElementById('category-form');
    const categoryTypeInput = document.getElementById('category-type');
    const categoryNameInput = document.getElementById('category-name');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const deleteMessage = document.getElementById('delete-message');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Thêm phần import JSON
    const importJsonBtn = document.createElement('button');
    importJsonBtn.className = 'btn btn-success me-2';
    importJsonBtn.innerHTML = '<i class="bi bi-upload"></i> Import từ JSON';
    importJsonBtn.id = 'import-json-btn';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.id = 'json-file-input';
    document.body.appendChild(fileInput);

    // Thêm nút Export JSON
    const exportJsonBtn = document.createElement('button');
    exportJsonBtn.className = 'btn btn-primary me-2';
    exportJsonBtn.innerHTML = '<i class="bi bi-download"></i> Export ra JSON';
    exportJsonBtn.id = 'export-json-btn';

    // Thêm nút Import đề thi
    const importExamBtn = document.createElement('button');
    importExamBtn.className = 'btn btn-info me-2';
    importExamBtn.innerHTML = '<i class="bi bi-cloud-upload"></i> Import đề thi';
    importExamBtn.id = 'import-exam-btn';
    const examFileInput = document.createElement('input');
    examFileInput.type = 'file';
    examFileInput.accept = '.json';
    examFileInput.style.display = 'none';
    examFileInput.id = 'exam-file-input';
    document.body.appendChild(examFileInput);

    // Variables
    let currentQuestionId = null;
    let questionToDelete = null;
    let allQuestions = [];
    let currentNavigation = {
        grade: null,
        subject: null,
        topic: null,
        exam: null
    };
    let deleteTarget = {
        type: null,
        id: null
    };
    
    // Tạo indexes cho Firestore
    function createFirestoreIndexes() {
        // Hiển thị thông báo cho người dùng
        const indexMessage = document.createElement('div');
        indexMessage.className = 'alert alert-info';
        indexMessage.innerHTML = 'Đang tạo indexes cho Firestore... Vui lòng đợi trong giây lát.';
        document.querySelector('.admin-container').prepend(indexMessage);
        
        // Tạo các collections và documents cần thiết
        const db = firebase.firestore();
        
        // Tạo collection grades nếu chưa có
        db.collection('grades').doc('sample').set({
            name: 'sample',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            // Tạo collection subjects nếu chưa có
            return db.collection('subjects').doc('sample').set({
                name: 'sample',
                grade: 'sample',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(() => {
            // Tạo collection topics nếu chưa có
            return db.collection('topics').doc('sample').set({
                name: 'sample',
                grade: 'sample',
                subject: 'sample',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(() => {
            // Tạo collection exams nếu chưa có
            return db.collection('exams').doc('sample').set({
                name: 'sample',
                grade: 'sample',
                subject: 'sample',
                topic: 'sample',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(() => {
            // Tạo collection questions nếu chưa có
            return db.collection('questions').doc('sample').set({
                question: 'sample',
                type: 'multiple-choice',
                options: ['sample1', 'sample2'],
                answer: 0,
                grade: 'sample',
                subject: 'sample',
                topic: 'sample',
                exam: 'sample',
                order: 1,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(() => {
            // Tạo các truy vấn để tạo indexes
            return db.collection('subjects').where('grade', '==', 'sample').orderBy('createdAt').get();
        }).then(() => {
            return db.collection('topics')
                .where('grade', '==', 'sample')
                .where('subject', '==', 'sample')
                .orderBy('createdAt').get();
        }).then(() => {
            return db.collection('exams')
                .where('grade', '==', 'sample')
                .where('subject', '==', 'sample')
                .where('topic', '==', 'sample')
                .orderBy('createdAt').get();
        }).then(() => {
            return db.collection('questions')
                .where('grade', '==', 'sample')
                .where('subject', '==', 'sample')
                .where('topic', '==', 'sample')
                .where('exam', '==', 'sample')
                .orderBy('order').get();
        }).then(() => {
            // Xóa các documents sample đã tạo
            const batch = db.batch();
            batch.delete(db.collection('grades').doc('sample'));
            batch.delete(db.collection('subjects').doc('sample'));
            batch.delete(db.collection('topics').doc('sample'));
            batch.delete(db.collection('exams').doc('sample'));
            batch.delete(db.collection('questions').doc('sample'));
            return batch.commit();
        }).then(() => {
            // Thay đổi thông báo
            indexMessage.className = 'alert alert-success';
            indexMessage.innerHTML = `
                Indexes đã được tạo. Vui lòng truy cập <a href="https://console.firebase.google.com/v1/r/project/exam-ea18a/firestore/indexes" target="_blank">Firebase Console</a> 
                để kiểm tra và tạo indexes theo hướng dẫn. Sau khi indexes được tạo xong, hãy tải lại trang này.
            `;
            
            // Tự động xóa thông báo sau 10 giây
            setTimeout(() => {
                if (indexMessage.parentNode) {
                    indexMessage.parentNode.removeChild(indexMessage);
                }
            }, 10000);
        }).catch(error => {
            console.error("Error creating indexes: ", error);
            
            if (error.message.includes('requires an index')) {
                // Nếu lỗi do thiếu index, hiển thị link để tạo index
                const indexUrl = error.message.match(/https:\/\/console\.firebase\.google\.com\/[^\s]*/);
                if (indexUrl && indexUrl[0]) {
                    indexMessage.className = 'alert alert-warning';
                    indexMessage.innerHTML = `
                        Cần tạo index cho Firestore. <a href="${indexUrl[0]}" target="_blank">Nhấn vào đây</a> để tạo index. 
                        Sau khi index được tạo xong (có thể mất vài phút), hãy tải lại trang này.
                    `;
                } else {
                    indexMessage.className = 'alert alert-warning';
                    indexMessage.innerHTML = `
                        Cần tạo index cho Firestore. Vui lòng truy cập <a href="https://console.firebase.google.com/v1/r/project/exam-ea18a/firestore/indexes" target="_blank">Firebase Console</a>
                        để tạo index. Sau khi index được tạo xong, hãy tải lại trang này.
                    `;
                }
            } else {
                // Lỗi khác
                indexMessage.className = 'alert alert-danger';
                indexMessage.innerHTML = `Đã xảy ra lỗi: ${error.message}`;
            }
        });
    }
    
    // Chạy hàm tạo indexes
    createFirestoreIndexes();
    
    // Initialize page
    initializeGradeScreen();
    
    // Kiểm tra URL để điều hướng đến đúng màn hình
    checkUrlAndNavigate();
    
    // Hàm kiểm tra URL và điều hướng
    function checkUrlAndNavigate() {
        const urlParams = new URLSearchParams(window.location.search);
        const grade = urlParams.get('grade');
        const subject = urlParams.get('subject');
        const topic = urlParams.get('topic');
        const exam = urlParams.get('exam');
        
        if (grade) {
            currentNavigation.grade = grade;
            if (subject) {
                currentNavigation.subject = subject;
                if (topic) {
                    currentNavigation.topic = topic;
                    if (exam) {
                        currentNavigation.exam = exam;
                        navigateToQuestions(exam);
                    } else {
                        navigateToExams(topic);
                    }
                } else {
                    navigateToTopics(subject);
                }
            } else {
                navigateToSubjects(grade);
            }
        }
    }
    
    // Hàm cập nhật URL theo navigation hiện tại
    function updateUrl() {
        let url = window.location.pathname;
        let params = [];
        
        if (currentNavigation.grade) {
            params.push(`grade=${encodeURIComponent(currentNavigation.grade)}`);
            
            if (currentNavigation.subject) {
                params.push(`subject=${encodeURIComponent(currentNavigation.subject)}`);
                
                if (currentNavigation.topic) {
                    params.push(`topic=${encodeURIComponent(currentNavigation.topic)}`);
                    
                    if (currentNavigation.exam) {
                        params.push(`exam=${encodeURIComponent(currentNavigation.exam)}`);
                    }
                }
            }
        }
        
        const queryString = params.length > 0 ? `?${params.join('&')}` : '';
        const newUrl = url + queryString;
        
        // Cập nhật URL không reload trang
        window.history.pushState({}, '', newUrl);
    }
    
    // Event Listeners for navigation
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.classList.contains('add-grade-card')) {
            card.addEventListener('click', () => showAddCategoryModal('grade'));
        } else {
            card.addEventListener('click', function() {
                const grade = this.getAttribute('data-grade');
                navigateToSubjects(grade);
            });
        }
    });
    
    // Event Listeners for breadcrumb navigation
    breadcrumbNav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const level = e.target.getAttribute('data-level');
            navigateToLevel(level);
            e.preventDefault();
        }
    });
    
    // Xử lý sự kiện back/next trên trình duyệt
    window.addEventListener('popstate', function(event) {
        // Đọc URL hiện tại và điều hướng đến trang tương ứng
        checkUrlAndNavigate();
    });
    
    // Event Listeners for category buttons
    addSubjectBtn.addEventListener('click', () => showAddCategoryModal('subject'));
    addTopicBtn.addEventListener('click', () => showAddCategoryModal('topic'));
    addExamBtn.addEventListener('click', () => showAddCategoryModal('exam'));
    saveCategoryBtn.addEventListener('click', saveCategory);
    
    // Event Listeners for questions
    addQuestionBtn.addEventListener('click', showAddQuestionForm);
    cancelBtn.addEventListener('click', hideQuestionForm);
    questionForm.addEventListener('submit', handleQuestionSubmit);
    addOptionBtn.addEventListener('click', addOptionField);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    
    // Event Listeners for search
    searchBtn.addEventListener('click', searchQuestions);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchQuestions();
        }
    });
    
    // Hiển thị/ẩn trường nhập lựa chọn dựa trên loại câu hỏi
    questionTypeSelect.addEventListener('change', function() {
        if (this.value === 'multiple-choice') {
            optionsContainer.style.display = 'block';
        } else {
            optionsContainer.style.display = 'none';
        }
    });

    // Thêm chức năng import từ JSON
    importJsonBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    importQuestionsFromJson(jsonData);
                } catch (error) {
                    alert('Lỗi: File JSON không hợp lệ. ' + error.message);
                }
            };
            
            reader.readAsText(file);
        }
    });

    // Thêm event listener cho export JSON
    exportJsonBtn.addEventListener('click', function() {
        exportQuestionsToJson();
    });

    // Thêm event listener cho import đề thi
    importExamBtn.addEventListener('click', function() {
        examFileInput.click();
    });
    
    examFileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    importFullExam(jsonData);
                } catch (error) {
                    alert('Lỗi: File JSON không hợp lệ. ' + error.message);
                }
            };
            
            reader.readAsText(file);
        }
    });

    // Functions
    async function loadQuestions(grade, subject, topic, exam) {
        loading.style.display = 'flex';
        const db = firebase.firestore();
        
        try {
            const querySnapshot = await db.collection('questions')
                .where('grade', '==', grade)
                .where('subject', '==', subject)
                .where('topic', '==', topic)
                .where('exam', '==', exam)
                .orderBy('order')
                .get();
            
            questionsContainer.innerHTML = '';
            allQuestions = [];
            
            if (querySnapshot.empty) {
                questionsContainer.innerHTML = '<div class="alert alert-info">Chưa có câu hỏi nào cho đề thi này. Hãy thêm câu hỏi mới!</div>';
            } else {
                querySnapshot.forEach((doc, index) => {
                    const question = doc.data();
                    question.id = doc.id;
                    allQuestions.push(question);
                    const questionElement = createQuestionCard(question, index + 1);
                    questionsContainer.appendChild(questionElement);
                });
            }
        } catch (error) {
            console.error("Error loading questions:", error);
            questionsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Đã xảy ra lỗi khi tải câu hỏi: ${error.message}. 
                    ${error.message.includes('requires an index') ? 'Vui lòng truy cập vào link chỉ dẫn tạo index trên Firebase' : 'Vui lòng thử lại sau!'}
                </div>
            `;
        } finally {
            loading.style.display = 'none';
        }
    }

    // Hàm để xử lý văn bản có chứa LaTeX
    function processLatexInText(text) {
        if (!text) return text;
        
        // Đảm bảo các biểu thức LaTeX được bọc trong dấu \( \) để MathJax render
        // 1. Xử lý \frac{...}{...}
        text = text.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, function(match) {
            if (!match.startsWith('\\(')) {
                return '\\(' + match + '\\)';
            }
            return match;
        });
        
        // 2. Xử lý các biểu thức LaTeX khác như \sqrt{...}, \sum, \int, etc.
        const latexCommands = ['\\sqrt', '\\sum', '\\prod', '\\int', '\\lim', '\\infty', '\\partial', '\\nabla', '\\alpha', '\\beta', '\\gamma', '\\delta', '\\epsilon', '\\zeta', '\\eta', '\\theta', '\\lambda', '\\mu', '\\pi', '\\rho', '\\sigma', '\\tau', '\\phi', '\\chi', '\\psi', '\\omega'];
        
        latexCommands.forEach(cmd => {
            const regex = new RegExp(cmd + '(\\{[^}]*\\}|\\s*)', 'g');
            text = text.replace(regex, function(match) {
                if (!match.startsWith('\\(')) {
                    return '\\(' + match + '\\)';
                }
                return match;
            });
        });
        
        return text;
    }
    
    // Hàm hiển thị danh sách câu hỏi
    function displayQuestions(questions) {
        if (questions.length === 0) {
            questionsContainer.innerHTML = `
                <div class="alert alert-info" role="alert">
                    Không có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!
                </div>
            `;
            return;
        }

        let html = '';
        questions.forEach(question => {
            const typeClass = question.type === 'multiple-choice' ? 'type-multiple-choice' : 'type-fill-in-blank';
            const typeText = question.type === 'multiple-choice' ? 'Trắc nghiệm' : 'Điền khuyết';
            
            html += `
                <div class="question-item" data-id="${question.id}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="question-type ${typeClass}">${typeText}</span>
                            <strong>${question.question}</strong>
                        </div>
                    </div>
                    
                    <div class="mt-2">
                        <p><strong>Đáp án đúng:</strong> ${question.answer}</p>
                        ${question.explanation ? `<p><strong>Giải thích:</strong> ${question.explanation}</p>` : ''}
                    </div>
                    
                    ${question.type === 'multiple-choice' && question.options ? `
                        <div class="mt-2">
                            <strong>Các lựa chọn:</strong>
                            <ul class="mb-0">
                                ${question.options.map(option => `<li>${option}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="question-actions">
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${question.id}">Sửa</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${question.id}">Xóa</button>
                    </div>
                </div>
            `;
        });

        questionsContainer.innerHTML = html;

        // Thêm event listeners cho các nút sửa và xóa
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const questionId = this.getAttribute('data-id');
                const question = allQuestions.find(q => q.id === questionId);
                if (question) {
                    showEditQuestionForm(question);
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const questionId = this.getAttribute('data-id');
                questionToDelete = questionId;
                deleteModal.show();
            });
        });

        // Sau khi hiển thị tất cả câu hỏi, render lại MathJax
        if (window.MathJax) {
            MathJax.typesetPromise().catch((err) => console.error('Error rendering MathJax:', err));
        }
    }

    function searchQuestions() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // If search term is empty, just reload the current questions
            loadQuestions(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic, currentNavigation.exam);
            return;
        }
        
        // Filter the current questions based on the search term
        const filteredQuestions = allQuestions.filter(question => {
            return question.question.toLowerCase().includes(searchTerm) || 
                   (question.explanation && question.explanation.toLowerCase().includes(searchTerm)) ||
                   (question.type === 'multiple-choice' && question.options.some(option => option.toLowerCase().includes(searchTerm)));
        });
        
        // Display the filtered questions
        questionsContainer.innerHTML = '';
        
        if (filteredQuestions.length === 0) {
            questionsContainer.innerHTML = '<div class="alert alert-info">Không tìm thấy câu hỏi nào phù hợp với từ khóa tìm kiếm!</div>';
        } else {
            filteredQuestions.forEach((question, index) => {
                const questionElement = createQuestionCard(question, index + 1);
                questionsContainer.appendChild(questionElement);
            });
        }
    }

    function showAddQuestionForm() {
        resetQuestionForm();
        formTitle.textContent = 'Thêm Câu Hỏi Mới';
        questionEditor.style.display = 'block';
        
        // Set default question type to multiple-choice
        questionTypeSelect.value = 'multiple-choice';
        optionsContainer.style.display = 'block';
        
        // Add two default options
        addOptionField();
        addOptionField();
        
        // Scroll to the form
        questionEditor.scrollIntoView({ behavior: 'smooth' });
    }

    function hideQuestionForm() {
        questionEditor.style.display = 'none';
        resetQuestionForm();
    }

    function addOptionField() {
        const li = document.createElement('li');
        li.className = 'option-item';
        
        const index = optionsList.children.length;
        
        li.innerHTML = `
            <div class="input-group mb-2">
                <div class="input-group-prepend">
                    <span class="input-group-text">${index + 1}</span>
                </div>
                <input type="text" class="form-control option-input" placeholder="Nhập lựa chọn">
                <div class="input-group-append">
                    <button class="btn btn-outline-danger remove-option-btn" type="button"><i class="bi bi-x"></i></button>
                </div>
            </div>
        `;
        
        const removeBtn = li.querySelector('.remove-option-btn');
        removeBtn.addEventListener('click', function() {
            li.remove();
            // Update correctAnswer if needed
            const correctAnswer = parseInt(correctAnswerInput.value);
            if (!isNaN(correctAnswer) && index <= correctAnswer) {
                if (index === correctAnswer) {
                    correctAnswerInput.value = '';
                } else if (index < correctAnswer) {
                    correctAnswerInput.value = correctAnswer - 1;
                }
            }
            
            // Update option indices
            updateOptionIndices();
        });
        
        optionsList.appendChild(li);
        return li;
    }

    function updateOptionIndices() {
        const optionItems = optionsList.querySelectorAll('.option-item');
        optionItems.forEach((item, index) => {
            const indexEl = item.querySelector('.input-group-prepend .input-group-text');
            indexEl.textContent = index + 1;
        });
    }

    // Hàm hỗ trợ chuyển đổi phân số sang LaTeX
    function convertToLatex(text) {
        if (!text) return text;
        // Chuyển đổi phân số dạng a/b thành \frac{a}{b} nếu chưa ở định dạng đó
        return text.replace(/(\d+)\/(\d+)(?![^{]*\})/g, '\\frac{$1}{$2}');
    }
    
    // Hàm chuyển đổi ngược từ LaTeX sang dạng hiển thị thông thường (nếu cần)
    function convertFromLatex(text) {
        if (!text) return text;
        // Không chuyển từ \frac{a}{b} về a/b để giữ nguyên định dạng LaTeX trong CSDL
        return text;
    }

    function handleQuestionSubmit(event) {
        event.preventDefault();
        
        // Validate form
        if (questionTextInput.value.trim() === '') {
            alert('Vui lòng nhập nội dung câu hỏi!');
            return;
        }
        
        const questionType = questionTypeSelect.value;
        
        if (questionType === 'multiple-choice') {
            const optionInputs = optionsList.querySelectorAll('.option-input');
            if (optionInputs.length < 2) {
                alert('Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn!');
                return;
            }
            
            for (const input of optionInputs) {
                if (input.value.trim() === '') {
                    alert('Vui lòng nhập đầy đủ các lựa chọn!');
                    return;
                }
            }
            
            if (correctAnswerInput.value === '') {
                alert('Vui lòng chọn đáp án đúng!');
                return;
            }
            
            const correctAnswer = parseInt(correctAnswerInput.value);
            if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= optionInputs.length) {
                alert('Đáp án đúng không hợp lệ!');
                return;
            }
        } else {
            if (correctAnswerInput.value.trim() === '') {
                alert('Vui lòng nhập đáp án đúng!');
                return;
            }
        }
        
        loading.style.display = 'flex';
        
        // Gather options for multiple-choice questions
        let options = [];
        if (questionType === 'multiple-choice') {
            const optionInputs = optionsList.querySelectorAll('.option-input');
            optionInputs.forEach(input => {
                // Chuyển đổi phân số sang LaTeX trong options
                options.push(convertToLatex(input.value.trim()));
            });
        }
        
        // Create question object
        const questionData = {
            // Chuyển đổi phân số sang LaTeX
            question: convertToLatex(questionTextInput.value.trim()),
            type: questionType,
            // Chuyển đổi phân số sang LaTeX trong đáp án
            answer: questionType === 'multiple-choice' ? 
                parseInt(correctAnswerInput.value) : 
                convertToLatex(correctAnswerInput.value.trim()),
            grade: currentNavigation.grade,
            subject: currentNavigation.subject,
            topic: currentNavigation.topic,
            exam: currentNavigation.exam,
            // Chuyển đổi phân số sang LaTeX trong giải thích
            explanation: convertToLatex(explanationInput.value.trim()),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (questionType === 'multiple-choice') {
            questionData.options = options;
        }
        
        const db = firebase.firestore();
        
        if (currentQuestionId) {
            // Update existing question
            db.collection('questions').doc(currentQuestionId).update(questionData)
                .then(() => {
                    loading.style.display = 'none';
                    hideQuestionForm();
                    loadQuestions(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic, currentNavigation.exam);
                })
                .catch(error => {
                    console.error("Error updating question: ", error);
                    loading.style.display = 'none';
                    alert('Đã xảy ra lỗi khi cập nhật câu hỏi: ' + error.message);
                });
        } else {
            // Add new question
            // Get the current highest order value
            db.collection('questions')
                .where('grade', '==', currentNavigation.grade)
                .where('subject', '==', currentNavigation.subject)
                .where('topic', '==', currentNavigation.topic)
                .where('exam', '==', currentNavigation.exam)
                .orderBy('order', 'desc')
                .limit(1)
                .get()
                .then(querySnapshot => {
                    let order = 1;
                    if (!querySnapshot.empty) {
                        const lastQuestion = querySnapshot.docs[0].data();
                        order = (lastQuestion.order || 0) + 1;
                    }
                    
                    questionData.order = order;
                    questionData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    
                    console.log("Thêm câu hỏi mới:", questionData);
                    return db.collection('questions').add(questionData);
                })
                .then(() => {
                    loading.style.display = 'none';
                    hideQuestionForm();
                    loadQuestions(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic, currentNavigation.exam);
                })
                .catch(error => {
                    console.error("Error adding question: ", error);
                    loading.style.display = 'none';
                    alert('Đã xảy ra lỗi khi thêm câu hỏi: ' + error.message);
                });
        }
    }

    function resetQuestionForm() {
        currentQuestionId = null;
        questionIdInput.value = '';
        questionTypeSelect.value = 'multiple-choice';
        questionTextInput.value = '';
        optionsList.innerHTML = '';
        correctAnswerInput.value = '';
        explanationInput.value = '';
    }

    function showEditQuestionForm(question) {
        resetQuestionForm();
        currentQuestionId = question.id;
        
        formTitle.textContent = 'Sửa Câu Hỏi';
        questionIdInput.value = question.id;
        questionTypeSelect.value = question.type;
        // Chuyển đổi ngược từ LaTeX sang dạng thông thường để dễ chỉnh sửa
        questionTextInput.value = convertFromLatex(question.question);
        
        if (question.type === 'multiple-choice') {
            optionsContainer.style.display = 'block';
            
            // Add options
            if (question.options && question.options.length > 0) {
                question.options.forEach(option => {
                    const optionItem = addOptionField();
                    // Chuyển đổi ngược từ LaTeX sang dạng thông thường 
                    optionItem.querySelector('input').value = convertFromLatex(option);
                });
                
                // Set correct answer
                correctAnswerInput.value = question.answer;
            } else {
                // Add default options if missing
                addOptionField();
                addOptionField();
            }
        } else {
            optionsContainer.style.display = 'none';
            // Chuyển đổi ngược từ LaTeX sang dạng thông thường
            correctAnswerInput.value = convertFromLatex(question.answer);
        }
        
        if (question.explanation) {
            // Chuyển đổi ngược từ LaTeX sang dạng thông thường
            explanationInput.value = convertFromLatex(question.explanation);
        }
        
        questionEditor.style.display = 'block';
        
        // Scroll to the form
        questionEditor.scrollIntoView({ behavior: 'smooth' });
    }

    function deleteQuestion(questionId) {
        const db = firebase.firestore();
        
        db.collection('questions').doc(questionId).delete()
            .then(() => {
                loading.style.display = 'none';
                loadQuestions(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic, currentNavigation.exam);
            })
            .catch(error => {
                console.error("Error deleting question: ", error);
                loading.style.display = 'none';
                alert('Đã xảy ra lỗi khi xóa câu hỏi: ' + error.message);
            });
    }

    // Functions for navigation
    function initializeGradeScreen() {
        showScreen(gradeScreen);
        updateBreadcrumb('grade');
    }
    
    function navigateToSubjects(grade) {
        currentNavigation.grade = grade;
        loadSubjects(grade);
        showScreen(subjectScreen);
        updateBreadcrumb('subject');
        updateUrl();
    }
    
    function navigateToTopics(subject) {
        currentNavigation.subject = subject;
        loadTopics(currentNavigation.grade, subject);
        showScreen(topicScreen);
        updateBreadcrumb('topic');
        updateUrl();
        
        // Thêm nút import đề thi
        const topicActions = document.querySelector('#topic-screen .screen-actions');
        if (topicActions && !document.getElementById('import-exam-btn')) {
            topicActions.prepend(importExamBtn);
        }
    }
    
    function navigateToExams(topic) {
        currentNavigation.topic = topic;
        loadExams(currentNavigation.grade, currentNavigation.subject, topic);
        showScreen(examScreen);
        updateBreadcrumb('exam');
        updateUrl();
    }
    
    function navigateToQuestions(exam) {
        currentNavigation.exam = exam;
        loadQuestions(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic, exam);
        showScreen(questionsScreen);
        updateBreadcrumb('question');
        updateUrl();
        
        // Thêm nút import và export vào màn hình questions
        const screenActions = document.querySelector('#questions-screen .screen-actions');
        if (screenActions) {
            // Xóa các nút cũ nếu có
            const oldImportBtn = document.getElementById('import-json-btn');
            const oldExportBtn = document.getElementById('export-json-btn');
            if (oldImportBtn) {
                oldImportBtn.remove();
            }
            if (oldExportBtn) {
                oldExportBtn.remove();
            }
            
            // Đặt lại nút "Thêm câu hỏi" về cuối
            const addBtn = document.getElementById('add-question-btn');
            if (addBtn) {
                screenActions.appendChild(addBtn);
            }
            
            // Thêm nút import và export VÀO TRƯỚC nút "Thêm câu hỏi"
            const newImportBtn = importJsonBtn.cloneNode(true);
            const newExportBtn = exportJsonBtn.cloneNode(true);
            
            screenActions.insertBefore(newImportBtn, addBtn);
            screenActions.insertBefore(newExportBtn, addBtn);
            
            // Thêm lại event listeners
            document.getElementById('import-json-btn').addEventListener('click', function() {
                fileInput.click();
            });
            
            document.getElementById('export-json-btn').addEventListener('click', function() {
                exportQuestionsToJson();
            });
        } else {
            console.error("Không tìm thấy phần tử .screen-actions trong questionsScreen");
        }
    }
    
    function navigateToLevel(level) {
        switch(level) {
            case 'grade':
                initializeGradeScreen();
                currentNavigation = { grade: null, subject: null, topic: null, exam: null };
                updateUrl();
                break;
            case 'subject':
                navigateToSubjects(currentNavigation.grade);
                currentNavigation.subject = null;
                currentNavigation.topic = null;
                currentNavigation.exam = null;
                updateUrl();
                break;
            case 'topic':
                navigateToTopics(currentNavigation.subject);
                currentNavigation.topic = null;
                currentNavigation.exam = null;
                updateUrl();
                break;
            case 'exam':
                navigateToExams(currentNavigation.topic);
                currentNavigation.exam = null;
                updateUrl();
                break;
        }
    }
    
    function showScreen(screen) {
        // Hide all screens
        gradeScreen.style.display = 'none';
        subjectScreen.style.display = 'none';
        topicScreen.style.display = 'none';
        examScreen.style.display = 'none';
        questionsScreen.style.display = 'none';
        
        // Show the selected screen
        screen.style.display = 'block';
    }
    
    function updateBreadcrumb(level) {
        let html = '';
        
        // Always add the Home/Grade link
        html += `<li class="breadcrumb-item"><a href="#" data-level="grade">Lớp</a></li>`;
        
        if (level === 'grade') {
            // If we're at the grade level, mark it as active
            breadcrumbNav.innerHTML = `<li class="breadcrumb-item active" aria-current="page">Lớp</li>`;
            return;
        }
        
        // Add grade level
        html += `<li class="breadcrumb-item"><a href="#" data-level="subject">Lớp ${currentNavigation.grade}</a></li>`;
        
        if (level === 'subject') {
            // If we're at the subject level, mark it as active
            breadcrumbNav.innerHTML = html + `<li class="breadcrumb-item active" aria-current="page">Môn học</li>`;
            return;
        }
        
        // Add subject level
        html += `<li class="breadcrumb-item"><a href="#" data-level="topic">${currentNavigation.subject}</a></li>`;
        
        if (level === 'topic') {
            // If we're at the topic level, mark it as active
            breadcrumbNav.innerHTML = html + `<li class="breadcrumb-item active" aria-current="page">Chuyên đề</li>`;
            return;
        }
        
        // Add topic level
        html += `<li class="breadcrumb-item"><a href="#" data-level="exam">${currentNavigation.topic}</a></li>`;
        
        if (level === 'exam') {
            // If we're at the exam level, mark it as active
            breadcrumbNav.innerHTML = html + `<li class="breadcrumb-item active" aria-current="page">Đề thi</li>`;
            return;
        }
        
        // Add exam level and questions
        html += `<li class="breadcrumb-item"><a href="#">${currentNavigation.exam}</a></li>`;
        breadcrumbNav.innerHTML = html + `<li class="breadcrumb-item active" aria-current="page">Câu hỏi</li>`;
    }

    // Functions for managing categories
    function showAddCategoryModal(type) {
        categoryTypeInput.value = type;
        
        // Set the title according to the type
        switch(type) {
            case 'grade':
                categoryModalLabel.textContent = 'Thêm Lớp Mới';
                categoryNameInput.placeholder = 'Nhập tên lớp (Ví dụ: 6)';
                break;
            case 'subject':
                categoryModalLabel.textContent = 'Thêm Môn Học Mới';
                categoryNameInput.placeholder = 'Nhập tên môn học';
                break;
            case 'topic':
                categoryModalLabel.textContent = 'Thêm Chuyên Đề Mới';
                categoryNameInput.placeholder = 'Nhập tên chuyên đề';
                break;
            case 'exam':
                categoryModalLabel.textContent = 'Thêm Đề Thi Mới';
                categoryNameInput.placeholder = 'Nhập tên đề thi';
                break;
        }
        
        categoryNameInput.value = '';
        categoryModal.show();
    }
    
    function saveCategory() {
        const type = categoryTypeInput.value;
        const name = categoryNameInput.value.trim();
        
        if (name === '') {
            alert('Vui lòng nhập tên!');
            return;
        }
        
        loading.style.display = 'flex';
        
        switch(type) {
            case 'grade':
                saveGrade(name);
                break;
            case 'subject':
                saveSubject(name);
                break;
            case 'topic':
                saveTopic(name);
                break;
            case 'exam':
                saveExam(name);
                break;
        }
        
        categoryModal.hide();
    }
    
    function saveGrade(name) {
        const db = firebase.firestore();
        
        db.collection('grades').add({
            name: name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            loading.style.display = 'none';
            // Add a new grade card to the UI
            const gradeCardsContainer = document.getElementById('grade-cards-container');
            const newGradeCard = document.createElement('div');
            newGradeCard.className = 'col-md-4 mb-4';
            newGradeCard.innerHTML = `
                <div class="card category-card" data-grade="${name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">Lớp ${name}</h5>
                        <button class="btn btn-sm btn-outline-danger delete-grade-btn" data-grade="${name}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            gradeCardsContainer.insertBefore(newGradeCard, document.querySelector('.add-grade-card').parentNode);
            
            // Add event listeners to the new card
            newGradeCard.querySelector('.category-card').addEventListener('click', function() {
                navigateToSubjects(name);
            });
            
            newGradeCard.querySelector('.delete-grade-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                showDeleteModal('grade', name);
            });
        })
        .catch(error => {
            console.error("Error adding grade: ", error);
            loading.style.display = 'none';
            alert('Đã xảy ra lỗi khi thêm lớp: ' + error.message);
        });
    }
    
    function saveSubject(name) {
        const db = firebase.firestore();
        
        db.collection('subjects').add({
            name: name,
            grade: currentNavigation.grade,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            loading.style.display = 'none';
            loadSubjects(currentNavigation.grade);
        })
        .catch(error => {
            console.error("Error adding subject: ", error);
            loading.style.display = 'none';
            alert('Đã xảy ra lỗi khi thêm môn học: ' + error.message);
        });
    }
    
    function saveTopic(name) {
        const db = firebase.firestore();
        
        db.collection('topics').add({
            name: name,
            grade: currentNavigation.grade,
            subject: currentNavigation.subject,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            loading.style.display = 'none';
            loadTopics(currentNavigation.grade, currentNavigation.subject);
        })
        .catch(error => {
            console.error("Error adding topic: ", error);
            loading.style.display = 'none';
            alert('Đã xảy ra lỗi khi thêm chuyên đề: ' + error.message);
        });
    }
    
    function saveExam(name) {
        const db = firebase.firestore();
        
        db.collection('exams').add({
            name: name,
            grade: currentNavigation.grade,
            subject: currentNavigation.subject,
            topic: currentNavigation.topic,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            loading.style.display = 'none';
            loadExams(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic);
        })
        .catch(error => {
            console.error("Error adding exam: ", error);
            loading.style.display = 'none';
            alert('Đã xảy ra lỗi khi thêm đề thi: ' + error.message);
        });
    }
    
    function showDeleteModal(type, id) {
        deleteTarget.type = type;
        deleteTarget.id = id;
        
        // Gán giá trị cho questionToDelete nếu loại là question
        if (type === 'question') {
            questionToDelete = id;
        } else {
            questionToDelete = null;
        }
        
        switch(type) {
            case 'grade':
                deleteMessage.textContent = `Bạn có chắc chắn muốn xóa Lớp ${id}? Tất cả môn học, chuyên đề, đề thi và câu hỏi liên quan cũng sẽ bị xóa.`;
                break;
            case 'subject':
                deleteMessage.textContent = `Bạn có chắc chắn muốn xóa môn học "${id}"? Tất cả chuyên đề, đề thi và câu hỏi liên quan cũng sẽ bị xóa.`;
                break;
            case 'topic':
                deleteMessage.textContent = `Bạn có chắc chắn muốn xóa chuyên đề "${id}"? Tất cả đề thi và câu hỏi liên quan cũng sẽ bị xóa.`;
                break;
            case 'exam':
                deleteMessage.textContent = `Bạn có chắc chắn muốn xóa đề thi "${id}"? Tất cả câu hỏi liên quan cũng sẽ bị xóa.`;
                break;
            case 'question':
                deleteMessage.textContent = `Bạn có chắc chắn muốn xóa câu hỏi này?`;
                break;
        }
        
        deleteModal.show();
    }
    
    async function confirmDelete() {
        loading.style.display = 'flex';
        
        try {
            const db = firebase.firestore();
            
            if (deleteTarget.type === 'question') {
                await db.collection("questions").doc(questionToDelete).delete();
                alert('Xóa câu hỏi thành công!');
                // Tải lại danh sách câu hỏi
                await loadQuestions(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic, currentNavigation.exam);
            } else if (deleteTarget.type === 'grade') {
                // Xử lý xóa lớp
                // TODO: Implement deletion logic for grade
            } else if (deleteTarget.type === 'subject') {
                // Xử lý xóa môn học
                // TODO: Implement deletion logic for subject
            } else if (deleteTarget.type === 'topic') {
                // Xử lý xóa chuyên đề
                // TODO: Implement deletion logic for topic
            } else if (deleteTarget.type === 'exam') {
                // Xử lý xóa đề thi
                // TODO: Implement deletion logic for exam
            }
            
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!');
        } finally {
            loading.style.display = 'none';
            deleteModal.hide();
            questionToDelete = null;
        }
    }

    // Functions for loading data
    function loadSubjects(grade) {
        loading.style.display = 'flex';
        const db = firebase.firestore();
        
        db.collection('subjects')
            .where('grade', '==', grade)
            .orderBy('createdAt')
            .get()
            .then(querySnapshot => {
                subjectContainer.innerHTML = '';
                
                if (querySnapshot.empty) {
                    subjectContainer.innerHTML = '<div class="alert alert-info">Chưa có môn học nào cho lớp này. Hãy thêm môn học mới!</div>';
                } else {
                    querySnapshot.forEach(doc => {
                        const subject = doc.data();
                        const subjectElement = createCategoryCard(subject.name, 'subject', doc.id);
                        subjectContainer.appendChild(subjectElement);
                    });
                }
                
                loading.style.display = 'none';
            })
            .catch(error => {
                console.error("Error loading subjects: ", error);
                loading.style.display = 'none';
                alert('Đã xảy ra lỗi khi tải môn học: ' + error.message);
            });
    }
    
    function loadTopics(grade, subject) {
        loading.style.display = 'flex';
        const db = firebase.firestore();
        
        db.collection('topics')
            .where('grade', '==', grade)
            .where('subject', '==', subject)
            .orderBy('createdAt')
            .get()
            .then(querySnapshot => {
                topicContainer.innerHTML = '';
                
                if (querySnapshot.empty) {
                    topicContainer.innerHTML = '<div class="alert alert-info">Chưa có chuyên đề nào cho môn học này. Hãy thêm chuyên đề mới!</div>';
                } else {
                    querySnapshot.forEach(doc => {
                        const topic = doc.data();
                        const topicElement = createCategoryCard(topic.name, 'topic', doc.id);
                        topicContainer.appendChild(topicElement);
                    });
                }
                
                loading.style.display = 'none';
            })
            .catch(error => {
                console.error("Error loading topics: ", error);
                loading.style.display = 'none';
                alert('Đã xảy ra lỗi khi tải chuyên đề: ' + error.message);
            });
    }
    
    function loadExams(grade, subject, topic) {
        loading.style.display = 'flex';
        const db = firebase.firestore();
        
        db.collection('exams')
            .where('grade', '==', grade)
            .where('subject', '==', subject)
            .where('topic', '==', topic)
            .orderBy('createdAt')
            .get()
            .then(querySnapshot => {
                examContainer.innerHTML = '';
                
                if (querySnapshot.empty) {
                    examContainer.innerHTML = '<div class="alert alert-info">Chưa có đề thi nào cho chuyên đề này. Hãy thêm đề thi mới!</div>';
                } else {
                    querySnapshot.forEach(doc => {
                        const exam = doc.data();
                        const examElement = createCategoryCard(exam.name, 'exam', doc.id);
                        examContainer.appendChild(examElement);
                    });
                }
                
                loading.style.display = 'none';
            })
            .catch(error => {
                console.error("Error loading exams: ", error);
                loading.style.display = 'none';
                alert('Đã xảy ra lỗi khi tải đề thi: ' + error.message);
            });
    }
    
    function createCategoryCard(name, type, id) {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        let icon = '';
        let title = '';
        
        switch(type) {
            case 'subject':
                icon = 'bi-book';
                title = name;
                break;
            case 'topic':
                icon = 'bi-bookmark';
                title = name;
                break;
            case 'exam':
                icon = 'bi-file-text';
                title = name;
                break;
        }
        
        col.innerHTML = `
            <div class="card category-card" data-id="${id}" data-name="${name}">
                <div class="card-body">
                    <h5 class="card-title"><i class="bi ${icon} me-2"></i>${title}</h5>
                    <div class="card-actions">
                        <button class="btn btn-sm btn-outline-danger delete-${type}-btn" data-id="${id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const card = col.querySelector('.category-card');
        const deleteBtn = col.querySelector(`.delete-${type}-btn`);
        
        card.addEventListener('click', function() {
            switch(type) {
                case 'subject':
                    navigateToTopics(name);
                    break;
                case 'topic':
                    navigateToExams(name);
                    break;
                case 'exam':
                    navigateToQuestions(name);
                    break;
            }
        });
        
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showDeleteModal(type, id);
        });
        
        return col;
    }

    // Functions for handling questions
    function createQuestionCard(question, index) {
        const col = document.createElement('div');
        col.className = 'col-md-12 mb-4';
        
        // Sử dụng question.order thay vì index
        const displayIndex = question.order || index || '';
        
        // Xử lý nội dung có LaTeX trong câu hỏi
        const processedQuestion = processLatexInText(question.question);
        
        let answerHtml = '';
        if (question.type === 'multiple-choice') {
            // Tạo phần hiển thị các lựa chọn và đánh dấu đáp án đúng
            answerHtml = '<ul class="options-list mt-2">';
            question.options.forEach((option, i) => {
                const isCorrect = i === question.answer;
                const optionLabel = ["A", "B", "C", "D", "E", "F"][i];
                // Xử lý biểu thức LaTeX trong tùy chọn
                const processedOption = processLatexInText(option);
                answerHtml += `
                    <li class="${isCorrect ? 'fw-bold text-success' : ''}">
                        ${optionLabel}. ${processedOption} ${isCorrect ? '<span class="badge bg-success">Đáp án đúng</span>' : ''}
                    </li>
                `;
            });
            answerHtml += '</ul>';
        } else {
            // Xử lý biểu thức LaTeX trong đáp án điền khuyết
            const processedAnswer = processLatexInText(question.answer);
            answerHtml = `<div class="fill-blank-answer mt-2"><strong>Đáp án điền khuyết:</strong> ${processedAnswer}</div>`;
        }
        
        let explanationHtml = '';
        if (question.explanation && question.explanation.trim() !== '') {
            // Xử lý biểu thức LaTeX trong phần giải thích
            const processedExplanation = processLatexInText(question.explanation);
            explanationHtml = `
                <div class="explanation mt-2">
                    <strong>Giải thích:</strong> ${processedExplanation}
                </div>
            `;
        }
        
        col.innerHTML = `
            <div class="card question-card" data-id="${question.id}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Câu ${displayIndex}: ${question.type === 'multiple-choice' ? 'Trắc nghiệm' : 'Điền từ'}</h5>
                    <div>
                        <button class="btn btn-sm btn-primary edit-question-btn">
                            <i class="bi bi-pencil"></i> Sửa
                        </button>
                        <button class="btn btn-sm btn-danger delete-question-btn">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="question-text mb-3">${processedQuestion}</div>
                    ${answerHtml}
                    ${explanationHtml}
                </div>
            </div>
        `;
        
        // Add event listeners
        const editBtn = col.querySelector('.edit-question-btn');
        const deleteBtn = col.querySelector('.delete-question-btn');
        
        editBtn.addEventListener('click', function() {
            showEditQuestionForm(question);
        });
        
        deleteBtn.addEventListener('click', function() {
            showDeleteModal('question', question.id);
        });
        
        // Render lại MathJax sau khi thêm card
        setTimeout(() => {
            if (window.MathJax) {
                MathJax.typesetPromise([col]).catch((err) => console.error('Error rendering MathJax:', err));
            }
        }, 100);
        
        return col;
    }

    // Thêm chức năng import từ JSON
    async function importQuestionsFromJson(jsonData) {
        if (!Array.isArray(jsonData)) {
            alert('Dữ liệu không hợp lệ. Cần định dạng mảng các câu hỏi.');
            return;
        }
        
        if (jsonData.length === 0) {
            alert('Không có câu hỏi nào trong file.');
            return;
        }
        
        // Validate dữ liệu
        for (let i = 0; i < jsonData.length; i++) {
            const question = jsonData[i];
            if (!question.question || !question.type) {
                alert(`Câu hỏi thứ ${i+1} thiếu thông tin bắt buộc (question hoặc type).`);
                return;
            }
            
            if (question.type === 'multiple-choice' && (!Array.isArray(question.options) || question.options.length < 2)) {
                alert(`Câu hỏi trắc nghiệm thứ ${i+1} phải có ít nhất 2 lựa chọn.`);
                return;
            }
            
            if (question.type === 'multiple-choice' && (typeof question.answer !== 'number' || question.answer < 0 || question.answer >= (question.options?.length || 0))) {
                alert(`Câu hỏi trắc nghiệm thứ ${i+1} có đáp án không hợp lệ.`);
                return;
            }
            
            if (question.type === 'fill-in-blank' && !question.answer) {
                alert(`Câu hỏi điền từ thứ ${i+1} thiếu đáp án.`);
                return;
            }
        }
        
        // Confirm import
        if (!confirm(`Bạn có chắc chắn muốn import ${jsonData.length} câu hỏi vào đề thi hiện tại?`)) {
            return;
        }
        
        loading.style.display = 'flex';
        const db = firebase.firestore();
        
        try {
            // Lấy order cao nhất hiện tại
            const querySnapshot = await db.collection('questions')
                .where('grade', '==', currentNavigation.grade)
                .where('subject', '==', currentNavigation.subject)
                .where('topic', '==', currentNavigation.topic)
                .where('exam', '==', currentNavigation.exam)
                .orderBy('order', 'desc')
                .limit(1)
                .get();
            
            let currentOrder = 0;
            if (!querySnapshot.empty) {
                const lastQuestion = querySnapshot.docs[0].data();
                currentOrder = (lastQuestion.order || 0);
            }
            
            // Thêm các câu hỏi vào database
            let successCount = 0;
            for (let i = 0; i < jsonData.length; i++) {
                const question = jsonData[i];
                const questionData = {
                    // Chuyển đổi phân số sang LaTeX
                    question: convertToLatex(question.question),
                    type: question.type,
                    answer: question.type === 'multiple-choice' ? 
                        question.answer : 
                        convertToLatex(question.answer),
                    explanation: convertToLatex(question.explanation || ''),
                    grade: currentNavigation.grade,
                    subject: currentNavigation.subject,
                    topic: currentNavigation.topic,
                    exam: currentNavigation.exam,
                    order: currentOrder + i + 1,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                if (question.type === 'multiple-choice') {
                    // Chuyển đổi phân số sang LaTeX trong options
                    questionData.options = question.options.map(opt => convertToLatex(opt));
                }
                
                await db.collection('questions').add(questionData);
                successCount++;
            }
            
            alert(`Đã import thành công ${successCount} câu hỏi.`);
            
            // Tải lại danh sách câu hỏi
            await loadQuestions(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic, currentNavigation.exam);
        } catch (error) {
            console.error("Error importing questions:", error);
            alert('Đã xảy ra lỗi khi import câu hỏi: ' + error.message);
        } finally {
            loading.style.display = 'none';
            fileInput.value = ''; // Reset input file
        }
    }

    // Hàm export câu hỏi ra JSON
    function exportQuestionsToJson() {
        if (allQuestions.length === 0) {
            alert("Không có câu hỏi nào để export!");
            return;
        }
        
        // Export đề thi và câu hỏi
        const examData = {
            exam: {
                name: currentNavigation.exam,
                grade: currentNavigation.grade,
                subject: currentNavigation.subject,
                topic: currentNavigation.topic
            },
            questions: allQuestions.map(question => {
                const exportQuestion = {
                    question: question.question,
                    type: question.type,
                    answer: question.answer,
                    order: question.order
                };
                
                if (question.explanation) {
                    exportQuestion.explanation = question.explanation;
                }
                
                if (question.type === 'multiple-choice' && question.options) {
                    exportQuestion.options = question.options;
                }
                
                return exportQuestion;
            })
        };
        
        // Tạo và download file JSON
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(examData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        const fileName = `exam_${currentNavigation.grade}_${currentNavigation.subject}_${currentNavigation.topic}_${currentNavigation.exam}.json`;
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Hàm import toàn bộ đề thi
    async function importFullExam(jsonData) {
        if (!jsonData || typeof jsonData !== 'object') {
            alert('Dữ liệu không hợp lệ. Cần định dạng đề thi hợp lệ.');
            return;
        }
        
        // Kiểm tra cấu trúc file JSON
        if (!jsonData.exam || !jsonData.questions || !Array.isArray(jsonData.questions)) {
            alert('Cấu trúc file JSON không hợp lệ. Cần có thông tin đề thi và danh sách câu hỏi.');
            return;
        }
        
        const examData = jsonData.exam;
        const questions = jsonData.questions;
        
        if (!examData.name) {
            alert('Thiếu thông tin tên đề thi.');
            return;
        }
        
        if (questions.length === 0) {
            alert('Không có câu hỏi nào trong đề thi.');
            return;
        }
        
        // Validate câu hỏi
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (!question.question || !question.type) {
                alert(`Câu hỏi thứ ${i+1} thiếu thông tin bắt buộc (question hoặc type).`);
                return;
            }
            
            if (question.type === 'multiple-choice' && (!Array.isArray(question.options) || question.options.length < 2)) {
                alert(`Câu hỏi trắc nghiệm thứ ${i+1} phải có ít nhất 2 lựa chọn.`);
                return;
            }
            
            if (question.type === 'multiple-choice' && (typeof question.answer !== 'number' || question.answer < 0 || question.answer >= (question.options?.length || 0))) {
                alert(`Câu hỏi trắc nghiệm thứ ${i+1} có đáp án không hợp lệ.`);
                return;
            }
            
            if (question.type === 'fill-in-blank' && !question.answer) {
                alert(`Câu hỏi điền từ thứ ${i+1} thiếu đáp án.`);
                return;
            }
        }
        
        // Xác nhận import
        if (!confirm(`Bạn có chắc chắn muốn import đề thi "${examData.name}" với ${questions.length} câu hỏi?`)) {
            return;
        }
        
        loading.style.display = 'flex';
        const db = firebase.firestore();
        
        try {
            // Thêm đề thi mới
            const examRef = await db.collection('exams').add({
                name: examData.name,
                grade: currentNavigation.grade,
                subject: currentNavigation.subject,
                topic: currentNavigation.topic,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Thêm các câu hỏi
            let batch = db.batch();
            let batchCount = 0;
            const BATCH_LIMIT = 500; // Firestore giới hạn 500 operations/batch
            
            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];
                const questionRef = db.collection('questions').doc();
                
                const questionData = {
                    // Chuyển đổi phân số sang LaTeX
                    question: convertToLatex(question.question),
                    type: question.type,
                    answer: question.type === 'multiple-choice' ? 
                        question.answer : 
                        convertToLatex(question.answer),
                    explanation: convertToLatex(question.explanation || ''),
                    grade: currentNavigation.grade,
                    subject: currentNavigation.subject,
                    topic: currentNavigation.topic,
                    exam: examData.name,
                    order: question.order || (i + 1),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                if (question.type === 'multiple-choice') {
                    // Chuyển đổi phân số sang LaTeX trong options
                    questionData.options = question.options.map(opt => convertToLatex(opt));
                }
                
                batch.set(questionRef, questionData);
                batchCount++;
                
                // Nếu đạt đến giới hạn batch, commit và tạo batch mới
                if (batchCount >= BATCH_LIMIT) {
                    await batch.commit();
                    batch = db.batch();
                    batchCount = 0;
                }
            }
            
            // Commit batch cuối cùng nếu có
            if (batchCount > 0) {
                await batch.commit();
            }
            
            alert(`Đã import thành công đề thi "${examData.name}" với ${questions.length} câu hỏi.`);
            
            // Chuyển đến đề thi mới import
            loadExams(currentNavigation.grade, currentNavigation.subject, currentNavigation.topic);
            navigateToQuestions(examData.name);
            
        } catch (error) {
            console.error("Error importing exam:", error);
            alert('Đã xảy ra lỗi khi import đề thi: ' + error.message);
        } finally {
            loading.style.display = 'none';
            examFileInput.value = ''; // Reset input file
        }
    }

    // Hàm tối ưu hiệu suất - lazy load các components không cần thiết ngay lập tức
    function initializeComponents() {
        if (initialized) return;
        initialized = true;
        
        console.log('Initializing components...');
        
        // Các hàm khởi tạo khác có thể được thêm vào đây
        
        const endTime = performance.now();
        console.log(`Trang đã tải trong ${Math.round(endTime - startTime)}ms`);
    }
    
    // Đăng ký sự kiện khi người dùng tương tác với trang
    document.addEventListener('click', initializeComponents, {once: true});
    document.addEventListener('keydown', initializeComponents, {once: true});
    
    // Tự động khởi tạo sau 2 giây nếu người dùng chưa tương tác
    setTimeout(initializeComponents, 2000);
    
    // Sau khi trang đã tải xong
    window.addEventListener('load', function() {
        // MathJax đã được tải bằng script trong HTML
        console.log('Trang đã tải xong');
    });
});
