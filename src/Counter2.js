import { assign, createMachine } from "xstate";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { useMachine } from "@xstate/react";

const numbers$ = from([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const counterMachine = createMachine({
  initial: "noop",
  context: {
    total: 0
  },
  invoke: {
    src: () => numbers$.pipe(map((number) => ({ type: "UPDATE", number })))
  },
  on: {
    UPDATE: {
      actions: assign({ total: (ctx, evt) => ctx.total + evt.number })
    }
  },
  states: {
    noop: {}
  }
});

function Counter2() {
  const [state] = useMachine(counterMachine);
  return <h1>Total: {state.context.total}</h1>;
}

export default Counter2;
