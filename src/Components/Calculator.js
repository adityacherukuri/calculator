import React, { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import { formatOperand } from "../utils";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  REMOVE_DIGIT: "remove-digit",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let result = "";

  if (isNaN(prev) || isNaN(current) || !operation) return result;

  // eslint-disable-next-line default-case
  switch (operation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "÷":
      result = prev / current;
      break;
  }

  return result.toString();
};

const reducer = (state, { type, payload }) => {
  // eslint-disable-next-line default-case
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.reset) {
        return {
          ...state,
          currentOperand: payload.digit,
          reset: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand?.includes("."))
        return state;
      console.log("here", payload.digit);
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (!state.currentOperand && !state.previousOperand) return state;

      if (!state.currentOperand) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (!state.previousOperand) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.REMOVE_DIGIT:
      if (state.reset) {
        return {
          ...state,
          currentOperand: null,
          reset: false,
        };
      }
      if (!state.currentOperand) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (!state.previousOperand || !state.currentOperand || !state.operation)
        return state;
      return {
        ...state,
        reset: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTIONS.CLEAR:
      return {};
  }
};

const Calculator = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="container">
      <div className="grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.REMOVE_DIGIT })}>
          DEL
        </button>
        <OperationButton dispatch={dispatch} operation="÷" />
        <DigitButton dispatch={dispatch} digit="1" />
        <DigitButton dispatch={dispatch} digit="2" />
        <DigitButton dispatch={dispatch} digit="3" />
        <OperationButton dispatch={dispatch} operation="x" />
        <DigitButton dispatch={dispatch} digit="4" />
        <DigitButton dispatch={dispatch} digit="5" />
        <DigitButton dispatch={dispatch} digit="6" />
        <OperationButton dispatch={dispatch} operation="+" />
        <DigitButton dispatch={dispatch} digit="7" />
        <DigitButton dispatch={dispatch} digit="8" />
        <DigitButton dispatch={dispatch} digit="9" />
        <OperationButton dispatch={dispatch} operation="-" />
        <DigitButton dispatch={dispatch} digit="." />
        <DigitButton dispatch={dispatch} digit="0" />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
