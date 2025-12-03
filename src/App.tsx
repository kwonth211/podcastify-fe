import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import GlobalStyle from "./styles/GlobalStyle";
import PodcastList from "./components/PodcastList";
import InstallPrompt from "./components/InstallPrompt";

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
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <PodcastList />
        <InstallPrompt />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
