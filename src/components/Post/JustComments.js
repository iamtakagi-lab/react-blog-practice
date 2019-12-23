import React from 'react';

class JustComments extends React.Component {
  constructor(...args) {
    super(...args)
    this.ref = React.createRef()
  }
  render() {
    return (
      <div
        ref={this.ref}
        className="just-comments"
        data-apikey="ee052c89-a193-4a1a-805f-d235db25200f"
      />
    )
  }

  componentDidMount() {
    const s = document.createElement('script');
    s.src = '//just-comments.com/w2.js';
    s.setAttribute('data-timestamp', +new Date());
    this.ref.current.appendChild(s)
  }
}

export default JustComments;
