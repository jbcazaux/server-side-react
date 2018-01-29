import React from 'react';
import * as CounterActions from '../actions/counter';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Counter extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.increment();
    }

    render() {
        return <div>
            <button onClick={this.handleClick}>Press me</button>
            <div>compteur: {this.props.counter}</div>
        </div>;
    }
}

const mapStateToProps = (state) => ({ counter: state.counter });

const mapActionCreatorsToProps = (dispatch) => bindActionCreators(CounterActions, dispatch);

export default connect(mapStateToProps, mapActionCreatorsToProps)(Counter);
