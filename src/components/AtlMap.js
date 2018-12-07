import React from 'react'
import {Map, GoogleApiWrapper, InfoWindow} from 'google-maps-react'
import ErrorMap from '../components/ErrorMap'
const API_KEY = "AIzaSyCj9buf-LC3AeYoSVMtS9drHoGUvumfulQ"
const FS_Client = "L1E4GB11PHFGHSV1PX4J5MQWTFYRB5APPHEW2I5NPNE3JTYM"
const FS_Secret = "BYABHSOK4ZSMZTJGCVC1HDB50NTPBRIUYM43KONJ40K1FIHW"
const FS_Version = "20180323"

class AtlMap extends React.Component {
  //set the app state at page load.
  state = {
    map : null,
    markers: [],
    markerProps: [],
    clickedMarker: null,
    clickedMarkerProps: [],
    showInfoWindow: false,
    hasError: false
  }


  componentWillReceiveProps = (props) => {
    if (this.state.markers.length !== props.sites.length) {
      this.closeInfoWindow()
      this.updateMarkers(props.sites)
      this.setState({activeMarker: null})
    }


    if (props.selectedIndex === null || typeof(props.selectedIndex) === 'undefined') {
      return
    }
    this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex])
  }
  readyStatus = (props, map) => {
  this.setState({map})
  this.updateMarkers(this.props.sites)
  }

  closeInfoWindow = () => {
    if (this.state.clickedMarker && this.state.clickedMarker.setAnimation(null))
    this.setState({showInfoWindow:false, clickedMarker: null,
    clickedMarkerProps: null})
  }

  getSiteInfo = (props, data) => {
    return data.response.venues
    .filter(item => item.name.includes(props.name) || props.name.includes(item.name))
  }

  onMarkerClick = (props, marker, event) => {
    this.closeInfoWindow();

    //Get info about the site from FourSquare
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_Client}&client_secret=${FS_Secret}&v=${FS_Version}&radius=100&ll=${props.position.lat},${props.position.lng}`
    let headers = new Headers()
    let request = new Request(url, {
      method: 'GET',
      headers
    })

    let clickedMarkerProps
    fetch(request)
      .then(response => response.json())
      .then(result => {
        let historySite = this.getSiteInfo(props, result)
        clickedMarkerProps = {
          ...props,
          foursquare: historySite[0]
        }
        //grabs the images of site from Foursquare. Set animation to the markers when clicked
        if (clickedMarkerProps.foursquare) {
          let url = `https://api.foursquare.com/v2/venues/${historySite[0].id}/photos?client_id=${FS_Client}&client_secret=${FS_Secret}&v=${FS_Version}`
          fetch(url)
            .then(response => response.json())
            .then(result => {
              clickedMarkerProps = {
                ...clickedMarkerProps,
                images: result.response.photos
              }
              if (this.state.clickedMarker)
                this.state.clickedMarker.setAnimation(null)
              marker.setAnimation(this.props.google.maps.Animation.DROP)
              marker.setAnimation(this.props.google.maps.Animation.BOUNCE)
              this.setState({showInfoWindow: true, clickedMarker: marker, clickedMarkerProps})
            })
        }else{
          marker.setAnimation(this.props.google.maps.Animation.DROP)
          marker.setAnimation(this.props.google.maps.Animation.BOUNCE)
          this.setState({showInfoWindow: true, clickedMarker: marker, clickedMarkerProps})
        }
      })

  }


  updateMarkers = (sites) => {
    if(!sites)
      return
    //adds markers to the map using the site info.
    this.state.markers.forEach(marker => marker.setMap(null))

    let markerProps = []
    let markers = sites.map((site, index) => {
        let mProps = {
          key: index,
          index,
          name: site.name,
          address: site.address,
          position: site.pos,
          url: site.url
        }
        markerProps.push(mProps)

        let marker = new this.props.google.maps.Marker({
          position: site.pos,
          map: this.state.map
        })
        marker.addListener('click', () => {
          this.onMarkerClick(mProps, marker, null)
        })
        return marker
    })
    this.setState({markers, markerProps})

  }

  //positioning the map's center, layout, infoWindow info and images from Foursquare styles and semantics
    render = () => {
    const mapCenter = {
      lat: this.props.lat,
      lng: this.props.lng
    }

    let avProps = this.state.clickedMarkerProps

    const style = {
      width: '100%',
      height: '100%'
    }

    return (
      <Map
        role="application"
        aria-label="map"
        style={style}
        onReady={this.readyStatus}
        google={this.props.google}
        initialCenter= {mapCenter}
        zoom={this.props.zoom}
        onClick={this.closeInfoWindow}>
        <InfoWindow
          marker={this.state.clickedMarker}
          visible={this.state.showInfoWindow}
          onClose={this.closeInfoWindow}>
          <div>
            <h3>{avProps && avProps.name}</h3>
            {avProps && avProps.url
              ? (
                <a href={avProps.url}>See Website</a>
              ) : ""}
            {avProps && avProps.images
              ? (
                <div><img alt={avProps.name + "Picture of Site"}
                          src={avProps.images.items[0].prefix + "100x100"+ avProps.images.items[0].suffix}></img>
                          <p>Picture from Foursquare</p>
                </div>
              )
              :""
            }
          </div>
        </InfoWindow>

      </Map>
    )
  }
}
export default GoogleApiWrapper({apiKey: API_KEY, LoadingContainer: ErrorMap})(AtlMap)
