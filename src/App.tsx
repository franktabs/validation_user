import { Provider } from "react-redux";
import Home from "./pages/Home";
import "./styles/bootstrap/bootstrap.min.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import store from "./redux/store";


const queryClient = new QueryClient()

function App() {
  return (


    <div className="App">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </Provider>
    </div>
  );
}

export default App;
