import React from 'react';

class Test extends React.Component {
    static displayName = 'Test';
    render() {
        const { text } = this.props;
        return <div>{text}</div>;
    }
}

export default Test;
