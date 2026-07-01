import Main from "./components/Main";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div className="bg-black w-screen h-screen overflow-hidden">
      <NavBar />
      <div className="mt-[13px]">
        <Main />
      </div>
    </div>
  );
}
