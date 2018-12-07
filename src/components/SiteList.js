import React from 'react'
import Drawer from '@material-ui/core/Drawer'

export default class SiteList extends React.Component {
  state = {
    open: false,
    query: ""
  }


  styles = {
    list: {
      width: "250px",
      padding: "0px 15px 0px"
    },

    bullets: {
      listStyleType: "none",
      padding: 0,
    },
    entList: {
      width: 'auto'
    },
    listLink: {
      background: "transparent",
      border: "none",
      color: "black"

    },
    filterEntry: {
      padding: "3px",
      margin:"30px 0px 10px",
      width: "100%",
      border: "2px solid gray"
    }
  }
  updateQuery = (query) => {

    this.setState({query: query})
    this.props.filterSites(query)
  }

  render = () => {
    return (
      <div>
        <Drawer open={this.props.open} onClose={this.props.toggleDrawer}>
          <div style={this.styles.list}>
            <input
              style={this.styles.filterEntry}
              type="text"
              placeholder="Filter Sites"
              name="filter"
              onChange={event => this.updateQuery.bind(this)(event.target.value)}
              value={this.state.query}/>
            <ul style={this.styles.bullets}>
              {this.props.sites && this.props.sites
                .map((site, index) => {
                  return (
                    <li style={this.styles.bullets.listItem} key={index}>
                      <button style={this.styles.listLink} key={index} onClick={event => this.props.clickListItem(index)}>{site.name}</button>
                    </li>
                  )
                })}

            </ul>
        </div>
      </Drawer>
    </div>
    )
  }
}
