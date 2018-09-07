/**
 *
 * LoginForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginForm from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log('A name was submitted: ', this.state);
    const data = new FormData();
    data.append('user[email]',this.state.username);
    data.append('user[password]',this.state.password);

    const d = {
      method: "post",
      body: data,
      };
    const postSession = (formData) => fetch('https://beenverified.docker/api/v5/session', formData);
    return postSession(d).then(response => {
        console.log(response)
        return response.json()
      })
      .then(resjson => {
        const userCode = resjson.account.user_info.user_code;
        console.log('handle submit ran', resjson);
        const getUserAccount = fetch('https://beenverified.docker/api/v5/account');
        return getUserAccount.then(response => response.json())
          .then(res => {
            this.setState({
              firstName: res.account.user_info.first_name,
              lastName: res.account.user_info.last_name,
            });
          })
          .catch(err => {
            console.log('account error', err);
          });
      })
      .catch(err => {
        console.log('session error', err);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

LoginForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginform: makeSelectLoginForm(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'loginForm', reducer });
const withSaga = injectSaga({ key: 'loginForm', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LoginForm);
