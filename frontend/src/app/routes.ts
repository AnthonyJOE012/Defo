import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import CollectionInternal from "./pages/CollectionInternal";
import ManageCollections from "./pages/ManageCollections";
import About from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/article/:id",
    Component: ArticleDetail,
  },
  {
    path: "/collection/:id",
    Component: CollectionInternal,
  },
  {
    path: "/collections/manage",
    Component: ManageCollections,
  },
  {
    path: "/about",
    Component: About,
  },
]);