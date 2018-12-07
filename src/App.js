import React from 'react';
import AtlMap from './components/AtlMap';
import './App.css';
import sites from './data/sites.json'
import SiteList from './components/SiteList'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';



export default class App extends React.Component {
  //setting state at page load, adding createMuiTheme to silence the warnings for a deprecated feature in the @material-ui.
  state = {
    lat: 33.753746,
    lng:  -84.386330,
    zoom: 13,
    all: sites,
    open: false,
    filtered: null,
    hasError: false,
    theme: createMuiTheme({
      typography: {
        useNextVariants: true,
        suppressDeprecationWarnings: true
      }
    })
  }



//styling the list drawer
  styles = {
    toggleButton: {
      marginLeft: 10,
      marginRight: 20,
      left: 10,
      top: 20,
      background: "white",
      padding: 10,
      position: "absolute"

    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  }

  //after component mount, set state to default. all markers visible.
  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filterSites(this.state.all, "")

    })
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    })
  }

//filters the list of sites based on what is being typed in the filter box/
  updateQuery = (query) => {
    this.setState({
      ...this.state,
      open: true,
      filtered: this.filterSites(this.state.all, query)

    })
  }

  filterSites = (sites, query) => {
    return sites.filter(site => site.name.toLowerCase().includes(query.toLowerCase()))
  }

  clickListItem = (index) => {
    this.setState({selectedIndex: index, open: !this.state.open})
  }



  render = () => {
    //Waht is to be displayed and executed on the page.
    return (
     <MuiThemeProvider theme={this.theme}>
      <div className="App">
        <div>
          <IconButton onClick={this.toggleDrawer} aria-label="Open Drawer" style={this.styles.toggleButton}>
            <MenuIcon />
          </IconButton>
        </div>
        <header className="App-header">
          <h1>Historical Landmarks in Atlanta</h1>
        </header>


          <AtlMap
            lat={this.state.lat}
            lng={this.state.lng}
            zoom={this.state.zoom}
            sites={this.state.filtered}
            selectedIndex={this.state.selectedIndex}
            clickListItem={this.clickListItem}


            />
          <SiteList
            sites={this.state.filtered}
            filterSites={this.updateQuery}
            open={this.state.open}
            toggleDrawer={this.toggleDrawer}
            clickListItem={this.clickListItem}/>
      </div>
    </MuiThemeProvider>
    );
  }

}
