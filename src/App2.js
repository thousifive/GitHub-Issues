import React, { Component } from "react";
import HeaderContainer from "./components/HeaderContainer";
import IssuesContainer from "./components/IssuesContainer";
import Pagination from "./components/Pagination";
// import issues from "./issues.json";
import moment from "moment";
import "./App.css";

let labelList = [];
let authorList = [];
class App2 extends Component {
  constructor() {
    super();
    this.state = {
      open: "",
      close: "",
      data: null,
      labelList: [],
      authorList: [],
      issuesData: [],
      page: 0
    };

    this.setData = this.setData.bind(this);
  }

  issueData = () => {
    this.setState({
      data: this.state.issuesData
    });
  };

  // set status
  openStateHandler = status => {
    this.setState({
      data: this.state.issuesData.filter(issue => issue.state === status)
    });
  };

  closeStateHandler = status => {
    this.setState({
      data: this.state.data.filter(issue => issue.state === status)
    });
  };

  labelDropDown = e => {
    let tempArray = this.state.data.filter(issue => {
      let temp = false;
      issue.labels.forEach(label => {
        if (label.name === e.target.value) {
          temp = true;
        }
      });
      return temp;
    });
    this.setState({
      data: tempArray
    });
  };

  authorDropDown = e => {
    this.setState({
      data: this.state.data.filter(issue => issue.user.login === e.target.value)
    });
  };

  sortHandler = e => {
    let sortedData = [];
    if (e.target.value === "Oldest") {
      sortedData = this.state.data.sort((a, b) => {
        return moment(a.created_at) - moment(b.created_at);
      });
    } else if (e.target.value === "Newest") {
      sortedData = this.state.data.sort((a, b) => {
        return moment(b.created_at) - moment(a.created_at);
      });
    } else if (e.target.value === "Recently Upadted") {
      sortedData = this.state.data.sort((a, b) => {
        return moment(b.updated_at) - moment(a.updated_at);
      });
    } else if (e.target.value === "Least Recently Updated") {
      sortedData = this.state.data.sort((a, b) => {
        return moment(a.updated_at) - moment(b.updated_at);
      });
    }

    this.setState({
      data: sortedData
    });
  };

  searchHandler = e => {
    if (e.key === "Enter") {
      this.setState({
        data: this.state.data.filter(
          issue => issue.title.toLowerCase().indexOf(e.target.value) !== -1
        )
      });
    }
  };
  // self =this;
  setData(value) {
    let self = this;
    fetch(
      `https://api.github.com/repos/thousif7/test-issues/issues?page=${value}`
    )
      .then(res => res.json())
      .then(issues => {
        self.setState({
          data: issues,
          open: issues.filter(item => item.state === "open").length,
          close: issues.filter(item => item.state === "close").length,
          labelList: issues.forEach(issue => {
            issue.labels.forEach(label => {
              if (!labelList.includes(label.name)) labelList.push(label.name);
            });
          }),

          authorList: issues.forEach(issue => {
            if (!authorList.includes(issue.user.login))
              authorList.push(issue.user.login);
          }),
          issuesData: issues
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentDidMount() {
    this.setState(
      {
        page: this.props.children[1].match.params.pageNo
      },
      () => {
        this.setData(this.props.children[1].match.params.pageNo);
      }
    );
  }

  componentDidUpdate(props) {
    if (this.props !== props) {
      this.setState(
        {
          page: this.props.children[1].match.params.pageNo
        },
        () => {
          this.setData(this.props.children[1].match.params.pageNo);
        }
      );

      // this.setData(this.props.children[1].match.params.pageNo)
    }
  }

  handlePage = e => {
    let page = e.selected + 1;
    this.props.children[1].history.push("/page/" + page);
    // this.setData(e.selected + 1);
  };

  render() {
    if (this.state.data === null) {
      return (
        // loading animation css
        <div className="loading">
          <h1>Be patient, We're working on it</h1>
          <div class="sk-cube-grid">
            <div class="sk-cube sk-cube1" />
            <div class="sk-cube sk-cube2" />
            <div class="sk-cube sk-cube3" />
            <div class="sk-cube sk-cube4" />
            <div class="sk-cube sk-cube5" />
            <div class="sk-cube sk-cube6" />
            <div class="sk-cube sk-cube7" />
            <div class="sk-cube sk-cube8" />
            <div class="sk-cube sk-cube9" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <HeaderContainer
            issuesHandler={this.issueData}
            closeStateHandler={this.closeStateHandler}
            openStateHandler={this.openStateHandler}
            openState={this.state.open}
            closeState={this.state.close}
            labels={labelList}
            labelsHandler={this.labelDropDown}
            authors={authorList}
            authorsHandler={this.authorDropDown}
            dataToSort={this.sortHandler}
            searchData={this.searchHandler}
          />
          <div className="issues-data">
            {this.state.data.map(item => (
              <IssuesContainer value={item} />
            ))}
          </div>
          <Pagination
            handlePage={this.handlePage}
            page={parseInt(this.props.children[1].match.params.pageNo) - 1}
          />
        </div>
      );
    }
  }
}
export default App2;