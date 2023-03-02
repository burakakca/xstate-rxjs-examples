import { useState, useEffect } from "react";
import { createMachine, interpret } from "xstate";
import { BehaviorSubject } from "rxjs";

const flipMachine = createMachine({
  id: "flip",
  initial: "active",
  states: {
    active: {
      on: { TOGGLE: "inactive" }
    },
    inactive: {
      on: { TOGGLE: "active" }
    }
  }
});

const initialState = flipMachine.initialState;

const state$ = new BehaviorSubject(initialState);

const service = interpret(flipMachine).onTransition((state) => {
  state$.next(state);
});

service.start();

function Flip() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  const isInactive = state.matches("inactive");

  return (
    <div>
      <h1>Flip: {isInactive ? "Inactive" : "Active"}</h1>
      <button onClick={() => service.send("TOGGLE")}>Toggle</button>
    </div>
  );
}

export default Flip;
