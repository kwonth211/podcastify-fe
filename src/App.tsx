import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import PodcastList from "./components/PodcastList";

const theme = {
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    background: "#f5f7fa",
    text: "#333",
    textLight: "#666",
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PodcastList />
    </ThemeProvider>
  );
}

export default App;

