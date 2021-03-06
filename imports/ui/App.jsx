import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import Task from './Task.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text);

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="row">
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <a className="navbar-brand" href="#"><span className="glyphicon glyphicon-th-list" aria-hidden="true">&nbsp;</span>Todo List ({this.props.incompleteCount})</a>
              </div>
              <ul className="navbar-nav navbar-right">
                <AccountsUIWrapper />
              </ul>
            </div>
          </nav>

          <div className="container tasks-panel">
            <ul>
              <label className="hide-completed">
                <input
                  type="checkbox"
                  readOnly
                  checked={this.state.hideCompleted}
                  onClick={this.toggleHideCompleted.bind(this)}
                />
                <span>&nbsp;Hide Completed Tasks</span>
              </label>
            </ul>
            <ul>
              { this.props.currentUser ?
                <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                  <input
                    type="text"
                    ref="textInput"
                    placeholder="Type to add new tasks"
                  />
                </form> : ''
              }
            </ul>
            <ul className="tasks-list">
              {this.renderTasks()}
            </ul>

          </div>
        </div>

    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {

  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
