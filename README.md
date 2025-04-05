# Interactive Quiz Application

A responsive, interactive quiz application built with JavaScript and Bootstrap that provides users with instant feedback on their answers and tracks their score throughout the quiz.

## Features

- **Dynamic Question Loading**: Questions are loaded one at a time with randomized order
- **Instant Feedback**: Immediate visual and textual feedback for each answer
- **Scoring System**: Real-time score tracking and display
- **Progress Tracking**: Visual progress bar shows quiz completion
- **Detailed Explanations**: Explanations provided for both correct and incorrect answers
- **Responsive Design**: Works on all device sizes
- **Restart Capability**: Take the quiz multiple times with randomized questions

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5

## Installation

No installation required! Simply open the `index.html` file in any modern web browser.

To customize the quiz:

1. Clone or download this repository
2. Edit the `quizQuestions` array in `quiz.js` to add your own questions
3. Open `index.html` in your browser to test your changes

## Customizing the Quiz

To add your own questions, modify the `quizQuestions` array in `quiz.js`. Each question should follow this format:

```javascript
{
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    answer: "Correct Answer",
    explanation: "Explanation of the correct answer"
}
```

## How to Use

1. Click the "Start Quiz" button
2. Read the question carefully
3. Click on your chosen answer
4. View the feedback and explanation
5. Click "Next Question" to proceed
6. After the last question, view your final score and performance comment
7. Click "Restart Quiz" to try again

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- Add different quiz categories
- Implement a timer for each question
- Add difficulty levels
- Include multimedia (images, audio) in questions
- Save high scores locally

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.
