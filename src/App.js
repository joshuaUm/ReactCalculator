import React, { Component } from "react";
import { list } from "./data/list.json";
import { CSSTransitionGroup } from "react-transition-group";
/*
data 
- mainList - prop?
- filteredList - prop
- type value - state
- level value - state 
- weapon value - state

*/

class TableElement extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    // this.componentWillUnmount = () => {
    //   console.log("gone");
    //   setTimeout(()=>console.log("thing"),1000)
    // };
  }
  componentWillLeave(callback) {
    console.log("called");
    callback();
  }
  componentDidLeave() {
    console.log("l");
  }

  render() {
    return (
      <tr
        className={this.props.isLast ? "table-warning" : "table-secondary"}
        key={this.props.propkey}
      >
        <td key={this.props.rankReq}>{this.props.rankReq}</td>
        <td key={this.props.price}>${this.props.price}</td>
      </tr>
    );
  }
}

// const T = delayUnmounting(TableElement)

// const TableE = delayUnmounting(TableElement)

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    // this.componentDidUpdate = ()=> {
    //   this.props.data.map()
    // }

    this.craftTable = () =>
      this.props.data.map((i, v) => (
        <TableElement
          key={v}
          propkey={v}
          rankReq={i.rankReq}
          price={i.price}
          isLast={v == this.props.data.length - 1}
        />
      ));
  }

  render() {
    return (
      <table className="table table-hover">
        <thead>
          <tr key="header">
            <th key="rank">Rank</th>
            <th key="price">Price</th>
          </tr>
        </thead>
        <CSSTransitionGroup
          component="tbody"
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.craftTable()}
        </CSSTransitionGroup>
      </table>
    );
  }
}

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleChange = this.props.handleChange;
    this.handleSubmit = this.props.handleSubmit;
    this.handleType = this.props.handleType;
    this.craftList = () =>
      this.props.data.map((v, i) => (
        <option key={i}>
          {"[" + v.rankReq + "]"} {v.name}
        </option>
      ));
  }

  render() {
    return (
      <form>
        <fieldset>
          <div>
            <label className="col-form-label">
              Type:
              <select
                className="form-control"
                id="type"
                onChange={this.handleType}
                value={this.props.type}
              >
                {this.props.type === -1 ? (
                  <option value="">Select Type</option>
                ) : (
                  ""
                )}
                <option value="0">Primary</option>
                <option value="1">Secondary</option>
                <option value="2">Melee</option>
              </select>
            </label>
          </div>
          <div>
            <label className="col-form-label">
              Level:
              <input
                className="form-control"
                type="number"
                value={this.props.rank}
                onChange={this.handleChange("rank")}
                min="1"
                max="999"
              ></input>
            </label>
          </div>
          <label className="col-form-label">
            Weapon:
            <select
              id="weapon"
              className="form-control"
              onChange={this.handleChange("weapon")}
              value={this.props.weapon}
            >
              {!this.props.weapon ? (
                <option value="">Select Weapon</option>
              ) : (
                ""
              )}
              {this.craftList()}
            </select>
          </label>
          <div></div>
        </fieldset>
      </form>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: -1,
      rank: 1,
      weapon: "",
    };
    this.handleChange = (key) => (event) =>
      this.setState({ [key]: event.target.value });
    this.handleType = (event) =>
      this.setState({ weapon: "", type: event.target.value });
  }

  abbr(num) {
    var str = num.toString().split(".");
    if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
    if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, "$1 ");
    }
    return str.join(".");
  }

  filter() {
    if (!this.state.weapon) return [];
    const weaponstr = this.state.weapon
      .split(" ")
      .filter((v) => !/[\[\]]/gi.test(v))
      .join(" ");

    const weapon = list.find((v) => v.name === weaponstr);
    const levels = [];
    let final = weapon.price;
    const priceIncr = weapon.priceIncr;
    for (let i = weapon.rankReq; i >= this.state.rank; i--) {
      levels.push({ rankReq: i, price: this.abbr(final) });
      final += priceIncr;
    }
    return levels.reverse();
  }

  render() {
    return (
      <div className="container">
        <Input
          handleChange={this.handleChange}
          handleType={this.handleType}
          handleSubmit={this.handleSubmit}
          {...this.state}
          data={list.filter((v) => v.type == this.state.type)}
        ></Input>
        <div className="table-container">
          <Table data={this.filter()}></Table>
        </div>
      </div>
    );
  }
}

export default App;
