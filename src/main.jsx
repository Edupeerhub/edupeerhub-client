import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "stream-chat-react/dist/css/v2/index.css";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
