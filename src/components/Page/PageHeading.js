import React, {Component} from 'react';

class PageHeading extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount() {
        $('.main-heading').css('--bgColor', "#" + this.props.bgColor).css('--textColor', "#" + this.props.textColor);
    }

    render() {
        return (
          <React.Fragment>
            <div className= "main-heading">
                <div className="title-wrapper">
                    <h2>{this.props.title}</h2>
                    <h3>{this.props.description}</h3>
                </div>
            </div>

            <style jsx>{`
              .main-heading {
  background-color: var(--bgColor);
  font-size:15px;
  text-align: center;
  width: 100%;
  height: 280px;
  margin: 0;
  vertical-align: center;

  .title-wrapper {
    position: relative;
    justify-content: center;
    text-align: center;
    max-width: 50%;
    width: 400px;
    left: 0;
    right: 0;
    display: flex;
    vertical-align: middle;
    top: 20px;
    padding: 15px 30px;
    margin: 0 auto;

    h2, h3 {
      margin: 0 auto;
      vertical-align: middle;
      left: 0;
      right: 0;
      position: absolute;
      color: var(--textColor);
      text-align: center;
      display: block;
      justify-content: center;
    }

    h2 {
      font-size: 100px;
    }

    h3 {
      font-size: 38px;
      top: 150px;
    }
  }
}
            `}</style>
          </React.Fragment>
        );
    }
}

export default PageHeading
