import { BehaviorSubject } from "rxjs";
import { scan } from "rxjs/operators";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";
import { useState, useEffect } from "react";

const counterMachine = Machine(
  {
    id: "counter",
    initial: "active",
    context: {
      count: 0
    },
    states: {
      active: {
        on: {
          INC: {
            actions: "increment"
          },
          DEC: {
            actions: "decrement"
          }
        }
      }
    }
  },
  {
    actions: {
      increment: (context) => {
        context.count = context.count + 1;
      },
      decrement: (context) => {
        context.count = context.count - 1;
      }
    }
  }
);

const action$ = new BehaviorSubject({ type: "INIT", payload: { count: 0 } });

function Counter1() {
  const [current, send] = useMachine(counterMachine);
  const { count } = current.context;
  const [state, setState] = useState({ count: 0 });

  useEffect(() => {
    const subscription = action$
      .pipe(
        scan(
          (state, action) => {
            switch (action.type) {
              case "INC":
                return { count: state.count + 1 };
              case "DEC":
                return { count: state.count - 1 };
              default:
                return state;
            }
          },
          { count: 0 }
        )
      )
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h1>XState: {count}</h1>
      <h1>RxJS: {state.count}</h1>
      <button onClick={() => send("INC")}>Increment (XState)</button>
      <button onClick={() => send("DEC")}>Decrement (XState)</button>
      <button onClick={() => action$.next({ type: "INC" })}>
        Increment (RxJS)
      </button>
      <button onClick={() => action$.next({ type: "DEC" })}>
        Decrement (RxJS)
      </button>
    </div>
  );
}

export default Counter1;
