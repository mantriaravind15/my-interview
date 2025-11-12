import { Component } from "react";
import "./App.css";

const interview_questions = [
  {
    HTML: [
      "What is the full form of HTML?",
      "What is the purpose of the <DOCTYPE html> tag?",
      "What is the difference between <div> and <span>?",
      "What are semantic HTML elements? Give examples.",
      "What is the difference between block-level and inline elements?",
      "What is the use of meta tags in HTML?",
      "What are self-closing tags?",
      "What is the difference between id and class?",
      "How do you embed audio and video in HTML?",
      "What are data-* attributes?"
    ]
  },
  {
    CSS: [
      "What does CSS stand for?",
      "What are the different types of CSS?",
      "Difference between class and id selector?",
      "What is the box model in CSS?",
      "What are pseudo-classes and pseudo-elements?",
      "Explain display: block, inline, inline-block.",
      "What is Flexbox? Why do we use it?",
      "What is CSS Grid?",
      "What is media query?",
      "Difference between absolute, relative, fixed, and sticky positioning?"
    ]
  },
  {
    JAVASCRIPT: [
      "What is JavaScript?",
      "Difference between var, let, and const?",
      "What are data types in JS?",
      "What is hoisting in JavaScript?",
      "What is a callback function?",
      "What is a promise?",
      "What is async/await?",
      "What are arrow functions?",
      "What is event bubbling and capturing?",
      "Explain closures in JavaScript.",
      "What is the difference between == and ===?",
      "What is the DOM?",
      "What is localStorage and sessionStorage?",
      "What is a Higher-Order Function?",
      "What is the difference between map, filter, and reduce?"
    ]
  },
  {
    REACT: [
      "What is React?",
      "What is JSX?",
      "What are components? Difference: Functional vs Class Components?",
      "What are props?",
      "What is state in React?",
      "What is useState hook?",
      "What is useEffect hook?",
      "What is Virtual DOM?",
      "What is React Router?",
      "What are controlled and uncontrolled components?",
      "What is Redux and why is it used?",
      "What is Context API?",
      "What is useRef?",
      "What are React keys and why use them?",
      "What are custom hooks?"
    ]
  }
];

class App extends Component {
  state = {
    proceed: false,
    start: false,
    email: "",
    password: "",
    accountStatus: false,
    activeTopic: "HTML",
    currentIndex: 0,
    randomQuestion: interview_questions[0].HTML[0],
    history: [],
    errorMsg: "",
    successMsg: ""
  };

  componentDidMount() {
    this.speakQuestion();
  }

  onChangeTopice = (event) => {
    const newTopic = event.target.value;
    const getTopicQuestions = interview_questions.find(each => each[newTopic])[newTopic];
    this.setState({
      activeTopic: newTopic,
      currentIndex: 0,
      randomQuestion: getTopicQuestions[0],
      history: []
    });
  };

  onNextQuestion = () => {
    this.updateRandomQuestion();
  };

  updateRandomQuestion = () => {
    const { activeTopic, currentIndex, history } = this.state;
    const getTopicQuestions = interview_questions.find(each => each[activeTopic])[activeTopic];
    const nextIndex = (currentIndex + 1) % getTopicQuestions.length;
    const nextQuestion = getTopicQuestions[nextIndex];
    this.setState(
      { currentIndex: nextIndex, randomQuestion: nextQuestion, history: [...history, nextQuestion] },
      this.speakQuestion
    );
  };

  speakQuestion = () => {
    const { randomQuestion } = this.state;
    const utterance = new SpeechSynthesisUtterance(randomQuestion);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  onClickStart = () => {
    this.setState({ proceed: true });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onStartInterview = () => {
    const userInto = JSON.parse(localStorage.getItem("userInfo"));
    const { email, password } = this.state;

    if (!userInto) {
      this.setState({ errorMsg: "No account found. Please sign up first.", successMsg: "" });
      return;
    }

    if (email === userInto.email && password === userInto.password) {
      this.setState({ start: true, successMsg: "Login successful! Starting interview...", errorMsg: "" });
    } else {
      this.setState({ errorMsg: "Email or password invalid", successMsg: "" });
    }
  };

  onClickSignUp = () => {
    this.setState(prevState => ({
      accountStatus: !prevState.accountStatus,
      errorMsg: "",
      successMsg: ""
    }));
  };

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitUserInfo = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const userDetails = { email, password };

    if (email !== "" && password !== "") {
      localStorage.setItem("userInfo", JSON.stringify(userDetails));
      this.setState({ successMsg: "Account created successfully!", errorMsg: "" });
    } else {
      this.setState({ errorMsg: "Please enter valid details.", successMsg: "" });
    }
  };

  onToggleLogin = () => {
    this.setState(prevState => ({
      accountStatus: !prevState.accountStatus,
      errorMsg: "",
      successMsg: ""
    }));
  };

  renderCreateAccount = () => {
    const { errorMsg, successMsg } = this.state;
    return (
      <div>
        <h1>Create Account</h1>
        <form onSubmit={this.onSubmitUserInfo}>
          <label>Email:</label>
          <input type="email" onChange={this.onChangeEmail} />
          <label>Password:</label>
          <input type="password" onChange={this.onChangePassword} />
          <button type="submit" className="signup-btn">Create Account</button>
          <p>Already have an account?</p>
          <button type="button" className="login-btn" onClick={this.onToggleLogin}>Sign In</button>
          {errorMsg && <p className="error-message">{errorMsg}</p>}
          {successMsg && <p className="success-message">{successMsg}</p>}
        </form>
      </div>
    );
  };

  renderUserDetailsForm = () => {
    const { errorMsg, successMsg } = this.state;
    return (
      <div>
        <h2>Login to Start Interview</h2>
        <label>Email:</label>
        <input name="email" type="email" onChange={this.handleInputChange} />
        <label>Password:</label>
        <input name="password" type="password" onChange={this.handleInputChange} />
        <button className="login-btn" onClick={this.onStartInterview}>Login</button>
        <button className="signup-btn" onClick={this.onClickSignUp}>Sign Up</button>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}
      </div>
    );
  };

  renderCreateAndSignUp = () => {
    const { accountStatus } = this.state;
    return <>{accountStatus ? this.renderCreateAccount() : this.renderUserDetailsForm()}</>;
  };

  renderInterview = () => {
    const { randomQuestion, activeTopic, history } = this.state;
    return (
      <div>
        <h1 className="heading">Interview Practice Questions</h1>
        <select onChange={this.onChangeTopice} value={activeTopic} id="topics">
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="JAVASCRIPT">JavaScript</option>
          <option value="REACT">React</option>
        </select>
        <p className="question">{randomQuestion}</p>
        <button type="button" onClick={this.onNextQuestion} className="next-btn">Next Question</button>
        <h3>Previous Questions:</h3>
        <ul className="history">
          {history.map((q, idx) => <li key={idx}>{q}</li>)}
        </ul>
      </div>
    );
  };

  renderStartScreen = () => (
    <div>
      <h1>Welcome to the Interview Practice</h1>
      <p>Click the start button to begin</p>
      <button onClick={this.onClickStart} className="begin-btn">Start</button>
    </div>
  );

  render() {
    const { proceed, start } = this.state;
    return (
      <div className="app-container">
        {!proceed && this.renderStartScreen()}
        {proceed && !start && this.renderCreateAndSignUp()}
        {proceed && start && this.renderInterview()}
      </div>
    );
  }
}

export default App;
