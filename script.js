class Question {
    constructor(title, image, answers, correctAnswer) {
        this.title = title;
        this.image = image;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    isCorrect(answer) {
        return answer === this.correctAnswer;
    }
}

class AnimalQuiz {
    constructor() {
        this.homePage = document.getElementById('homePage');
        this.questionContainer = document.getElementById('questionContainer');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.studentNameInput = document.getElementById('studentName');
        this.startButton = document.getElementById('startButton');
        this.questionTitle = document.getElementById('questionTitle');
        this.questionImage = document.getElementById('questionImage');
        this.answerOptions = document.getElementById('answerOptions');
        this.nextButton = document.getElementById('nextButton');
        this.timerProgress = document.getElementById('timerProgress');
        this.retakeButton = document.getElementById('retakeButton');
        
        this.questions = this.initializeQuestions();
        this.shuffledQuestions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.correctAnswers = 0;
        this.timeLeft = 60;
        this.timerInterval = null;
        
        this.initializeEvents();
    }
    
    initializeQuestions() {
        return [
            new Question(
                "The picture shown here is of a dog, for sure. But can you name what is the breed of this dog?",
                "dog.jpg",
                [
                    "It's a cute, little Bulldog.",
                    "Umm..german shepherd, maybe.",
                    "It's a puppy golden retriever.",
                    "I think it's a cat."
                ],
                "Umm..german shepherd, maybe."
            ),
            new Question(
                "Look at the picture and guess which animal it is.",
                "rabbit.jpg",
                [
                    "A baby horse",
                    "Rabbits",
                    "It's a baby bird",
                    "I don't know"
                ],
                "Rabbits"
            ),
            new Question(
                "This is an easy question. Which animal is shown in the picture?",
                "bear.jpg",
                [
                    "It's a panda",
                    "A bear",
                    "Tiger",
                    "Lion"
                ],
                "A bear"
            ),
            new Question(
                "Of course, it is a bird. Can you name which bird it is?",
                "bird.jpg",
                [
                    "Dove",
                    "Songbirds",
                    "American Robin",
                    "Peacock"
                ],
                "Songbirds"
            ),
            new Question(
                "What is the breed of this cat?",
                "cat.jpg",
                [
                    "Siamese",
                    "Persian Cat",
                    "Ragdoll",
                    "None of the above"
                ],
                "Persian Cat"
            ),
            new Question(
                "Now, tell us the name of this animal.",
                "elephant.jpg",
                [
                    "Pig",
                    "An elephant",
                    "American Bison",
                    "Wolf"
                ],
                "An elephant"
            ),
            new Question(
                "This is a very common and famous animal. I'm sure that you must have seen it at least once in your life. Can you name it?",
                "rooster.jpg",
                [
                    "A rooster",
                    "Horse",
                    "Penguin",
                    "Mouse"
                ],
                "A rooster"
            ),
            new Question(
                "Name this popular animal that is also known as 'Ship of the desert'.",
                "camel.jpg",
                [
                    "Camel",
                    "Lion",
                    "Horse",
                    "Wolf"
                ],
                "Camel"
            ),
            new Question(
                "What is the name of this animal? (Hint- we know this animal as the 'King of the forest').",
                "lion.jpg",
                [
                    "Horse",
                    "Elephant",
                    "Lion",
                    "Wolf"
                ],
                "Lion"
            ),
            new Question(
                "The famous movie 'Stuart Little' was based on the life of this adorable animal. What is the name of this animal?",
                "mouse.jpg",
                [
                    "It's a mouse",
                    "It's snowbell-the cat.",
                    "I think it's a rabbit, maybe.",
                    "I don't know"
                ],
                "It's a mouse"
            )
        ];
    }
    
    initializeEvents() {
        this.studentNameInput.addEventListener('input', () => {
            this.startButton.disabled = !this.studentNameInput.value.trim();
        });
        
        this.startButton.addEventListener('click', () => this.startExam());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.retakeButton.addEventListener('click', () => this.resetExam());
    }
    
    startExam() {
        this.homePage.style.display = 'none';
        this.questionContainer.style.display = 'flex';
        
        this.shuffledQuestions = [...this.questions].sort(() => Math.random() - 0.5);
        
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        
        this.displayQuestion();
        this.startTimer();
    }
    
    displayQuestion() {
        const currentQuestion = this.shuffledQuestions[this.currentQuestionIndex];
        
        this.questionTitle.textContent = currentQuestion.title;
        this.questionImage.src = "images/" + currentQuestion.image;
        this.questionImage.alt = currentQuestion.title;
        
        this.answerOptions.innerHTML = '';
        
        const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);
        
        shuffledAnswers.forEach(answer => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.textContent = answer;
            answerElement.addEventListener('click', () => this.selectAnswer(answerElement, answer));
            this.answerOptions.appendChild(answerElement);
        });
        
        this.nextButton.disabled = true;
        this.selectedAnswer = null;
    }
    
    selectAnswer(element, answer) {
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => option.classList.remove('selected'));
        
        element.classList.add('selected');
        this.selectedAnswer = answer;
        this.nextButton.disabled = false;
    }
    
    nextQuestion() {
        const currentQuestion = this.shuffledQuestions[this.currentQuestionIndex];
        if (currentQuestion.isCorrect(this.selectedAnswer)) {
            this.correctAnswers++;
        }
        
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.shuffledQuestions.length) {
            this.finishExam();
            return;
        }
        
        this.displayQuestion();
    }
    
    startTimer() {
        clearInterval(this.timerInterval);
        this.timeLeft = 60;
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            
            const percentage = (this.timeLeft / 60) * 100;
            this.timerProgress.style.width = `${percentage}%`;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.finishExam();
            }
        }, 1000);
    }
    
    finishExam() {
        clearInterval(this.timerInterval);
        this.questionContainer.style.display = 'none';
        this.resultsContainer.style.display = 'flex';

        const percentage = (this.correctAnswers / this.shuffledQuestions.length) * 100;
        
        document.getElementById('percentage').textContent = percentage.toFixed(1) + '%';
        
        document.getElementById('result-text').textContent = 
            `You have ${this.correctAnswers} out of ${this.shuffledQuestions.length} correct answers`;
        
        document.getElementById('progress').style.setProperty('--progress', percentage + '%');
    }
    
    resetExam() {
        this.resultsContainer.style.display = 'none';
        this.homePage.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const quiz = new AnimalQuiz();
});