import React from 'react';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({count: prevState.count + 1}));
    }

    render() {
        return <div>
            <button onClick={this.handleClick}>Press me</button>
            <div>compteur: {this.state.count}</div>
        </div>;
    }
}

export default App;