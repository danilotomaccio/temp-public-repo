import { type FC } from "react";
import { MainController } from "./components/MainController";

const App: FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 space-y-8 flex items-center justify-center">
      <MainController />
    </div>
  );
};

export default App;
