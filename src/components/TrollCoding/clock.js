import React, { Component } from "react";

export default class Clock extends Component {
    state = {
        time: new Date()
    };

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            time: new Date()
        });
    }

    render() {
        return (
            <div>
                <span>{this.state.time.toLocaleTimeString()}</span>
            </div>
        );
    }
}
