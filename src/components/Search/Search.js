import React from "react";
import axios from 'axios'

class Search extends React.Component {

  async componentDidMount() {
    const res = await axios.get('/search.json')
    this.data = res.data
  }
}

export default Search;
