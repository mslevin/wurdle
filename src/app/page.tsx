'use client'

import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'simple-keyboard/build/css/index.css';

const NUM_LETTERS = 5;
const BACKSPACE = '{bksp}';
const ENTER = '{enter}';

const WORD = 'plase';

function LetterBox({letter} : {letter: LetterData}) {
  const colorVariants: { [key: string]: string} = {
    'unknown': 'bg-white',
    'wrongSpot': 'bg-amber-300',
    'correct': 'bg-lime-500'
  }
  return (
    <div className={`${colorVariants[letter.status]} flex flex-row justify-center items-center w-11 h-11 m-1 rounded-lg border-2`}>
      {letter.letter}
    </div>
  );
}

function LetterRow({letters}: {letters: LetterData[]}) {
  const letterBoxes = [];
  for(let i=0;i<NUM_LETTERS;i++) {
    letterBoxes.push(<LetterBox key={`${i}ltr`} letter={letters[i] ? letters[i] : {letter: '', status: 'unknown'}}/>)
  }
  return (
    <div className="flex flex-row">
      {letterBoxes}
    </div>
  );
}

function processRow(letters: LetterData[]) : LetterData[] {
  return letters.map((data, i) => {
    let status = 'unknown';
    // check to see if the letter is in the word
    let index = WORD.indexOf(data.letter);
    if (index > -1) {
      status = 'wrongSpot';
      if (index === i) {
        status = 'correct'
      }
    }
    return {
      ...data,
      status
    }

  })
}

interface LetterData {
  letter: string,
  status: string, // unknown, wrongSpot, correct
}


export default function Home() {
  const [ rowIndex, setRowIndex ] = useState(0);
  const [ letterIndex, setLetterIndex ] = useState(0);
  const [ board, setBoard ] = useState<LetterData[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
  ]);

  const generateBoard = () : JSX.Element[] => {
    return board.map((row: LetterData[], i) => {
      return <LetterRow key={i} letters={row}/>
    })
  }
  console.log(board)
  return (
    <main className="flex min-h-screen flex-col items-center p-24">    
      <h1>Wurdle</h1>
      <h3>It's like Wordle, but slightly misspelled.</h3>

      <div className="flex flex-col items-center">
        {generateBoard()}
        <Keyboard
          layout={kbLayout}
          disableButtonHold={true}
          newLineOnEnter={false}
          onKeyPress={(key) => {
            console.log(rowIndex, letterIndex, key)
            if (key === BACKSPACE) {
              let newLetterIndex = letterIndex - 1;
              if (newLetterIndex < 0) newLetterIndex = 0;
              const newBoard = [...board];
              newBoard[rowIndex] = [...newBoard[rowIndex]];
              newBoard[rowIndex][newLetterIndex] = {letter: '', status: 'unknown'};
              setBoard(newBoard);
              setLetterIndex(newLetterIndex);
            }
            else if (key === ENTER) {
              if ((letterIndex === NUM_LETTERS) && (board[rowIndex][letterIndex - 1].letter !== '')) {
                // process row
                const newBoard = [...board];
                let processed = processRow(newBoard[rowIndex]);
                newBoard[rowIndex] = processed;
                setBoard(newBoard);
                setRowIndex(rowIndex+1);
                setLetterIndex(0);
              }
            }
            else if (letterIndex < NUM_LETTERS) {
              const newBoard = [...board];
              newBoard[rowIndex] = [...newBoard[rowIndex]];
              newBoard[rowIndex][letterIndex] = {letter: key, status: 'unknown'};
              setBoard(newBoard);
              setLetterIndex(letterIndex+1)
            }
          }}
        />
      </div>

    </main>
  )
}

const kbLayout = {
  'default': [
    'q w e r t y u i o p',
    'a s d f g h j k l',
    '{bksp} z x c v b n m {enter}'
  ]
}