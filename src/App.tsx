import { useState } from 'react'
import './App.css'
import RadioButton from './components/common/RadioButton'

function App() {
  const [selectedOption, setSelectedOption] = useState('Radio')

  const handleRadioChange = (value: string) => {
    setSelectedOption(value)
  }

  return (
    <div className='flex justify-center items-center h-screen gap-4'>
      <RadioButton
        title='Radio'
        name='group1'
        value='Radio'
        checked={selectedOption === 'Radio'}
        onChange={handleRadioChange}
      />
      <RadioButton
        title='Ok'
        name='group1'
        value='Ok'
        checked={selectedOption === 'Ok'}
        onChange={handleRadioChange}
      />
      <RadioButton
        title='No'
        name='group1'
        value='No'
        checked={selectedOption === 'No'}
        onChange={handleRadioChange}
      />
    </div>
  )
}

export default App
