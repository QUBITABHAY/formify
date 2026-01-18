import './App.css'
import Button from './components/common/Button'

function App() {

  const test = () => {
    alert("Done")
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <Button title='Click' onClick={test} />
    </div>
  )
}

export default App
