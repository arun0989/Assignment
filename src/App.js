import React, { Component } from "react";
import Loading from './Loading';



import "./index.css";
//import "./flags.min.css";

//import countriesList from "./countries.json";

class App extends Component {
  state = {
    search: "",
    results: [],
    loading: true,
    notFoundText: ''
  };
  componentDidMount() {
    this.performSearch();
  }
  performSearch = (query = '') => {
    this.setState({
      loading: true,
      notFoundText: ''
    });
    query = this.state.search ? this.state.search : '';
    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
      .then(response => response.json())
      .then(responseData => {

        console.log(responseData)
        this.setState({
          results: responseData,
          loading: false,
          notFoundText: ''
        });
        if(responseData && responseData.length === 0){
          this.setState({
            notFoundText: `No Result Found for ${this.state.search}. Please try again.`
          })
        }
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }
  renderCountry = country => {
    const { search, results } = this.state;
    var code = country.show.name.toLowerCase();

    return (
      <div className="list-items" style={{ marginTop: "20px" }} key={country.show.id}>
        <div>
          <div>
            <p className="">
              <img
                src={country && country.show && country.show.image ? country.show.image.medium : ''}
                className={"flag flag-" + code}
                alt={country.show.name + 'Image not found'}
              />
            </p>
            <div title={country.show.name}>
              Country: {country && country.show && country.show.name}
            </div>
            <div>
              <p>Score: {country && country.score}</p>
              <p> Runtime: {country && country.show.runtime}</p>
              <p>Premiered: {country && country.show.premiered}</p>
            </div>
            {country && country.show && country.show._links &&(<div>
              Links:
              {country.show._links.previousepisode && country.show._links.previousepisode.href && <p> <a href={country.show._links.previousepisode.href}>Previous Episode </a></p>}
              {country.show._links.self && country.show._links.self.href && <p> <a href={country.show._links.self.href}>Self Link</a></p> }
              {country.show._links.nextepisode && country.show._links.nextepisode.href &&  <p> <a href={country.show._links.nextepisode.href}>Next Episode Link</a></p>}
            </div>)}
          </div>
        </div>
      </div>
    );
  };

  onchange = e => {
    this.setState({ search: e.target.value });
  };

  render() {
    const { search, results, loading, notFoundText } = this.state;
    //let filteredCountries = ''
    // if (results) {
    //   filteredCountries = results.filter(country => {
    //     return country.show.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    //   });
    // }


    return (
      <div className="flyout">
        
        <main style={{ marginTop: "2rem" }}>
          <div className="container">
          {loading ? <Loading /> :
            <div className="row">
              
              <div className="col">
                <input
                  type="text"
                  label="Search Country"
                  icon="search"
                  value={this.state.search}
                  placeholder="Search Result"
                  onChange={this.onchange}
                  className="input-box"
                />
                <button type="button"
                  onClick={this.performSearch}
                >
                 Search Results
                </button>
              </div>
              
            </div>}
            <div className="row">
              {results && search && results.length > 0 && !loading && (results.map(country => {
                return this.renderCountry(country);
              }))}
              {notFoundText}
            </div>
          </div>
        </main>

      </div>
    );
  }
}

export default App;
