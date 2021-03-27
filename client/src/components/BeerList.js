export default function Checkin(props) {
  return (
  <div>
    <h1>Check Ins</h1>
    <h3>Beer Name: {props.checkin.beer.beer_name}</h3>
    <h3>Brewery: {props.checkin.brewery.brewery_name}</h3>
    <img src={props.checkin.brewery.brewery_label} alt=""/>
    <h3>Comment {props.checkin.checkin_comment}</h3>
    <h3>Created: {props.checkin.created_at}</h3>
  </div>
  )}

// beer.beers
