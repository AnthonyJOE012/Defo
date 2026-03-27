import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CollectionProvider } from "./contexts/CollectionContext";
import { DataProvider } from "../contexts/DataContext";

export default function App() {
  return (
    <LanguageProvider>
      <CollectionProvider>
        <DataProvider>
          <RouterProvider router={router} />
          <Toaster />
        </DataProvider>
      </CollectionProvider>
    </LanguageProvider>
  );
}