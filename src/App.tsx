import './App.css'
import Checkbox from './components/common/Checkbox'

function App() {

  return (
    <div className='flex justify-center items-center h-screen'>
      <Checkbox title='Check' checked={false} />
    </div>
  )
}

export default App
