import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse } from "bootstrap";

import CalorieTracker from "./Tracker.js";
import { Meal, Workout } from "./Item.js";
import "./styles/bootstrap.css";
import "./styles/style.css";

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  //Private methods
  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newMeal.bind(this));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newWorkout.bind(this));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newMeal(e) {
    e.preventDefault();
    const name = document.getElementById("meal-name");
    const calories = document.getElementById("meal-calories");

    //validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all entries!");
      return;
    }

    const meal = new Meal(name.value, Number(calories.value));

    this._tracker.addMeal(meal);

    //Clear the form
    name.value = "";
    calories.value = "";

    //collapse meal form after submitting
    const collapseMeal = document.getElementById("collapse-meal");
    const bootstrapCollapse = new Collapse(collapseMeal, {
      toggle: true,
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    const name = document.getElementById("workout-name");
    const calories = document.getElementById("workout-calories");

    if (name.value === "" || calories.value === "") {
      alert("Please input all entries!");
      return;
    }

    const workout = new Workout(name.value, parseInt(calories.value));

    this._tracker.addWorkout(workout);

    //Clear the form
    name.value = "";
    calories.value = "";

    //collapse workout form after submitting
    const collapseWorkout = document.getElementById("collapse-workout");
    const bootstrapCollapse = new Collapse(collapseWorkout, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        if (type === "meal") {
          this._tracker.removeMeal(id);
        } else {
          this._tracker.removeWorkout(id);
        }
        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLocaleLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please enter a value");
      return;
    }

    this._tracker.setLimit(Number(limit.value));

    //After entry form becomes empty
    limit.value = "";

    //Hide the modal box after setting limit
    const modalEl = document.getElementById("limit-modal");
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
