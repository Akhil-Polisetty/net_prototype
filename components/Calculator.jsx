import React, { useState, useEffect, useRef } from 'react';
import { evaluate } from 'mathjs';
import './calculator.css'

const Calculator = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const calculatorRef = useRef(null);

    const handleClick = (value) => {
        setInput(input + value);
    };

    const handleClear = () => {
        setInput('');
        setResult('');
    };

    const handleDelete = () => {
        setInput(input.slice(0, -1));
    };

    const handleEquals = () => {
        try {
            const evalResult = evaluate(input);
            setResult(evalResult.toString());
        } catch (error) {
            setResult('Error');
        }
    };

    const handleKeyPress = (event) => {
        if (document.activeElement !== calculatorRef.current && document.activeElement !== inputRef.current) return;
        const { key } = event;
        if ((key >= '0' && key <= '9') || key === '+' || key === '-' || key === '*' || key === '/' || key === '.') {
            setInput(input + key);
        } else if (key === 'Enter') {
            handleEquals();
        } else if (key === 'Backspace') {
            handleDelete();
        } else if (key === 'Escape') {
            handleClear();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [input]);

    return (
        <div
            className="calculator"
            tabIndex="0"
            ref={calculatorRef}
        >
            <div className="display">
                <input type="text" value={input} readOnly />
                <div className="result">{result}</div>
            </div>
            <div className="buttons">
                <button onClick={() => handleClick('1')}>1</button>
                <button onClick={() => handleClick('2')}>2</button>
                <button onClick={() => handleClick('3')}>3</button>
                <button onClick={() => handleClick('+')}>+</button>
                <button onClick={() => handleClick('4')}>4</button>
                <button onClick={() => handleClick('5')}>5</button>
                <button onClick={() => handleClick('6')}>6</button>
                <button onClick={() => handleClick('-')}>-</button>
                <button onClick={() => handleClick('7')}>7</button>
                <button onClick={() => handleClick('8')}>8</button>
                <button onClick={() => handleClick('9')}>9</button>
                <button onClick={() => handleClick('*')}>*</button>
                <button onClick={() => handleClick('0')}>0</button>
                <button onClick={() => handleClick('.')}>.</button>
                <button onClick={handleEquals}>=</button>
                <button onClick={() => handleClick('/')}>/</button>
                <button onClick={handleClear}>C</button>
                <button onClick={handleDelete}>DEL</button>
            </div>
        </div>
    );
};

export default Calculator;
