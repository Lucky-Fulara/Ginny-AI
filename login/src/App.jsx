import { auth } from "./firebase";

function App() {
  console.log("Firebase Auth Object:", auth);
  return <h1>Firebase is set up!</h1>;
}

export default App;
