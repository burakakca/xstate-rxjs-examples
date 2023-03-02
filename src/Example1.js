import React, { useState, useEffect } from "react";
import { Machine } from "xstate";
import { interval } from "rxjs";
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

const formMachine = Machine({
  id: "form",
  initial: "idle",
  states: {
    idle: {
      on: {
        FILL_FORM: "fillingForm",
        SUBMIT_FORM: "submittingForm"
      }
    },
    fillingForm: {
      on: {
        SUBMIT_FORM: "submittingForm"
      }
    },
    submittingForm: {
      on: {
        FORM_SUBMITTED: "formSubmitted"
      }
    },
    formSubmitted: {
      type: "final"
    }
  }
});

function Example1() {
  const [formState, setFormState] = useState(formMachine.initialState);

  useEffect(() => {
    const fillForm$ = fromEvent(document.getElementById("form"), "input").pipe(
      map(() => "FILL_FORM")
    );

    const submitForm$ = fromEvent(
      document.getElementById("submit-button"),
      "click"
    ).pipe(map(() => "SUBMIT_FORM"));

    const subscription = fillForm$.subscribe((event) => {
      setFormState((formState) => formMachine.transition(formState, event));
    });

    const subscription2 = submitForm$.subscribe((event) => {
      setFormState((formState) => formMachine.transition(formState, event));
    });

    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = interval(1000).subscribe(() => {
      // Simulate form submission
      if (Math.random() < 0.5) {
        setFormState((formState) =>
          formMachine.transition(formState, "FORM_SUBMITTED")
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <form id="form">
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" />
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" />
        <button id="submit-button" type="button">
          Submit
        </button>
      </form>
      <div>Form state: {formState.value}</div>
    </div>
  );
}

export default Example1;
