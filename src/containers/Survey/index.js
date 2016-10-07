import React, { Component, PropTypes } from 'react';

class Survey extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    if (this.props.location.state) {
      this.routeToAfter = this.props.location.state.routeToAfter
    }
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.props.router.push(this.routeToAfter);
  }

  render() {
    return (
      <div>
        <div className="panel">
          <p>Please rate your experience</p>

          <button className="primary" onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

Survey.propTypes = {
  router: PropTypes.object
}

export default Survey;
