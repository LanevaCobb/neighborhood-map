import React from 'react'

export default class ErrorMap extends React.Component {
  constructor(props) {
     super(props);
     this.state = { hasError: false };
   }


  render = () => {
    if (this.state.hasError) {
      return <h1>Oh,Oh! An error has occured!</h1>
    }else{
      return <h1>Loading!</h1>
    }

  }

}
