import TextEditor from "./TextEditor";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { generateUniqueDocumentId } from "./Utils";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<Navigate to={`/documents/${generateUniqueDocumentId()}`} />}
        />
        <Route path="/documents/:id" element={<TextEditor />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
