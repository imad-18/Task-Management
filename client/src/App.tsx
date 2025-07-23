// function returnMyName(name:number|string){
//   console.log(name);
// }

// returnMyName(22);
// returnMyName("gaga");
import TaskForm from './components/TaskForm';

const App: React.FC = ()=> {
  return (
    <div className="App">
      {/* <h1>hello dear</h1> */}
      <TaskForm/>
    </div>
  );
}

export default App;
