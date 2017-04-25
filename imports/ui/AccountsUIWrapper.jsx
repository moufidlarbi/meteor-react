import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import AccountsUI from 'meteor/ian:accounts-ui-bootstrap-3'
import React from 'react'
import ReactDOM from 'react-dom'

export default class AccountsUIWrapper extends React.Component {
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template._loginButtons,
      ReactDOM.findDOMNode(this.refs.container))
  }
  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view)
  }
  render() {
    return <span ref="container" />
  }
}
