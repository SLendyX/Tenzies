import React from "react"
import Die from "./Die.jsx"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [gameStartTime, setGameStartTime] = React.useState(new Date())
    const [bestTime, setBestTime] = React.useState(0)

    React.useEffect(() => {
        if(localStorage.getItem("bestTime"))
            setBestTime(JSON.parse(localStorage.getItem("bestTime")))
    }, [])

    React.useEffect(() => {
        localStorage.setItem("bestTime", JSON.stringify(bestTime))
    }, [bestTime])

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRolls(oldRoll => oldRoll+1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
            setGameStartTime(new Date)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    function getTime(){
        
        const currentTime = new Date()
        const timeDifference = (currentTime.getTime() - gameStartTime.getTime())/1000

        if(timeDifference < bestTime || bestTime === 0)
            setBestTime(timeDifference)

        if(timeDifference < 60)
            return `${timeDifference.toFixed(2)} seconds`
        else
            return `${(timeDifference/60).toFixed(2)} minutes`
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <h3 className="time">Best time: {bestTime}</h3>
            <h3>Rolled: {rolls}</h3>
            {tenzies && <h3 className="time">Time: {getTime()}</h3>}
        </main>
    )
}