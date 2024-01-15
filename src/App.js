import AppRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./utils/theme";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AppRoutes />
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
