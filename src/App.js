import React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy } from "@progress/kendo-data-query";
import { Chart } from "@progress/kendo-charts-react-wrapper";
import "@progress/kendo-ui";
import "@progress/kendo-theme-default/dist/all.css";
import "./App.css";

import { nutrition } from "./nutrition";

class App extends React.Component {
  constructor(props) {
    super(props);
    const initialFilter = {
      logic: "and",
      filters: [
        {
          field: "Description",
          operator: "contains",
          value: "Apple"
        }
      ]
    };
    this.state = {
      data: this.getNutrition(initialFilter),
      filter: initialFilter,
      habitId: 0,
      habitName: "",
      habitIteration: 0,
      habits: [],
      habitsOptions: [
        "Drink 1 Cup of Water",
        "1 Hour of Coding",
        "10 Pushups",
        "Eat Something Healthy",
        "1 Hour of Reading",
        "10 Minutes of Meditation"
      ],
      series: [{ data: [1, 1, 1] }],
      seriesDefaults: { type: "pie" },
      graphProtien: 0,
      graphCarb: 0,
      graphSugar: 0
    };
  }

  handleNameChange = event => {
    this.setState({
      habitName: event.target.value
    });
  };

  handleIterationChange = event => {
    this.setState({
      habitIteration: event.target.value
    });
  };

  handleAddHabit = event => {
    this.setState({
      habits: [
        ...this.state.habits,
        {
          key: this.state.habitId,
          name: this.state.habitName,
          iterations: this.state.habitIteration
        }
      ],
      habitId: this.state.habitId + 1
    });
  };

  handleFilterChange = event => {
    this.setState({
      data: this.getNutrition(event.filter),
      filter: event.filter
    });
  };

  handleProteinChange = event => {
    this.setState({
      graphProtien: event.target.value
    });
    this.handelGraphChange();
  };

  handleCarbChange = event => {
    this.setState({
      graphCarb: event.target.value
    });
    this.handelGraphChange();
  };

  handleSugarChange = event => {
    this.setState({
      graphSugar: event.target.value
    });
    this.handelGraphChange();
  };

  handelGraphChange = () => {
    this.setState({
      series: [
        {
          data: [this.graphProtien, this.graphCarb, this.graphSugar]
        }
      ]
    });
  };

  getNutrition = filter => {
    return filterBy(nutrition, filter);
  };

  render() {
    console.log(this.state.data);
    return (
      <div className="App">
        <h1>Healthy Things</h1>
        <div className="healthy-habits">
          <ul>
            {this.state.habits.map(habit => [
              <li key={habit.habitId}>
                <h3>{habit.name}</h3>
                <div className="iteration-area">
                  {[...Array(habit.iterations)].map((iteration, index) => {
                    return <input key="index" type="radio"></input>;
                  })}
                </div>
              </li>
            ])}
          </ul>
        </div>
        <div className="add-habits">
          <DropDownList
            data={this.state.habitsOptions}
            value={this.state.habitName}
            onChange={this.handleNameChange}
          />
          <NumericTextBox
            format="0"
            min={0}
            max={20}
            value={this.state.habitIteration}
            onChange={this.handleIterationChange}
          />
          <Button primary onClick={this.handleAddHabit}>
            Add Habit
          </Button>
        </div>
        <div className="nutrition-grid">
          <Grid
            data={this.state.data}
            style={{ maxHeight: "500px" }}
            filterable
            filter={this.state.filter}
            onFilterChange={this.handleFilterChange}
          >
            <Column field="Description" title="Food"></Column>
            <Column field="Measure" title="Amount"></Column>
            <Column
              field="Protein(g) Per Measure"
              title="Protein"
              filter="numeric"
            ></Column>
            <Column
              field="Carbohydrate, by difference(g) Per Measure"
              title="Carbohydrate"
              filter="numeric"
            ></Column>
            <Column field="Sugars, total(g)Per Measure" title="Sugar"></Column>
          </Grid>
        </div>
        <div className="food-graph-inputs">
          <p>
            Protein Amount:-
            <input type="text" onChange={this.handleProteinChange} />
          </p>
          <p>
            Carb Amount:-
            <input type="text" onChange={this.handleCarbChange} />
          </p>
          <p>
            Sugar Amount:-
            <input type="text" onChange={this.handleSugarChange} />
          </p>
        </div>
        <div className="food-graph">
          <Chart
            seriesDefaults={this.state.seriesDefaults}
            series={this.state.series}
          />
        </div>
      </div>
    );
  }
}

export default App;
