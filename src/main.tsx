import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles.css";
import App from "./App.tsx";
import CreatePage from "./CreatePage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create",
    element: <CreatePage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
