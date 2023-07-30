import { Provider } from "react-redux";
import Home from "./pages/Home";

import "./styles/bootstrap/bootstrap.min.css"
import "./App.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import store from "./redux/store";
import Index from "./pages/Index";


const queryClient = new QueryClient()

function App() {
  return (


    <div className="App">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Index />
        </QueryClientProvider>
      </Provider>
    </div>
  );
}

export default App;
